import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { AppConfigService } from '../config/app-config.service';
import { NotificationType } from '../notifications/notifications.service';
import { NOTIFICATION_QUEUE, PAYMENT_WEBHOOKS_QUEUE, RECEIPT_PROCESSING_QUEUE } from './jobs.constants';

const MAX_REDIS_RETRIES = 3;
const RETRY_DELAY_MS = 250;
const MAX_RETRY_DELAY_MS = 1000;

@Injectable()
export class JobsQueueService implements OnModuleDestroy {
  private readonly logger = new Logger(JobsQueueService.name);
  private readonly config: AppConfigService;
  private notificationQueue: Queue | null = null;
  private receiptQueue: Queue | null = null;
  private paymentWebhookQueue: Queue | null = null;
  private redisAvailable: boolean | null = null;

  constructor(config: AppConfigService) {
    this.config = config;
  }

  async enqueueNotification(payload: {
    userIds: string[];
    payload: {
      type: NotificationType;
      title: string;
      body: string;
      data?: Record<string, unknown>;
    };
  }): Promise<void> {
    const queue = await this.getNotificationQueue();
    if (!queue) {
      return;
    }

    try {
      await queue.add('send', payload, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 500 },
        removeOnComplete: true,
        removeOnFail: 100,
      });
    } catch (error) {
      this.logger.warn(`Notification queue unavailable: ${error instanceof Error ? error.message : 'unknown error'}`);
    }
  }

  async enqueueReceiptProcessing(payload: { receiptId: string; expenseId: string }): Promise<void> {
    const queue = await this.getReceiptQueue();
    if (!queue) {
      return;
    }

    try {
      await queue.add('process', payload, {
        attempts: 3,
        removeOnComplete: true,
        removeOnFail: 100,
      });
    } catch (error) {
      this.logger.warn(`Receipt queue unavailable: ${error instanceof Error ? error.message : 'unknown error'}`);
    }
  }

  async enqueuePaymentWebhook(payload: { signature?: string; body: Record<string, unknown> }): Promise<void> {
    const queue = await this.getPaymentWebhookQueue();
    if (!queue) {
      return;
    }

    try {
      await queue.add('handle', payload, {
        attempts: 5,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: true,
        removeOnFail: 100,
      });
    } catch (error) {
      this.logger.warn(`Payment webhook queue unavailable: ${error instanceof Error ? error.message : 'unknown error'}`);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await Promise.allSettled(
      [this.notificationQueue, this.receiptQueue, this.paymentWebhookQueue]
        .filter((queue): queue is Queue => Boolean(queue))
        .map((queue) => queue.close()),
    );
  }

  private async getNotificationQueue(): Promise<Queue | null> {
    const ready = await this.ensureQueues();
    return ready ? this.notificationQueue : null;
  }

  private async getReceiptQueue(): Promise<Queue | null> {
    const ready = await this.ensureQueues();
    return ready ? this.receiptQueue : null;
  }

  private async getPaymentWebhookQueue(): Promise<Queue | null> {
    const ready = await this.ensureQueues();
    return ready ? this.paymentWebhookQueue : null;
  }

  private async ensureQueues(): Promise<boolean> {
    if (this.redisAvailable !== null) {
      return this.redisAvailable;
    }

    this.redisAvailable = await this.canReachRedis();
    if (!this.redisAvailable) {
      this.logger.warn('Redis unavailable, BullMQ queue producers disabled for local startup');
      return false;
    }

    const connection = {
      url: this.config.redisUrl,
      lazyConnect: true,
      maxRetriesPerRequest: null,
      enableOfflineQueue: true,
      connectionName: 'fairshare:jobs-queue',
      retryStrategy: (times: number) => {
        if (times > MAX_REDIS_RETRIES) {
          this.logger.warn('jobs-queue Redis reconnect attempts exhausted');
          return null;
        }

        return Math.min(times * RETRY_DELAY_MS, MAX_RETRY_DELAY_MS);
      },
    };

    this.notificationQueue = new Queue(NOTIFICATION_QUEUE, { connection });
    this.receiptQueue = new Queue(RECEIPT_PROCESSING_QUEUE, { connection });
    this.paymentWebhookQueue = new Queue(PAYMENT_WEBHOOKS_QUEUE, { connection });
    return true;
  }

  private async canReachRedis(): Promise<boolean> {
    const probe = new Redis(this.config.redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: true,
      connectTimeout: 750,
      retryStrategy: () => null,
    });

    try {
      await probe.connect();
      await probe.ping();
      await probe.quit();
      return true;
    } catch (error) {
      this.logger.warn(`Redis queue probe failed: ${error instanceof Error ? error.message : 'unknown error'}`);
      probe.disconnect();
      return false;
    }
  }
}
