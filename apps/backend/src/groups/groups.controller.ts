import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/types/auth.types';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { RemindSettlementDto } from './dto/remind-settlement.dto';
import { UpdateGroupDefaultSplitDto } from './dto/update-group-default-split.dto';

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateGroupDto) {
    return this.groupsService.create(user.sub, dto);
  }

  @Get()
  list(@CurrentUser() user: JwtPayload) {
    return this.groupsService.list(user.sub);
  }

  @Get('summary')
  getUserSummary(@CurrentUser() user: JwtPayload) {
    return this.groupsService.getUserSummary(user.sub);
  }

  @Get('dashboard')
  getDashboard(@CurrentUser() user: JwtPayload) {
    return this.groupsService.getDashboard(user.sub);
  }

  @Get(':id')
  getById(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.groupsService.getById(id, user.sub);
  }

  @Get(':id/members')
  members(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.groupsService.members(id, user.sub);
  }

  @Get(':id/summary')
  summary(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.groupsService.summary(id, user.sub);
  }

  @Patch(':id/default-split')
  updateDefaultSplit(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateGroupDefaultSplitDto,
  ) {
    return this.groupsService.updateDefaultSplit(id, user.sub, dto);
  }

  @Post(':id/invite')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  invite(@Param('id') id: string, @CurrentUser() user: JwtPayload, @Body() dto: InviteMemberDto) {
    return this.groupsService.invite(id, user.sub, dto);
  }

  @Post(':id/remind-settlement')
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  remindSettlement(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: RemindSettlementDto,
  ) {
    return this.groupsService.remindSettlement(id, user.sub, dto);
  }

  @Patch(':id/share')
  toggleShare(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body('enabled') enabled: boolean,
  ) {
    return this.groupsService.toggleShare(id, user.sub, enabled);
  }
}
