import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActivityService } from './activity.service';

@Controller('groups/:id/activity')
@UseGuards(JwtAuthGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  getGroupActivity(@Param('id') groupId: string, @Query('cursor') cursor = '0', @Query('limit') limit = '20') {
    return this.activityService.getGroupActivity(groupId, Number(cursor), Number(limit));
  }
}
