import { Injectable } from '@nestjs/common';
import { ActivityDto, ActivityType } from '@fairshare/shared-types';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  private enrichMetadata(metadata: Record<string, unknown>, userNamesById: Record<string, string>): Record<string, unknown> {
    const payerId = typeof metadata.payerId === 'string' ? metadata.payerId : null;
    const receiverId = typeof metadata.receiverId === 'string' ? metadata.receiverId : null;

    return {
      ...metadata,
      ...(payerId && userNamesById[payerId] ? { payerName: userNamesById[payerId] } : {}),
      ...(receiverId && userNamesById[receiverId] ? { receiverName: userNamesById[receiverId] } : {}),
    };
  }

  private async mapActivities(events: Array<{
    id: string;
    groupId: string;
    actorUserId: string;
    type: ActivityType;
    entityId: string;
    metadata: Prisma.JsonValue;
    createdAt: Date;
    actor?: { name: string | null } | null;
    group?: { name: string | null } | null;
  }>): Promise<ActivityDto[]> {
    const userIds = new Set<string>();

    events.forEach((event) => {
      userIds.add(event.actorUserId);
      const metadata = event.metadata as Record<string, unknown>;
      if (typeof metadata.payerId === 'string') {
        userIds.add(metadata.payerId);
      }
      if (typeof metadata.receiverId === 'string') {
        userIds.add(metadata.receiverId);
      }
    });

    const users = userIds.size
      ? await this.prisma.user.findMany({
          where: { id: { in: [...userIds] } },
          select: { id: true, name: true },
        })
      : [];
    const userNamesById = Object.fromEntries(users.map((user) => [user.id, user.name]));

    return events.map((event) => {
      const metadata = event.metadata as Record<string, unknown>;

      return {
        id: event.id,
        groupId: event.groupId,
        actorUserId: event.actorUserId,
        actorName: userNamesById[event.actorUserId] ?? event.actor?.name ?? undefined,
        groupName: event.group?.name ?? undefined,
        type: event.type,
        entityId: event.entityId,
        metadata: this.enrichMetadata(metadata, userNamesById),
        createdAt: event.createdAt.toISOString(),
      };
    });
  }

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
        type: params.type as never,
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
      include: {
        actor: { select: { name: true } },
        group: { select: { name: true } },
      },
    });

    const items = await this.mapActivities(events);

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
      include: {
        actor: { select: { name: true } },
        group: { select: { name: true } },
      },
    });

    const items = await this.mapActivities(events);

    return {
      items,
      nextCursor: events.length === safeLimit ? safeCursor + safeLimit : null,
    };
  }
}
