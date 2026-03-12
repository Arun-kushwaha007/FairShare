import { forwardRef, Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import Redis from 'ioredis';
import { AppConfigService } from '../config/app-config.service';
import { PrismaService } from '../common/prisma.service';
import { JobsQueueService } from '../jobs/jobs-queue.service';

export type NotificationType = 'expense_created' | 'expense_deleted' | 'settlement_created' | 'group_invite';

type NotificationEventPayload = {
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
};

@Injectable()
export class NotificationsService implements OnModuleInit, OnModuleDestroy {
  private static readonly maxChunkRetries = 3;
  private static readonly baseRetryDelayMs = 500;
  private readonly logger = new Logger(NotificationsService.name);
  private readonly channel = 'fairshare:notifications';
  private readonly publisher: Redis;
  private readonly subscriber: Redis;
  private readonly expo: Expo;

  constructor(
    config: AppConfigService,
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => JobsQueueService))
    private readonly jobsQueueService: JobsQueueService,
  ) {
    this.publisher = new Redis(config.redisUrl);
    this.subscriber = new Redis(config.redisUrl);
    this.expo = new Expo();
  }

  async onModuleInit(): Promise<void> {
    await this.subscriber.subscribe(this.channel);
    this.subscriber.on('message', (channel, message) => {
      if (channel !== this.channel) {
        return;
      }

      this.logger.log(
        JSON.stringify({
          event: 'notification_event_received',
          channel,
          message,
        }),
      );
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.subscriber.quit();
    await this.publisher.quit();
  }

  async sendPushNotification(userIds: string[], payload: NotificationEventPayload): Promise<void> {
    if (userIds.length === 0) {
      return;
    }

    const event = {
      userIds,
      payload,
      queuedAt: new Date().toISOString(),
    };

    await this.publisher.publish(this.channel, JSON.stringify(event));

    this.logger.log(
      JSON.stringify({
        event: 'notification_event_queued',
        channel: this.channel,
        payload: event,
      }),
    );

    await this.jobsQueueService.enqueueNotification({ userIds, payload });
  }

  async processQueuedNotification(input: { userIds: string[]; payload: NotificationEventPayload }): Promise<void> {
    await this.deliverExpoNotifications(input.userIds, input.payload);
  }

  private async deliverExpoNotifications(userIds: string[], payload: NotificationEventPayload): Promise<void> {
    const rows = await this.prisma.pushToken.findMany({
      where: { userId: { in: userIds } },
      select: { token: true },
    });

    const validTokens = rows
      .map((row) => row.token)
      .filter((token) => Expo.isExpoPushToken(token));

    if (validTokens.length === 0) {
      return;
    }

    const messages: ExpoPushMessage[] = validTokens.map((to) => ({
      to,
      sound: 'default',
      title: payload.title,
      body: payload.body,
      data: {
        notificationType: payload.type,
        ...payload.data,
      },
    }));

    const chunks = this.expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      await this.sendChunkWithRetry(chunk, NotificationsService.maxChunkRetries);
    }
  }

  private async sendChunkWithRetry(chunk: ExpoPushMessage[], retries: number): Promise<void> {
    try {
      const tickets = await this.expo.sendPushNotificationsAsync(chunk);
      await this.removeInvalidTokens(chunk, tickets);
      this.logger.log(
        JSON.stringify({
          event: 'notification_push_sent',
          ticketCount: tickets.length,
        }),
      );
    } catch (error) {
      this.logger.error('Expo push send failed', error instanceof Error ? error.stack : undefined);
      if (retries > 0) {
        const attempt = NotificationsService.maxChunkRetries - retries + 1;
        const delayMs = NotificationsService.baseRetryDelayMs * (2 ** (attempt - 1));
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        await this.sendChunkWithRetry(chunk, retries - 1);
      }
    }
  }

  private async removeInvalidTokens(chunk: ExpoPushMessage[], tickets: ExpoPushTicket[]): Promise<void> {
    const invalidTokens = tickets
      .map((ticket, index) => {
        if (ticket.status !== 'error') {
          return null;
        }

        const errorCode = ticket.details && 'error' in ticket.details ? ticket.details.error : undefined;
        if (errorCode !== 'DeviceNotRegistered') {
          return null;
        }

        const recipient = chunk[index]?.to;
        return typeof recipient === 'string' ? recipient : null;
      })
      .filter((token): token is string => Boolean(token));

    if (invalidTokens.length === 0) {
      return;
    }

    await this.prisma.pushToken.deleteMany({
      where: {
        token: {
          in: invalidTokens,
        },
      },
    });

    this.logger.warn(
      JSON.stringify({
        event: 'notification_invalid_tokens_removed',
        count: invalidTokens.length,
      }),
    );
  }
}
