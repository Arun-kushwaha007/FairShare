import { forwardRef, Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Worker } from 'bullmq';
import Redis from 'ioredis';
import { AppConfigService } from '../config/app-config.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PaymentsService } from '../payments/payments.service';
import { NOTIFICATION_QUEUE, PAYMENT_WEBHOOKS_QUEUE, RECEIPT_PROCESSING_QUEUE } from './jobs.constants';

const MAX_REDIS_RETRIES = 3;
const RETRY_DELAY_MS = 250;
const MAX_RETRY_DELAY_MS = 1000;

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
    const redisAvailable = await this.canReachRedis();
    if (!redisAvailable) {
      this.logger.warn('Redis unavailable, BullMQ workers disabled for local startup');
      return;
    }

    const connection = {
      url: this.config.redisUrl,
      lazyConnect: true,
      maxRetriesPerRequest: null,
      enableOfflineQueue: false,
      connectionName: 'fairshare:jobs-worker',
      retryStrategy: (times: number) => {
        if (times > MAX_REDIS_RETRIES) {
          this.logger.warn('jobs-worker Redis reconnect attempts exhausted');
          return null;
        }

        return Math.min(times * RETRY_DELAY_MS, MAX_RETRY_DELAY_MS);
      },
    };

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
    for (const worker of this.workers) {
      worker.on('error', (error) => {
        this.logger.warn(`BullMQ worker error: ${error.message}`);
      });
    }
  }

  async onModuleDestroy(): Promise<void> {
    await Promise.all(this.workers.map((worker) => worker.close()));
  }

  private async canReachRedis(): Promise<boolean> {
    const probe = new Redis(this.config.redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      connectTimeout: 750,
      retryStrategy: () => null,
    });

    try {
      await probe.connect();
      await probe.ping();
      await probe.quit();
      return true;
    } catch (error) {
      this.logger.warn(`Redis probe failed: ${error instanceof Error ? error.message : 'unknown error'}`);
      probe.disconnect();
      return false;
    }
  }
}
