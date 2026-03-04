import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
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
  create(@Param('id') groupId: string, @CurrentUser() user: JwtPayload, @Body() dto: CreateExpenseDto) {
    return this.expensesService.create(groupId, user.sub, dto);
  }

  @Get('groups/:id/expenses')
  listByGroup(@Param('id') groupId: string) {
    return this.expensesService.listByGroup(groupId);
  }

  @Get('expenses/:id')
  getById(@Param('id') id: string) {
    return this.expensesService.getById(id);
  }

  @Patch('expenses/:id')
  update(@Param('id') id: string, @Body() dto: UpdateExpenseDto) {
    return this.expensesService.update(id, dto);
  }

  @Delete('expenses/:id')
  remove(@Param('id') id: string) {
    return this.expensesService.remove(id);
  }
}
