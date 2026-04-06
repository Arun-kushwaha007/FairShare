import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as crypto from 'crypto';
import { SettlementDto } from '@fairshare/shared-types';
import { PrismaService } from '../common/prisma.service';
import { BalancesService } from '../balances/balances.service';
import { RedisService } from '../redis/redis.service';
import { NotificationsService } from '../notifications/notifications.service';
import { RealtimeService } from '../realtime/realtime.service';
import { CreateSettlementDto } from './dto/create-settlement.dto';

@Injectable()
export class SettlementsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly balancesService: BalancesService,
    private readonly redis: RedisService,
    private readonly notificationsService: NotificationsService,
    private readonly realtime: RealtimeService,
  ) {}

  async create(
    groupId: string,
    actorUserId: string,
    dto: CreateSettlementDto,
    idempotencyKey?: string,
  ): Promise<SettlementDto> {
    const amount = BigInt(dto.amountCents);
    if (amount <= 0n) {
      throw new BadRequestException('Settlement amount must be positive');
    }

    // Hardening: generate a derived idempotency key if none provided
    // to prevent duplicates within the same minute on the same group/pair/amount
    const effectiveIdempotencyKey = idempotencyKey || this.generateFallbackIdempotencyKey(groupId, dto, amount);

    if (effectiveIdempotencyKey) {
      const existingByKey = await this.prisma.settlement.findUnique({ where: { idempotencyKey: effectiveIdempotencyKey } });
      if (existingByKey) {
        return {
          id: existingByKey.id,
          groupId: existingByKey.groupId,
          payerId: existingByKey.payerId,
          receiverId: existingByKey.receiverId,
          amountCents: existingByKey.amountCents.toString(),
          createdAt: existingByKey.createdAt.toISOString(),
        };
      }
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

    let settlement;
    try {
      settlement = await this.prisma.$transaction(async (tx) => {
        const created = await tx.settlement.create({
          data: {
            groupId,
            payerId: dto.payerId,
            receiverId: dto.receiverId,
            amountCents: amount,
            idempotencyKey: effectiveIdempotencyKey ?? null,
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
    } catch (error) {
      if (effectiveIdempotencyKey && this.isUniqueConstraintError(error)) {
        const existing = await this.prisma.settlement.findUnique({ where: { idempotencyKey: effectiveIdempotencyKey } });
        if (existing) {
          return {
            id: existing.id,
            groupId: existing.groupId,
            payerId: existing.payerId,
            receiverId: existing.receiverId,
            amountCents: existing.amountCents.toString(),
            createdAt: existing.createdAt.toISOString(),
          };
        }
      }

      throw error;
    }

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
    this.realtime.emitToGroup(groupId, 'settlement_created', {
      groupId,
      settlementId: settlement.id,
      payerId: dto.payerId,
      receiverId: dto.receiverId,
      amountCents: dto.amountCents,
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

  private generateFallbackIdempotencyKey(groupId: string, dto: CreateSettlementDto, amount: bigint): string {
    const minute = Math.floor(Date.now() / 60_000);
    const data = `${groupId}:${dto.payerId}:${dto.receiverId}:${amount.toString()}:${minute}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  private isUniqueConstraintError(error: unknown): boolean {
    return Boolean(error && typeof error === 'object' && 'code' in error && (error as { code?: string }).code === 'P2002');
  }
}
