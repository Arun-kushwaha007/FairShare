import { Injectable } from '@nestjs/common';
import { ActivityDto, ActivityType } from '@fairshare/shared-types';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async log(params: {
    groupId: string;
    actorUserId: string;
    type: ActivityType;
    entityId: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    await this.prisma.activity.create({
      data: {
        groupId: params.groupId,
        actorUserId: params.actorUserId,
        type: params.type,
        entityId: params.entityId,
        metadata: (params.metadata ?? {}) as Prisma.InputJsonValue,
      },
    });
  }

  async getGroupActivity(
    groupId: string,
    cursor = 0,
    limit = 20,
  ): Promise<{ items: ActivityDto[]; nextCursor: number | null }> {
    const safeCursor = Number.isFinite(cursor) && cursor >= 0 ? cursor : 0;
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 20;

    const events = await this.prisma.activity.findMany({
      where: { groupId },
      orderBy: { createdAt: 'desc' },
      skip: safeCursor,
      take: safeLimit,
    });

    const items = events.map((event) => ({
      id: event.id,
      groupId: event.groupId,
      actorUserId: event.actorUserId,
      type: event.type,
      entityId: event.entityId,
      metadata: event.metadata as Record<string, unknown>,
      createdAt: event.createdAt.toISOString(),
    }));

    return {
      items,
      nextCursor: events.length === safeLimit ? safeCursor + safeLimit : null,
    };
  }

  async getUserActivity(
    userId: string,
    cursor = 0,
    limit = 20,
  ): Promise<{ items: ActivityDto[]; nextCursor: number | null }> {
    const safeCursor = Number.isFinite(cursor) && cursor >= 0 ? cursor : 0;
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 20;

    const events = await this.prisma.activity.findMany({
      where: {
        group: {
          members: {
            some: { userId },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: safeCursor,
      take: safeLimit,
    });

    const items = events.map((event) => ({
      id: event.id,
      groupId: event.groupId,
      actorUserId: event.actorUserId,
      type: event.type,
      entityId: event.entityId,
      metadata: event.metadata as Record<string, unknown>,
      createdAt: event.createdAt.toISOString(),
    }));

    return {
      items,
      nextCursor: events.length === safeLimit ? safeCursor + safeLimit : null,
    };
  }
}
