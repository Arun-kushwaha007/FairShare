import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BalancesService } from './balances.service';

@Controller('groups/:id/balances')
@UseGuards(JwtAuthGuard)
export class BalancesController {
  constructor(private readonly balancesService: BalancesService) {}

  @Get()
  getGroupBalances(@Param('id') id: string) {
    return this.balancesService.getGroupBalances(id);
  }
}
