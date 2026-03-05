import { Module } from '@nestjs/common';
import { AppConfigModule } from '../config/app-config.module';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [AppConfigModule],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
