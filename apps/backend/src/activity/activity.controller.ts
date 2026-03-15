import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActivityService } from './activity.service';

@Controller('activity')
@UseGuards(JwtAuthGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  getUserActivity(@Request() req: any, @Query('cursor') cursor = '0', @Query('limit') limit = '20') {
    return this.activityService.getUserActivity(req.user.id, Number(cursor), Number(limit));
  }

  @Get('group/:id')
  getGroupActivity(@Param('id') groupId: string, @Query('cursor') cursor = '0', @Query('limit') limit = '20') {
    return this.activityService.getGroupActivity(groupId, Number(cursor), Number(limit));
  }
}
