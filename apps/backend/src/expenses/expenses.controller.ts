import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/types/auth.types';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post('groups/:id/expenses')
  create(
    @Param('id') groupId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateExpenseDto,
    @Headers('x-idempotency-key') idempotencyKey?: string,
  ) {
    return this.expensesService.create(groupId, user.sub, dto, idempotencyKey);
  }

  @Get('groups/:id/expenses')
  listByGroup(@Param('id') groupId: string, @Query('cursor') cursor = '0', @Query('limit') limit = '20') {
    return this.expensesService.listByGroup(groupId, Number(cursor), Number(limit));
  }

  @Get('groups/:id/recurring-expenses')
  listRecurringByGroup(@Param('id') groupId: string) {
    return this.expensesService.listRecurringByGroup(groupId);
  }

  @Get('expenses/:id')
  getById(@Param('id') id: string) {
    return this.expensesService.getById(id);
  }

  @Patch('expenses/:id')
  update(@Param('id') id: string, @CurrentUser() user: JwtPayload, @Body() dto: UpdateExpenseDto) {
    return this.expensesService.update(id, user.sub, dto);
  }

  @Delete('expenses/:id')
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.expensesService.remove(id, user.sub);
  }

  @Delete('recurring-expenses/:id')
  removeRecurring(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.expensesService.removeRecurring(id, user.sub);
  }
}
