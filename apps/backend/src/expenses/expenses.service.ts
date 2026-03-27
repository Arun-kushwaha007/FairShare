import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import {
  ExpenseDto,
  PaginatedExpensesResponseDto,
  RecurringExpenseDto,
  RecurringExpenseFrequency,
  UpdateRecurringExpenseRequestDto,
} from '@fairshare/shared-types';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import { BalancesService } from '../balances/balances.service';
import { RedisService } from '../redis/redis.service';
import { ActivityService } from '../activity/activity.service';
import { NotificationsService } from '../notifications/notifications.service';
import { assertMoneyEquality, sumMoney } from '../common/utils/money.util';
import { RealtimeService } from '../realtime/realtime.service';
import { incrementExpenseCreated } from '../observability/metrics';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { UpdateRecurringExpenseDto } from './dto/update-recurring-expense.dto';
import { calculateBalanceDeltas } from './expense-calculator';

@Injectable()
export class ExpensesService {
  private static readonly MAX_EXPENSE_CENTS = 1_000_000n;
  private static readonly MAX_RECURRING_CATCH_UP = 12;

  constructor(
    private readonly prisma: PrismaService,
    private readonly balancesService: BalancesService,
    private readonly redis: RedisService,
    private readonly activityService: ActivityService,
    private readonly notificationsService: NotificationsService,
    private readonly realtime: RealtimeService,
  ) {}

  async create(groupId: string, actorUserId: string, dto: CreateExpenseDto, idempotencyKey?: string): Promise<ExpenseDto> {
    this.validateAmountAndSplits(dto);
    await this.validateExpenseMembers(groupId, actorUserId, dto);

    if (idempotencyKey) {
      const existingByKey = await this.prisma.expense.findUnique({
        where: { idempotencyKey },
        include: { splits: true, receipt: true },
      });
      if (existingByKey) {
        return this.toExpenseDto(existingByKey);
      }
    }

    let expense;
    try {
      expense = await this.prisma.$transaction(async (tx) => {
        const createdExpense = await this.createExpenseWithTransaction(tx, groupId, actorUserId, dto, idempotencyKey ?? null);

        if (dto.recurring) {
          await tx.recurringExpense.create({
            data: {
              groupId,
              payerId: dto.payerId,
              createdBy: actorUserId,
              description: dto.description,
              totalAmountCents: BigInt(dto.totalAmountCents),
              currency: dto.currency,
              category: dto.category ?? null,
              frequency: dto.recurring.frequency,
              nextOccurrenceAt: this.computeNextOccurrence(dto.recurring.frequency, new Date()),
              splits: {
                createMany: {
                  data: dto.splits.map((split) => ({
                    userId: split.userId,
                    owedAmountCents: BigInt(split.owedAmountCents),
                    paidAmountCents: BigInt(split.paidAmountCents),
                  })),
                },
              },
            },
          });
        }

        return createdExpense;
      });
    } catch (error) {
      if (idempotencyKey && this.isUniqueConstraintError(error)) {
        const existing = await this.prisma.expense.findUnique({
          where: { idempotencyKey },
          include: { splits: true, receipt: true },
        });
        if (existing) {
          return this.toExpenseDto(existing);
        }
      }

      throw error;
    }

    await this.postCreateExpenseSideEffects(groupId, actorUserId, expense);
    return this.toExpenseDto(expense);
  }

  async listByGroup(groupId: string, cursor = 0, limit = 20): Promise<PaginatedExpensesResponseDto> {
    const safeCursor = Number.isFinite(cursor) && cursor >= 0 ? cursor : 0;
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 20;

    await this.materializeDueRecurringExpenses(groupId);

    const cachedSummary = await this.redis.getGroupExpenseSummaryCache(groupId);
    let expenses: ExpenseDto[];

    if (cachedSummary) {
      expenses = JSON.parse(cachedSummary) as ExpenseDto[];
    } else {
      const rows = await this.prisma.expense.findMany({
        where: { groupId },
        include: { splits: true, receipt: true },
        orderBy: { createdAt: 'desc' },
      });
      expenses = rows.map((row) => this.toExpenseDto(row));
      await this.redis.setGroupExpenseSummaryCache(groupId, JSON.stringify(expenses));
    }

    const start = safeCursor;
    const end = start + safeLimit;
    const items = expenses.slice(start, end);

    return {
      items,
      nextCursor: end < expenses.length ? end : null,
    };
  }

