import { forwardRef, Module } from '@nestjs/common';
import { AppConfigModule } from '../config/app-config.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PaymentsModule } from '../payments/payments.module';
import { JobsQueueService } from './jobs-queue.service';
import { JobsWorkerService } from './jobs-worker.service';

@Module({
  imports: [AppConfigModule, forwardRef(() => NotificationsModule), forwardRef(() => PaymentsModule)],
  providers: [JobsQueueService, JobsWorkerService],
  exports: [JobsQueueService],
})
export class JobsModule {}
