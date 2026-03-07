import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { AppConfigService } from '../config/app-config.service';
import { NOTIFICATION_QUEUE, PAYMENT_WEBHOOKS_QUEUE, RECEIPT_PROCESSING_QUEUE } from './jobs.constants';

@Injectable()
export class JobsQueueService {
  private readonly notificationQueue: Queue;
  private readonly receiptQueue: Queue;
  private readonly paymentWebhookQueue: Queue;

  constructor(config: AppConfigService) {
    const connection = { url: config.redisUrl };
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
