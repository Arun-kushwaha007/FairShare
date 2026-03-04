import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SimplifyService } from './simplify.service';

@Controller('groups/:id/simplify')
@UseGuards(JwtAuthGuard)
export class SimplifyController {
  constructor(private readonly simplifyService: SimplifyService) {}

  @Get()
  simplify(@Param('id') groupId: string) {
    return this.simplifyService.simplifyGroup(groupId);
  }
}
