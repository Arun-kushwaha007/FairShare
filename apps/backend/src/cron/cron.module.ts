import { Module } from '@nestjs/common';
import { PrismaModule } from '../common/prisma.module';
import { CronService } from './cron.service';

@Module({
  imports: [PrismaModule],
  providers: [CronService],
})
export class CronModule {}
