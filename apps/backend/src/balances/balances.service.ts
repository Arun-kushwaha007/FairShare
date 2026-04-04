import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BalanceDto } from '@fairshare/shared-types';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class BalancesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getGroupBalances(groupId: string): Promise<BalanceDto[]> {
    const cached = await this.redis.getGroupBalanceCache(groupId);
    if (cached) {
      return JSON.parse(cached) as BalanceDto[];
    }

    const balances = await this.prisma.balance.findMany({
      where: { groupId },
      orderBy: [{ userId: 'asc' }, { counterpartyUserId: 'asc' }],
    });

    const response = balances.map((balance) => ({
      id: balance.id,
      groupId: balance.groupId,
      userId: balance.userId,
      counterpartyUserId: balance.counterpartyUserId,
      amountCents: balance.amountCents.toString(),
    }));

    await this.redis.setGroupBalanceCache(groupId, JSON.stringify(response));

    return response;
  }

  async exportCsv(groupId: string, actorUserId: string): Promise<string> {
    await this.assertGroupMember(groupId, actorUserId);

    const [balances, group] = await Promise.all([
      this.prisma.balance.findMany({
        where: { groupId },
        include: {
          user: { select: { name: true, email: true } },
          counterpartyUser: { select: { name: true, email: true } },
        },
        orderBy: [{ userId: 'asc' }, { counterpartyUserId: 'asc' }],
      }),
      this.prisma.group.findUnique({
        where: { id: groupId },
        select: { currency: true },
      }),
    ]);

    const rows = [
      ['Debtor', 'Creditor', 'Amount', 'Currency'],
      ...balances
        .filter((balance) => balance.amountCents < 0n)
        .map((balance) => [
          balance.user.name || balance.user.email,
          balance.counterpartyUser.name || balance.counterpartyUser.email,
          (Number(balance.amountCents * -1n) / 100).toFixed(2),
          group?.currency ?? 'USD',
        ]),
    ];

    return rows.map((row) => row.map((value) => this.escapeCsv(value)).join(',')).join('\n');
  }

  async adjustBalance(
    tx: Prisma.TransactionClient,
    groupId: string,
    userId: string,
    counterpartyUserId: string,
    delta: bigint,
  ): Promise<void> {
    if (delta === 0n) {
      return;
    }

    const existing = await tx.balance.findUnique({
      where: {
        groupId_userId_counterpartyUserId: {
          groupId,
          userId,
          counterpartyUserId,
        },
      },
    });

    if (existing) {
      await tx.balance.update({
        where: {
          groupId_userId_counterpartyUserId: {
            groupId,
            userId,
            counterpartyUserId,
          },
        },
        data: {
          amountCents: existing.amountCents + delta,
        },
      });
      return;
    }

    await tx.balance.create({
      data: {
        groupId,
        userId,
        counterpartyUserId,
        amountCents: delta,
      },
    });
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

  private escapeCsv(value: string): string {
    return `"${value.replace(/\r?\n/g, ' ').replace(/"/g, '""')}"`;
  }
}
