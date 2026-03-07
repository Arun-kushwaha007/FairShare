import { Module } from '@nestjs/common';
import { AppConfigModule } from '../config/app-config.module';
import { SettlementsModule } from '../settlements/settlements.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [AppConfigModule, SettlementsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
