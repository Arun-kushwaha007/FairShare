import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import Redis from 'ioredis';
import { AppConfigService } from '../config/app-config.service';
import { PrismaService } from '../common/prisma.service';

export type NotificationType = 'expense_created' | 'expense_deleted' | 'settlement_created' | 'group_invite';

type NotificationEventPayload = {
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
};

@Injectable()
export class NotificationsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly channel = 'fairshare:notifications';
  private readonly publisher: Redis;
  private readonly subscriber: Redis;
  private readonly expo: Expo;

  constructor(
    config: AppConfigService,
    private readonly prisma: PrismaService,
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

    await this.deliverExpoNotifications(userIds, payload);
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
      await this.sendChunkWithRetry(chunk, 1);
    }
  }

  private async sendChunkWithRetry(chunk: ExpoPushMessage[], retries: number): Promise<void> {
    try {
      const tickets = await this.expo.sendPushNotificationsAsync(chunk);
      this.logger.log(
        JSON.stringify({
          event: 'notification_push_sent',
          ticketCount: tickets.length,
        }),
      );
    } catch (error) {
      this.logger.error('Expo push send failed', error instanceof Error ? error.stack : undefined);
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        await this.sendChunkWithRetry(chunk, retries - 1);
      }
    }
  }
}
