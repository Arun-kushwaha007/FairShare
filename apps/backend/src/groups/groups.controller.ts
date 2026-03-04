import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/types/auth.types';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { InviteMemberDto } from './dto/invite-member.dto';

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

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.groupsService.getById(id);
  }

  @Post(':id/invite')
  invite(@Param('id') id: string, @Body() dto: InviteMemberDto) {
    return this.groupsService.invite(id, dto);
  }
}
