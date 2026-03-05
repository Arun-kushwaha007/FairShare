import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { AppConfigService } from '../config/app-config.service';

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

  constructor(config: AppConfigService) {
    this.publisher = new Redis(config.redisUrl);
    this.subscriber = new Redis(config.redisUrl);
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
  }
}
