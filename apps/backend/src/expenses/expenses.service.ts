import { Injectable, NotFoundException } from '@nestjs/common';
import { ExpenseDto } from '@fairshare/shared-types';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import { BalancesService } from '../balances/balances.service';
import { RedisService } from '../redis/redis.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { calculateBalanceDeltas } from './expense-calculator';

@Injectable()
export class ExpensesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly balancesService: BalancesService,
    private readonly redis: RedisService,
  ) {}

  async create(groupId: string, dto: CreateExpenseDto): Promise<ExpenseDto> {
    const expense = await this.prisma.$transaction(async (tx) => {
      const createdExpense = await tx.expense.create({
        data: {
          groupId,
          payerId: dto.payerId,
          description: dto.description,
          totalAmountCents: BigInt(dto.totalAmountCents),
          currency: dto.currency,
        },
      });

      await tx.split.createMany({
        data: dto.splits.map((split) => ({
          expenseId: createdExpense.id,
          userId: split.userId,
          owedAmountCents: BigInt(split.owedAmountCents),
          paidAmountCents: BigInt(split.paidAmountCents),
        })),
      });

      const deltas = calculateBalanceDeltas(dto.payerId, dto.splits);
      for (const delta of deltas) {
        await this.balancesService.adjustBalance(tx as unknown as Prisma.TransactionClient, groupId, delta.userId, delta.counterpartyUserId, delta.delta);
      }

      return tx.expense.findUniqueOrThrow({
        where: { id: createdExpense.id },
        include: { splits: true },
      });
    });

    await this.redis.invalidateGroupCache(groupId);

    return {
      id: expense.id,
      groupId: expense.groupId,
      payerId: expense.payerId,
      description: expense.description,
      totalAmountCents: expense.totalAmountCents.toString(),
      currency: expense.currency as 'USD' | 'EUR' | 'INR',
      createdAt: expense.createdAt.toISOString(),
      splits: expense.splits.map((split) => ({
        id: split.id,
        userId: split.userId,
        owedAmountCents: split.owedAmountCents.toString(),
        paidAmountCents: split.paidAmountCents.toString(),
      })),
    };
  }

  async listByGroup(groupId: string): Promise<ExpenseDto[]> {
    const expenses = await this.prisma.expense.findMany({
      where: { groupId },
      include: { splits: true },
      orderBy: { createdAt: 'desc' },
    });

    return expenses.map((expense) => ({
      id: expense.id,
      groupId: expense.groupId,
      payerId: expense.payerId,
      description: expense.description,
      totalAmountCents: expense.totalAmountCents.toString(),
      currency: expense.currency as 'USD' | 'EUR' | 'INR',
      createdAt: expense.createdAt.toISOString(),
      splits: expense.splits.map((split) => ({
        id: split.id,
        userId: split.userId,
        owedAmountCents: split.owedAmountCents.toString(),
        paidAmountCents: split.paidAmountCents.toString(),
      })),
    }));
  }

  async getById(id: string): Promise<ExpenseDto> {
    const expense = await this.prisma.expense.findUnique({ where: { id }, include: { splits: true } });
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    return {
      id: expense.id,
      groupId: expense.groupId,
      payerId: expense.payerId,
      description: expense.description,
      totalAmountCents: expense.totalAmountCents.toString(),
      currency: expense.currency as 'USD' | 'EUR' | 'INR',
      createdAt: expense.createdAt.toISOString(),
      splits: expense.splits.map((split) => ({
        id: split.id,
        userId: split.userId,
        owedAmountCents: split.owedAmountCents.toString(),
        paidAmountCents: split.paidAmountCents.toString(),
      })),
    };
  }

  async update(id: string, dto: UpdateExpenseDto): Promise<ExpenseDto> {
    const expense = await this.prisma.expense.update({
      where: { id },
      data: {
        description: dto.description,
      },
      include: { splits: true },
    });

    return {
      id: expense.id,
      groupId: expense.groupId,
      payerId: expense.payerId,
      description: expense.description,
      totalAmountCents: expense.totalAmountCents.toString(),
      currency: expense.currency as 'USD' | 'EUR' | 'INR',
      createdAt: expense.createdAt.toISOString(),
      splits: expense.splits.map((split) => ({
        id: split.id,
        userId: split.userId,
        owedAmountCents: split.owedAmountCents.toString(),
        paidAmountCents: split.paidAmountCents.toString(),
      })),
    };
  }

  async remove(id: string): Promise<{ success: true }> {
    const expense = await this.prisma.expense.findUnique({ where: { id } });
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.split.deleteMany({ where: { expenseId: id } });
      await tx.expense.delete({ where: { id } });
    });

    await this.redis.invalidateGroupCache(expense.groupId);

    return { success: true };
  }
}
