import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { SettlementsService } from './settlements.service';

@Controller('groups/:id/settlements')
@UseGuards(JwtAuthGuard)
export class SettlementsController {
  constructor(private readonly settlementsService: SettlementsService) {}

  @Post()
  create(@Param('id') groupId: string, @Body() dto: CreateSettlementDto) {
    return this.settlementsService.create(groupId, dto);
  }
}