  async listRecurringByGroup(groupId: string): Promise<RecurringExpenseDto[]> {
    await this.materializeDueRecurringExpenses(groupId);

    const rows = await this.prisma.recurringExpense.findMany({
      where: { groupId, active: true },
      include: { splits: true },
      orderBy: [{ nextOccurrenceAt: 'asc' }, { createdAt: 'asc' }],
    });

    return rows.map((row) => this.toRecurringExpenseDto(row));
  }

  async exportCsv(groupId: string, actorUserId: string): Promise<string> {
    await this.assertGroupMember(groupId, actorUserId);
    await this.materializeDueRecurringExpenses(groupId);

    const expenses = await this.prisma.expense.findMany({
      where: { groupId },
      include: {
        payer: { select: { name: true, email: true } },
        splits: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
        receipt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const rows = [
      ['Date', 'Description', 'Category', 'Amount', 'Currency', 'Payer', 'Participants', 'Split Details', 'Receipt Attached'],
      ...expenses.map((expense) => [
        this.formatCsvDate(expense.createdAt),
        expense.description,
        expense.category ?? '',
        (Number(expense.totalAmountCents) / 100).toFixed(2),
        expense.currency,
        expense.payer.name || expense.payer.email,
        String(expense.splits.length),
        expense.splits
          .map(
            (split) =>
              `${split.user.name || split.user.email}: owes ${(Number(split.owedAmountCents) / 100).toFixed(2)}, paid ${(Number(split.paidAmountCents) / 100).toFixed(2)}`,
          )
          .join(' | '),
        expense.receipt ? 'yes' : 'no',
      ]),
    ];

    return rows
      .map((row) => row.map((value) => this.escapeCsv(value)).join(','))
      .join('\n');
  }

  async getById(id: string): Promise<ExpenseDto> {
    const expense = await this.prisma.expense.findUnique({ where: { id }, include: { splits: true, receipt: true } });
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    return this.toExpenseDto(expense);
  }

  async update(id: string, actorUserId: string, dto: UpdateExpenseDto): Promise<ExpenseDto> {
    const expense = await this.prisma.expense.update({
      where: { id },
      data: {
        description: dto.description,
        category: dto.category,
      },
      include: { splits: true, receipt: true },
    });

    await this.activityService.log({
      groupId: expense.groupId,
      actorUserId,
      type: 'expense_updated',
      entityId: expense.id,
      metadata: { description: dto.description ?? null, category: dto.category ?? null, currency: expense.currency },
    });

    await this.redis.invalidateGroupCache(expense.groupId);

    return this.toExpenseDto(expense);
  }

  async updateRecurring(id: string, actorUserId: string, dto: UpdateRecurringExpenseDto): Promise<RecurringExpenseDto> {
    const recurringExpense = await this.prisma.recurringExpense.findUnique({
      where: { id },
      include: { splits: true },
    });

    if (!recurringExpense) {
      throw new NotFoundException('Recurring expense not found');
    }

    await this.assertGroupMember(recurringExpense.groupId, actorUserId);

    let nextTotal = recurringExpense.totalAmountCents;
    if (dto.totalAmountCents !== undefined) {
      nextTotal = BigInt(dto.totalAmountCents);
      if (nextTotal <= 0n) {
        throw new BadRequestException('Expense amount must be positive');
      }
      if (nextTotal > ExpensesService.MAX_EXPENSE_CENTS) {
        throw new BadRequestException('Expense amount exceeds maximum allowed');
      }
    }

    const currentSplits = recurringExpense.splits.map((split) => ({
      userId: split.userId,
      owedAmountCents: split.owedAmountCents.toString(),
      paidAmountCents: split.paidAmountCents.toString(),
    }));
    const nextSplits = dto.totalAmountCents !== undefined
      ? this.scaleRecurringSplits(currentSplits, recurringExpense.totalAmountCents, nextTotal, recurringExpense.payerId)
      : currentSplits;

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.recurringExpense.update({
        where: { id },
        data: {
          description: dto.description ?? undefined,
          totalAmountCents: dto.totalAmountCents !== undefined ? nextTotal : undefined,
          category: dto.category !== undefined ? dto.category : undefined,
          frequency: dto.frequency ?? undefined,
          nextOccurrenceAt: dto.frequency ? this.computeNextOccurrence(dto.frequency, recurringExpense.lastGeneratedAt ?? new Date()) : undefined,
        },
      });

      if (dto.totalAmountCents !== undefined) {
        await tx.recurringExpenseSplit.deleteMany({ where: { recurringExpenseId: id } });
        await tx.recurringExpenseSplit.createMany({
          data: nextSplits.map((split) => ({
            recurringExpenseId: id,
            userId: split.userId,
            owedAmountCents: BigInt(split.owedAmountCents),
            paidAmountCents: BigInt(split.paidAmountCents),
          })),
        });
      }

      return tx.recurringExpense.findUniqueOrThrow({
        where: { id },
        include: { splits: true },
      });
    });

    await this.activityService.log({
      groupId: recurringExpense.groupId,
      actorUserId,
      type: 'expense_updated',
      entityId: recurringExpense.id,
      metadata: {
        recurring: true,
        description: dto.description ?? recurringExpense.description,
        category: dto.category ?? recurringExpense.category,
        frequency: dto.frequency ?? recurringExpense.frequency,
        totalAmountCents: nextTotal.toString(),
        currency: recurringExpense.currency,
      },
    });

    return this.toRecurringExpenseDto(updated);
  }

  async remove(id: string, actorUserId: string): Promise<{ success: true }> {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
      include: { splits: true },
    });
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    await this.prisma.$transaction(async (tx) => {
      const deltas = calculateBalanceDeltas(
        expense.payerId,
        expense.splits.map((s) => ({
          userId: s.userId,
          owedAmountCents: s.owedAmountCents.toString(),
          paidAmountCents: s.paidAmountCents.toString(),
        })),
      );

      for (const delta of deltas) {
        await this.balancesService.adjustBalance(
          tx as unknown as Prisma.TransactionClient,
          expense.groupId,
          delta.userId,
          delta.counterpartyUserId,
          -delta.delta,
        );
      }

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
            currency: expense.currency,
          },
        },
      });
    });

    await this.redis.invalidateGroupCache(expense.groupId);

    const notifyMemberIds = (await this.prisma.groupMember.findMany({ where: { groupId: expense.groupId }, select: { userId: true } })).map(
      (member) => member.userId,
    );
    await this.notificationsService.sendPushNotification(notifyMemberIds.filter((userId) => userId !== actorUserId), {
      type: 'expense_deleted',
      title: 'Expense deleted',
      body: expense.description,
      data: { groupId: expense.groupId, expenseId: expense.id, notificationType: 'expense_deleted' },
    });
    this.realtime.emitToGroup(expense.groupId, 'expense_deleted', {
      groupId: expense.groupId,
      expenseId: expense.id,
    });

    return { success: true };
  }

  async removeRecurring(id: string, actorUserId: string): Promise<{ success: true }> {
    const recurringExpense = await this.prisma.recurringExpense.findUnique({
      where: { id },
      select: { id: true, groupId: true },
    });

    if (!recurringExpense) {
      throw new NotFoundException('Recurring expense not found');
    }

    await this.assertGroupMember(recurringExpense.groupId, actorUserId);

    await this.prisma.recurringExpense.update({
      where: { id },
      data: { active: false },
    });

    return { success: true };
  }

  private async assertGroupMember(groupId: string, userId: string): Promise<void> {
    const membership = await this.prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
      select: { userId: true },
    });

    if (!membership) {
      throw new ForbiddenException('Actor is not a group member');
    }
  }

  private validateAmountAndSplits(dto: CreateExpenseDto): void {
    const totalAmount = BigInt(dto.totalAmountCents);
    if (totalAmount <= 0n) {
      throw new BadRequestException('Expense amount must be positive');
    }
    if (totalAmount > ExpensesService.MAX_EXPENSE_CENTS) {
      throw new BadRequestException('Expense amount exceeds maximum allowed');
    }

    const owedSum = sumMoney(dto.splits.map((split) => split.owedAmountCents));
    const paidSum = sumMoney(dto.splits.map((split) => split.paidAmountCents));
    try {
      assertMoneyEquality(owedSum, totalAmount, 'Total owed sum must equal total amount');
      assertMoneyEquality(paidSum, totalAmount, 'Total paid sum must equal total amount');
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  private async validateExpenseMembers(groupId: string, actorUserId: string, dto: CreateExpenseDto): Promise<void> {
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
  }

  private scaleRecurringSplits(
    splits: Array<{ userId: string; owedAmountCents: string; paidAmountCents: string }>,
    oldTotal: bigint,
    newTotal: bigint,
    payerId: string,
  ): Array<{ userId: string; owedAmountCents: string; paidAmountCents: string }> {
    if (oldTotal <= 0n) {
      throw new BadRequestException('Recurring expense amount must be positive');
    }

    const scaled = splits.map((split) => ({
      userId: split.userId,
      owedAmount: (BigInt(split.owedAmountCents) * newTotal) / oldTotal,
    }));

    let diff = newTotal - scaled.reduce((sum, split) => sum + split.owedAmount, 0n);
    let index = 0;
    while (diff !== 0n && scaled.length > 0) {
      const direction = diff > 0n ? 1n : -1n;
      scaled[index % scaled.length].owedAmount += direction;
      diff -= direction;
      index += 1;
    }

    return scaled.map((split) => ({
      userId: split.userId,
      owedAmountCents: split.owedAmount.toString(),
      paidAmountCents: split.userId === payerId ? newTotal.toString() : '0',
    }));
  }

  private async createExpenseWithTransaction(
    tx: Prisma.TransactionClient,
    groupId: string,
    actorUserId: string,
    dto: CreateExpenseDto,
    idempotencyKey: string | null,
    createdAt?: Date,
    recurringExpenseId?: string,
  ) {
    const totalAmount = BigInt(dto.totalAmountCents);

    const createdExpense = await tx.expense.create({
      data: {
        groupId,
        payerId: dto.payerId,
        description: dto.description,
        totalAmountCents: totalAmount,
        currency: dto.currency,
        category: dto.category ?? null,
        idempotencyKey,
        createdAt,
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
          category: dto.category ?? null,
          currency: dto.currency,
          recurringExpenseId: recurringExpenseId ?? null,
        },
      },
    });

    return tx.expense.findUniqueOrThrow({
      where: { id: createdExpense.id },
      include: { splits: true, receipt: true },
    });
  }

  private async materializeDueRecurringExpenses(groupId: string): Promise<void> {
    const dueTemplates = await this.prisma.recurringExpense.findMany({
      where: {
        groupId,
        active: true,
        nextOccurrenceAt: { lte: new Date() },
      },
      include: { splits: true },
      orderBy: { nextOccurrenceAt: 'asc' },
      take: 10,
    });

    if (dueTemplates.length === 0) {
      return;
    }

    for (const template of dueTemplates) {
      const createdExpenses = await this.prisma.$transaction(async (tx) => {
        const current = await tx.recurringExpense.findUnique({
          where: { id: template.id },
          include: { splits: true },
        });

        if (!current || !current.active) {
          return [] as Array<Awaited<ReturnType<ExpensesService['createExpenseWithTransaction']>>>;
        }

        const now = new Date();
        const generated: Array<Awaited<ReturnType<ExpensesService['createExpenseWithTransaction']>>> = [];
        let occurrence = current.nextOccurrenceAt;
        let count = 0;

        while (occurrence <= now && count < ExpensesService.MAX_RECURRING_CATCH_UP) {
          const dto: CreateExpenseDto = {
            payerId: current.payerId,
            description: current.description,
            totalAmountCents: current.totalAmountCents.toString(),
            currency: current.currency as CreateExpenseDto['currency'],
            category: (current.category ?? undefined) as CreateExpenseDto['category'],
            splits: current.splits.map((split) => ({
              userId: split.userId,
              owedAmountCents: split.owedAmountCents.toString(),
              paidAmountCents: split.paidAmountCents.toString(),
            })),
          };

          const expense = await this.createExpenseWithTransaction(
            tx,
            current.groupId,
            current.createdBy,
            dto,
            null,
            occurrence,
            current.id,
          );
          generated.push(expense);
          occurrence = this.computeNextOccurrence(current.frequency as RecurringExpenseFrequency, occurrence);
          count += 1;
        }

        if (generated.length > 0) {
          await tx.recurringExpense.update({
            where: { id: current.id },
            data: {
              nextOccurrenceAt: occurrence,
              lastGeneratedAt: generated[generated.length - 1].createdAt,
            },
          });
        }

        return generated;
      });

      for (const expense of createdExpenses) {
        await this.postCreateExpenseSideEffects(groupId, template.createdBy, expense);
      }
    }
  }

  private async postCreateExpenseSideEffects(
    groupId: string,
    actorUserId: string,
    expense: {
      id: string;
      groupId: string;
      payerId: string;
      description: string;
      totalAmountCents: bigint;
      currency: string;
      category: string | null;
    },
  ): Promise<void> {
    await this.redis.invalidateGroupCache(groupId);

    const notifyMemberIds = (await this.prisma.groupMember.findMany({ where: { groupId }, select: { userId: true } })).map(
      (member) => member.userId,
    );
    await this.notificationsService.sendPushNotification(notifyMemberIds.filter((userId) => userId !== actorUserId), {
      type: 'expense_created',
      title: 'New expense added',
      body: expense.description,
      data: { groupId, expenseId: expense.id, notificationType: 'expense_created' },
    });
    this.realtime.emitToGroup(groupId, 'expense_created', {
      groupId,
      expenseId: expense.id,
      payerId: expense.payerId,
      totalAmountCents: expense.totalAmountCents.toString(),
      category: expense.category,
      currency: expense.currency,
    });
    incrementExpenseCreated(groupId);
  }

  private escapeCsv(value: string): string {
    const normalized = value.replace(/\r?\n/g, ' ').replace(/"/g, '""');
    return `"${normalized}"`;
  }

  private formatCsvDate(value: Date): string {
    return value.toISOString();
  }

  private computeNextOccurrence(frequency: RecurringExpenseFrequency, base: Date): Date {
    const next = new Date(base);
    if (frequency === 'daily') {
      next.setUTCDate(next.getUTCDate() + 1);
      return next;
    }
    if (frequency === 'weekly') {
      next.setUTCDate(next.getUTCDate() + 7);
      return next;
    }
    next.setUTCMonth(next.getUTCMonth() + 1);
    return next;
  }

  private toExpenseDto(expense: {
    id: string;
    groupId: string;
    payerId: string;
    description: string;
    totalAmountCents: bigint;
    currency: string;
    category: string | null;
    createdAt: Date;
    splits: Array<{
      id: string;
      userId: string;
      owedAmountCents: bigint;
      paidAmountCents: bigint;
    }>;
    receipt: {
      fileKey: string;
    } | null;
  }): ExpenseDto {
    return {
      id: expense.id,
      groupId: expense.groupId,
      payerId: expense.payerId,
      description: expense.description,
      totalAmountCents: expense.totalAmountCents.toString(),
      currency: expense.currency as 'USD' | 'EUR' | 'INR',
      category: expense.category as ExpenseDto['category'],
      receiptFileKey: expense.receipt?.fileKey ?? null,
      createdAt: expense.createdAt.toISOString(),
      splits: expense.splits.map((split) => ({
        id: split.id,
        userId: split.userId,
        owedAmountCents: split.owedAmountCents.toString(),
        paidAmountCents: split.paidAmountCents.toString(),
      })),
    };
  }

  private toRecurringExpenseDto(recurringExpense: {
    id: string;
    groupId: string;
    payerId: string;
    createdBy: string;
    description: string;
    totalAmountCents: bigint;
    currency: string;
    category: string | null;
    frequency: string;
    nextOccurrenceAt: Date;
    lastGeneratedAt: Date | null;
    active: boolean;
    createdAt: Date;
    splits: Array<{
      userId: string;
      owedAmountCents: bigint;
      paidAmountCents: bigint;
    }>;
  }): RecurringExpenseDto {
    return {
      id: recurringExpense.id,
      groupId: recurringExpense.groupId,
      payerId: recurringExpense.payerId,
      createdBy: recurringExpense.createdBy,
      description: recurringExpense.description,
      totalAmountCents: recurringExpense.totalAmountCents.toString(),
      currency: recurringExpense.currency as RecurringExpenseDto['currency'],
      category: recurringExpense.category as RecurringExpenseDto['category'],
      frequency: recurringExpense.frequency as RecurringExpenseDto['frequency'],
      nextOccurrenceAt: recurringExpense.nextOccurrenceAt.toISOString(),
      lastGeneratedAt: recurringExpense.lastGeneratedAt?.toISOString() ?? null,
      active: recurringExpense.active,
      createdAt: recurringExpense.createdAt.toISOString(),
      splits: recurringExpense.splits.map((split) => ({
        userId: split.userId,
        owedAmountCents: split.owedAmountCents.toString(),
        paidAmountCents: split.paidAmountCents.toString(),
      })),
    };
  }

  private isUniqueConstraintError(error: unknown): boolean {
    return Boolean(error && typeof error === 'object' && 'code' in error && (error as { code?: string }).code === 'P2002');
  }
}
