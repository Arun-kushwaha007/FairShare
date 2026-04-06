import { Module, forwardRef } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { ExpensesModule } from '../expenses/expenses.module';
import { ActivityModule } from '../activity/activity.module';
import { GroupsController } from './groups.controller';
import { GuestGroupsController } from './guest-groups.controller';
import { GroupsService } from './groups.service';

@Module({
  imports: [
    NotificationsModule,
    forwardRef(() => ExpensesModule),
    ActivityModule,
  ],
  controllers: [GroupsController, GuestGroupsController],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
