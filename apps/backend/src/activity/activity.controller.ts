import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/types/auth.types';
import { ActivityService } from './activity.service';

@Controller('activity')
@UseGuards(JwtAuthGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  getUserActivity(@CurrentUser() user: JwtPayload, @Query('cursor') cursor = '0', @Query('limit') limit = '20') {
    return this.activityService.getUserActivity(user.sub, Number(cursor), Number(limit));
  }

  @Get('group/:id')
  getGroupActivity(@Param('id') groupId: string, @Query('cursor') cursor = '0', @Query('limit') limit = '20') {
    return this.activityService.getGroupActivity(groupId, Number(cursor), Number(limit));
  }
}
