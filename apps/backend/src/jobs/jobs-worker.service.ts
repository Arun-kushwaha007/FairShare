import { forwardRef, Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Worker } from 'bullmq';
import { AppConfigService } from '../config/app-config.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PaymentsService } from '../payments/payments.service';
import { NOTIFICATION_QUEUE, PAYMENT_WEBHOOKS_QUEUE, RECEIPT_PROCESSING_QUEUE } from './jobs.constants';

@Injectable()
export class JobsWorkerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(JobsWorkerService.name);
  private workers: Worker[] = [];

  constructor(
    private readonly config: AppConfigService,
    private readonly notificationsService: NotificationsService,
    @Inject(forwardRef(() => PaymentsService))
    private readonly paymentsService: PaymentsService,
  ) {}

  async onModuleInit(): Promise<void> {
    const connection = { url: this.config.redisUrl };

    const notificationWorker = new Worker(
      NOTIFICATION_QUEUE,
      async (job) => {
        await this.notificationsService.processQueuedNotification(job.data as Parameters<
          NotificationsService['processQueuedNotification']
        >[0]);
      },
      { connection },
    );

    const receiptWorker = new Worker(
      RECEIPT_PROCESSING_QUEUE,
      async (job) => {
        this.logger.log(`Receipt processing job queued for future OCR id=${job.id}`);
      },
      { connection },
    );

    const paymentWorker = new Worker(
      PAYMENT_WEBHOOKS_QUEUE,
      async (job) => {
        const data = job.data as { signature?: string; body: Record<string, unknown> };
        await this.paymentsService.handleWebhook(data.signature, data.body);
      },
      { connection },
    );

    this.workers = [notificationWorker, receiptWorker, paymentWorker];
  }

  async onModuleDestroy(): Promise<void> {
    await Promise.all(this.workers.map((worker) => worker.close()));
  }
}
