import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { GroupDto, GroupMemberSummaryDto, GroupSummaryDto } from '@fairshare/shared-types';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../redis/redis.service';
import { NotificationsService } from '../notifications/notifications.service';
import { RealtimeService } from '../realtime/realtime.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { InviteMemberDto } from './dto/invite-member.dto';

@Injectable()
export class GroupsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly notificationsService: NotificationsService,
    private readonly realtime: RealtimeService,
  ) {}

  async create(userId: string, dto: CreateGroupDto): Promise<GroupDto> {
    const group = await this.prisma.$transaction(async (tx) => {
      const created = await tx.group.create({
        data: {
          name: dto.name,
          currency: dto.currency,
          createdBy: userId,
        },
      });

      await tx.groupMember.create({
        data: {
          groupId: created.id,
          userId,
          role: 'OWNER',
        },
      });

      await tx.activity.create({
        data: {
          groupId: created.id,
          actorUserId: userId,
          type: 'member_joined',
          entityId: created.id,
          metadata: { role: 'OWNER' },
        },
      });

      return created;
    });

    return {
      id: group.id,
      name: group.name,
      currency: group.currency as 'USD' | 'EUR' | 'INR',
      createdBy: group.createdBy,
      createdAt: group.createdAt.toISOString(),
    };
  }

  async list(userId: string): Promise<GroupDto[]> {
    const groups = await this.prisma.group.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return groups.map((group) => ({
      id: group.id,
      name: group.name,
      currency: group.currency as 'USD' | 'EUR' | 'INR',
      createdBy: group.createdBy,
      createdAt: group.createdAt.toISOString(),
    }));
  }

  async getById(id: string, actorUserId: string): Promise<GroupDto> {
    await this.assertMembership(id, actorUserId);

    const cached = await this.redis.getGroupMembersCache(id);
    if (cached) {
      return JSON.parse(cached) as GroupDto;
    }

    const group = await this.prisma.group.findUnique({
      where: { id },
      include: { members: true },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const response: GroupDto = {
      id: group.id,
      name: group.name,
      currency: group.currency as 'USD' | 'EUR' | 'INR',
      createdBy: group.createdBy,
      createdAt: group.createdAt.toISOString(),
      members: group.members.map((member) => ({
        id: member.id,
        userId: member.userId,
        groupId: member.groupId,
        role: member.role,
        joinedAt: member.joinedAt.toISOString(),
      })),
    };

    await this.redis.setGroupMembersCache(id, JSON.stringify(response));
    return response;
  }

  async members(groupId: string, actorUserId: string): Promise<GroupMemberSummaryDto[]> {
    await this.assertMembership(groupId, actorUserId);

    const members = await this.prisma.groupMember.findMany({
      where: { groupId },
      include: { user: true },
      orderBy: { joinedAt: 'asc' },
    });

    return members.map((member) => ({
      memberId: member.id,
      userId: member.userId,
      name: member.user.name,
      email: member.user.email,
      avatarUrl: member.user.avatarUrl,
      role: member.role,
    }));
  }

  async summary(groupId: string, actorUserId: string): Promise<GroupSummaryDto> {
    await this.assertMembership(groupId, actorUserId);

    const cached = await this.redis.getGroupSummaryCache(groupId);
    if (cached) {
      return JSON.parse(cached) as GroupSummaryDto;
    }

    const [expenses, settlements, balances] = await Promise.all([
      this.prisma.expense.findMany({
        where: { groupId },
        orderBy: { createdAt: 'desc' },
        select: { totalAmountCents: true, payerId: true, createdAt: true },
      }),
      this.prisma.settlement.findMany({
        where: { groupId },
        select: { amountCents: true },
      }),
      this.prisma.balance.findMany({
        where: { groupId },
        select: { userId: true, amountCents: true },
      }),
    ]);

    const perUserSpent: Record<string, bigint> = {};
    const perUserOwed: Record<string, bigint> = {};

    let totalExpenses = 0n;
    let largestExpense: bigint | null = null;
    expenses.forEach((expense) => {
      totalExpenses += expense.totalAmountCents;
      perUserSpent[expense.payerId] = (perUserSpent[expense.payerId] ?? 0n) + expense.totalAmountCents;
      if (largestExpense === null || expense.totalAmountCents > largestExpense) {
        largestExpense = expense.totalAmountCents;
      }
    });

    let totalSettled = 0n;
    settlements.forEach((settlement) => {
      totalSettled += settlement.amountCents;
    });

    balances.forEach((balance) => {
      if (balance.amountCents < 0n) {
        perUserOwed[balance.userId] = (perUserOwed[balance.userId] ?? 0n) + balance.amountCents * -1n;
      }
    });

    const topSpenderEntry = Object.entries(perUserSpent).sort((a, b) => Number(b[1] - a[1]))[0];

    const response: GroupSummaryDto = {
      totalExpensesCents: totalExpenses.toString(),
      totalSettledCents: totalSettled.toString(),
      perUserSpentCents: Object.fromEntries(Object.entries(perUserSpent).map(([k, v]) => [k, v.toString()])),
      perUserOwedCents: Object.fromEntries(Object.entries(perUserOwed).map(([k, v]) => [k, v.toString()])),
      largestExpenseCents: largestExpense !== null ? String(largestExpense) : null,
      lastExpenseCents: expenses.length > 0 ? expenses[0].totalAmountCents.toString() : null,
      topSpenderUserId: topSpenderEntry?.[0] ?? null,
    };

    await this.redis.setGroupSummaryCache(groupId, JSON.stringify(response), 120);
    return response;
  }

  async invite(groupId: string, actorUserId: string, dto: InviteMemberDto): Promise<{ success: true }> {
    await this.assertMembership(groupId, actorUserId);

    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingMembership = await this.prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId: user.id,
        },
      },
    });

    if (existingMembership) {
      throw new ConflictException('User is already a group member');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.groupMember.create({
        data: {
          groupId,
          userId: user.id,
          role: 'MEMBER',
        },
      });

      await tx.activity.create({
        data: {
          groupId,
          actorUserId,
          type: 'member_invited',
          entityId: user.id,
          metadata: {
            invitedUserId: user.id,
            invitedEmail: user.email,
          },
        },
      });
    });

    await this.notificationsService.sendPushNotification([user.id], {
      type: 'group_invite',
      title: 'You were invited',
      body: 'You have been added to a FairShare group.',
      data: { groupId, notificationType: 'group_invite' },
    });

    await this.redis.invalidateGroupCache(groupId);
    this.realtime.emitToGroup(groupId, 'group_member_joined', {
      groupId,
      userId: user.id,
      email: user.email,
    });

    return { success: true };
  }

  private async assertMembership(groupId: string, userId: string): Promise<void> {
    const membership = await this.prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('Actor is not a group member');
    }
  }
}
