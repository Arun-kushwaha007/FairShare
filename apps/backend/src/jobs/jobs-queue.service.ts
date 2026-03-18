import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { AppConfigService } from '../config/app-config.service';
import { NOTIFICATION_QUEUE, PAYMENT_WEBHOOKS_QUEUE, RECEIPT_PROCESSING_QUEUE } from './jobs.constants';

const MAX_REDIS_RETRIES = 3;
const RETRY_DELAY_MS = 250;
const MAX_RETRY_DELAY_MS = 1000;

@Injectable()
export class JobsQueueService {
  private readonly logger = new Logger(JobsQueueService.name);
  private readonly notificationQueue: Queue;
  private readonly receiptQueue: Queue;
  private readonly paymentWebhookQueue: Queue;

  constructor(config: AppConfigService) {
    const connection = {
      url: config.redisUrl,
      lazyConnect: true,
      maxRetriesPerRequest: null,
      enableOfflineQueue: false,
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
  }

  async enqueueNotification(payload: {
    userIds: string[];
    payload: {
      type: 'expense_created' | 'expense_deleted' | 'settlement_created' | 'group_invite';
      title: string;
      body: string;
      data?: Record<string, unknown>;
    };
  }): Promise<void> {
    await this.notificationQueue.add('send', payload, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 500 },
      removeOnComplete: true,
      removeOnFail: 100,
    });
  }

  async enqueueReceiptProcessing(payload: { receiptId: string; expenseId: string }): Promise<void> {
    await this.receiptQueue.add('process', payload, {
      attempts: 3,
      removeOnComplete: true,
      removeOnFail: 100,
    });
  }

  async enqueuePaymentWebhook(payload: { signature?: string; body: Record<string, unknown> }): Promise<void> {
    await this.paymentWebhookQueue.add('handle', payload, {
      attempts: 5,
      backoff: { type: 'exponential', delay: 1000 },
      removeOnComplete: true,
      removeOnFail: 100,
    });
  }
}
