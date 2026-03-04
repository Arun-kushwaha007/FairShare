import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { SettlementDto } from '@fairshare/shared-types';
import { PrismaService } from '../common/prisma.service';
import { BalancesService } from '../balances/balances.service';
import { RedisService } from '../redis/redis.service';
import { CreateSettlementDto } from './dto/create-settlement.dto';

@Injectable()
export class SettlementsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly balancesService: BalancesService,
    private readonly redis: RedisService,
  ) {}

  async create(groupId: string, dto: CreateSettlementDto): Promise<SettlementDto> {
    const settlement = await this.prisma.$transaction(async (tx) => {
      const created = await tx.settlement.create({
        data: {
          groupId,
          payerId: dto.payerId,
          receiverId: dto.receiverId,
          amountCents: BigInt(dto.amountCents),
        },
      });

      const amount = BigInt(dto.amountCents);
      await this.balancesService.adjustBalance(
        tx as unknown as Prisma.TransactionClient,
        groupId,
        dto.payerId,
        dto.receiverId,
        amount,
      );
      await this.balancesService.adjustBalance(
        tx as unknown as Prisma.TransactionClient,
        groupId,
        dto.receiverId,
        dto.payerId,
        -amount,
      );

      return created;
    });

    await this.redis.invalidateGroupCache(groupId);

    return {
      id: settlement.id,
      groupId: settlement.groupId,
      payerId: settlement.payerId,
      receiverId: settlement.receiverId,
      amountCents: settlement.amountCents.toString(),
      createdAt: settlement.createdAt.toISOString(),
    };
  }
}
