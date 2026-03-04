import { Module } from '@nestjs/common';
import { BalancesModule } from '../balances/balances.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { SettlementsController } from './settlements.controller';
import { SettlementsService } from './settlements.service';

@Module({
  imports: [BalancesModule, NotificationsModule],
  controllers: [SettlementsController],
  providers: [SettlementsService],
  exports: [SettlementsService],
})
export class SettlementsModule {}
