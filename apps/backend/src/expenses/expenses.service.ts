import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ExpenseDto } from '@fairshare/shared-types';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import { BalancesService } from '../balances/balances.service';
import { RedisService } from '../redis/redis.service';
import { ActivityService } from '../activity/activity.service';
import { assertMoneyEquality, sumMoney } from '../common/utils/money.util';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { calculateBalanceDeltas } from './expense-calculator';

@Injectable()
export class ExpensesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly balancesService: BalancesService,
    private readonly redis: RedisService,
    private readonly activityService: ActivityService,
  ) {}

  async create(groupId: string, actorUserId: string, dto: CreateExpenseDto): Promise<ExpenseDto> {
    const totalAmount = BigInt(dto.totalAmountCents);
    if (totalAmount <= 0n) {
      throw new BadRequestException('Expense amount must be positive');
    }

    const owedSum = sumMoney(dto.splits.map((split) => split.owedAmountCents));
    try {
      assertMoneyEquality(owedSum, totalAmount, 'Split sum must equal total amount');
    } catch {
      throw new BadRequestException('Split sum must equal total amount');
    }

    const memberIds = new Set<string>([actorUserId, dto.payerId, ...dto.splits.map((split) => split.userId)]);
    const memberships = await this.prisma.groupMember.findMany({
      where: {
        groupId,
        userId: { in: Array.from(memberIds) },
      },
      select: { userId: true },
    });
    const memberSet = new Set(memberships.map((member) => member.userId));

    if (!memberSet.has(actorUserId)) {
      throw new ForbiddenException('Actor is not a group member');
    }

    if (!memberSet.has(dto.payerId)) {
      throw new BadRequestException('Payer must be a group member');
    }

    const invalidSplitUsers = dto.splits.filter((split) => !memberSet.has(split.userId));
    if (invalidSplitUsers.length > 0) {
      throw new BadRequestException('All split users must be group members');
    }

    const expense = await this.prisma.$transaction(async (tx) => {
      const createdExpense = await tx.expense.create({
        data: {
          groupId,
          payerId: dto.payerId,
          description: dto.description,
          totalAmountCents: totalAmount,
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
        await this.balancesService.adjustBalance(
          tx as unknown as Prisma.TransactionClient,
          groupId,
          delta.userId,
          delta.counterpartyUserId,
          delta.delta,
        );
      }

      await tx.activity.create({
        data: {
          groupId,
          actorUserId,
          type: 'expense_created',
          entityId: createdExpense.id,
          metadata: {
            payerId: dto.payerId,
            totalAmountCents: totalAmount.toString(),
          },
        },
      });

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

  async update(id: string, actorUserId: string, dto: UpdateExpenseDto): Promise<ExpenseDto> {
    const expense = await this.prisma.expense.update({
      where: { id },
      data: {
        description: dto.description,
      },
      include: { splits: true },
    });

    await this.activityService.log({
      groupId: expense.groupId,
      actorUserId,
      type: 'expense_updated',
      entityId: expense.id,
      metadata: { description: dto.description ?? null },
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

  async remove(id: string, actorUserId: string): Promise<{ success: true }> {
    const expense = await this.prisma.expense.findUnique({ where: { id } });
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.split.deleteMany({ where: { expenseId: id } });
      await tx.expense.delete({ where: { id } });
      await tx.activity.create({
        data: {
          groupId: expense.groupId,
          actorUserId,
          type: 'expense_deleted',
          entityId: expense.id,
          metadata: {
            totalAmountCents: expense.totalAmountCents.toString(),
          },
        },
      });
    });

    await this.redis.invalidateGroupCache(expense.groupId);

    return { success: true };
  }
}
