import { Controller, Get, Param, Query } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { ExpensesService } from '../expenses/expenses.service';
import { ActivityService } from '../activity/activity.service';

@Controller('guest/groups')
export class GuestGroupsController {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly expensesService: ExpensesService,
    private readonly activityService: ActivityService,
  ) {}

  @Get(':token')
  getGroupByToken(@Param('token') token: string) {
    return this.groupsService.getGroupByShareToken(token);
  }

  @Get(':token/summary')
  async getSummaryByToken(@Param('token') token: string) {
    const group = await this.groupsService.getGroupByShareToken(token);
    return this.groupsService.summary(group.id, group.createdBy); // Use creator as actor for guest view
  }

  @Get(':token/expenses')
  async getExpensesByToken(
    @Param('token') token: string,
    @Query('cursor') cursor = '0',
    @Query('limit') limit = '20',
  ) {
    const group = await this.groupsService.getGroupByShareToken(token);
    return this.expensesService.listByGroup(group.id, Number(cursor), Number(limit));
  }

  @Get(':token/activity')
  async getActivityByToken(
    @Param('token') token: string,
    @Query('cursor') cursor = '0',
    @Query('limit') limit = '20',
  ) {
    const group = await this.groupsService.getGroupByShareToken(token);
    return this.activityService.getGroupActivity(group.id, Number(cursor), Number(limit));
  }

  @Get(':token/members')
  async getMembersByToken(@Param('token') token: string) {
    const group = await this.groupsService.getGroupByShareToken(token);
    return this.groupsService.members(group.id, group.createdBy);
  }
}
