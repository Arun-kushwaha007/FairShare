import { Module } from '@nestjs/common';
import { ActivityModule } from '../activity/activity.module';
import { BalancesModule } from '../balances/balances.module';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';

@Module({
  imports: [BalancesModule, ActivityModule],
  controllers: [ExpensesController],
  providers: [ExpensesService],
  exports: [ExpensesService],
})
export class ExpensesModule {}
