import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/types/auth.types';
import { BalancesService } from './balances.service';

@Controller('groups/:id/balances')
@UseGuards(JwtAuthGuard)
export class BalancesController {
  constructor(private readonly balancesService: BalancesService) {}

  @Get()
  getGroupBalances(@Param('id') id: string) {
    return this.balancesService.getGroupBalances(id);
  }

  @Get('export.csv')
  async exportGroupBalances(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    const csv = await this.balancesService.exportCsv(id, user.sub);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="fairshare-${id}-balances.csv"`);
    return csv;
  }
}
