import { forwardRef, Module } from '@nestjs/common';
import { AppConfigModule } from '../config/app-config.module';
import { NotificationsService } from './notifications.service';
import { JobsModule } from '../jobs/jobs.module';

@Module({
  imports: [AppConfigModule, forwardRef(() => JobsModule)],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
