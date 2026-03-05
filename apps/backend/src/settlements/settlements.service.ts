import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { SettlementDto } from '@fairshare/shared-types';
import { PrismaService } from '../common/prisma.service';
import { BalancesService } from '../balances/balances.service';
import { RedisService } from '../redis/redis.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateSettlementDto } from './dto/create-settlement.dto';

@Injectable()
export class SettlementsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly balancesService: BalancesService,
    private readonly redis: RedisService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(groupId: string, actorUserId: string, dto: CreateSettlementDto): Promise<SettlementDto> {
    const amount = BigInt(dto.amountCents);
    if (amount <= 0n) {
      throw new BadRequestException('Settlement amount must be positive');
    }

    const requiredMemberIds = new Set<string>([actorUserId, dto.payerId, dto.receiverId]);
    const memberships = await this.prisma.groupMember.findMany({
      where: {
        groupId,
        userId: { in: Array.from(requiredMemberIds) },
      },
      select: { userId: true },
    });
    const memberSet = new Set(memberships.map((member) => member.userId));

    if (!memberSet.has(actorUserId)) {
      throw new ForbiddenException('Actor is not a group member');
    }
    if (!memberSet.has(dto.payerId) || !memberSet.has(dto.receiverId)) {
      throw new BadRequestException('Payer and receiver must be group members');
    }

    const settlement = await this.prisma.$transaction(async (tx) => {
      const created = await tx.settlement.create({
        data: {
          groupId,
          payerId: dto.payerId,
          receiverId: dto.receiverId,
          amountCents: amount,
        },
      });

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

      await tx.activity.create({
        data: {
          groupId,
          actorUserId,
          type: 'settlement_created',
          entityId: created.id,
          metadata: {
            payerId: dto.payerId,
            receiverId: dto.receiverId,
            amountCents: amount.toString(),
          },
        },
      });

      return created;
    });

    await this.redis.invalidateGroupCache(groupId);

    await this.notificationsService.sendPushNotification([dto.receiverId], {
      type: 'settlement_created',
      title: 'Settlement recorded',
      body: `${dto.payerId} settled with you`,
      data: {
        groupId,
        settlementId: settlement.id,
        amountCents: dto.amountCents,
        notificationType: 'settlement_created',
      },
    });

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
