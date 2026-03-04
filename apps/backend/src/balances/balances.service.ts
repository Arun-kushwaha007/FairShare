import { Injectable } from '@nestjs/common';
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
}
