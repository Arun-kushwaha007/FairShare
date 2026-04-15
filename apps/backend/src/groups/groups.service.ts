import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import {
  ActivityDto,
  GroupDashboardDto,
  GroupDashboardItemDto,
  GroupDefaultSplitDto,
  GroupDto,
  GroupMemberSummaryDto,
  GroupSummaryDto,
  RemindSettlementRequestDto,
} from '@fairshare/shared-types';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../redis/redis.service';
import { NotificationsService } from '../notifications/notifications.service';
import { RealtimeService } from '../realtime/realtime.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateGroupDefaultSplitDto } from './dto/update-group-default-split.dto';

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
      shareEnabled: group.shareEnabled,
      shareToken: group.shareToken,
      defaultSplitPreference: null,
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
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });

    return groups.map((group) => ({
      id: group.id,
      name: group.name,
      currency: group.currency as 'USD' | 'EUR' | 'INR',
      createdBy: group.createdBy,
      createdAt: group.createdAt.toISOString(),
      shareEnabled: group.shareEnabled,
      shareToken: group.shareToken,
      defaultSplitPreference: this.parseDefaultSplitPreference(
        group.defaultSplitType,
        group.defaultSplitConfig,
      ),
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
      shareEnabled: group.shareEnabled,
      shareToken: group.shareToken,
      defaultSplitPreference: this.parseDefaultSplitPreference(
        group.defaultSplitType,
        group.defaultSplitConfig,
      ),
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
      perUserSpent[expense.payerId] =
        (perUserSpent[expense.payerId] ?? 0n) + expense.totalAmountCents;
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
        perUserOwed[balance.userId] =
          (perUserOwed[balance.userId] ?? 0n) + balance.amountCents * -1n;
      }
    });

    const topSpenderEntry = Object.entries(perUserSpent).sort((a, b) => Number(b[1] - a[1]))[0];

    const response: GroupSummaryDto = {
      totalExpensesCents: totalExpenses.toString(),
      totalSettledCents: totalSettled.toString(),
      perUserSpentCents: Object.fromEntries(
        Object.entries(perUserSpent).map(([k, v]) => [k, v.toString()]),
      ),
      perUserOwedCents: Object.fromEntries(
        Object.entries(perUserOwed).map(([k, v]) => [k, v.toString()]),
      ),
      largestExpenseCents: largestExpense !== null ? String(largestExpense) : null,
      lastExpenseCents: expenses.length > 0 ? expenses[0].totalAmountCents.toString() : null,
      topSpenderUserId: topSpenderEntry?.[0] ?? null,
    };

    await this.redis.setGroupSummaryCache(groupId, JSON.stringify(response), 120);
    return response;
  }

  async getUserSummary(userId: string): Promise<{ totalBalanceCents: string }> {
    const balances = await this.prisma.balance.findMany({
      where: { 
        userId,
        group: { deletedAt: null }
      },
      select: { amountCents: true },
    });

    const totalBalance = balances.reduce((acc, curr) => acc + curr.amountCents, 0n);

    return {
      totalBalanceCents: totalBalance.toString(),
    };
  }

  async getDashboard(userId: string): Promise<GroupDashboardDto> {
    const groups = await this.prisma.group.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
        deletedAt: null,
      },
      include: {
        _count: {
          select: {
            members: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const groupIds = groups.map((group) => group.id);
    if (groupIds.length === 0) {
      return {
        totalBalanceCents: '0',
        activeGroupCount: 0,
        groups: [],
        attentionItems: [],
      };
    }

    const [userBalances, groupBalances, recurringExpenses] = await Promise.all([
      this.prisma.balance.findMany({
        where: {
          userId,
          groupId: { in: groupIds },
        },
        select: {
          groupId: true,
          amountCents: true,
        },
      }),
      this.prisma.balance.findMany({
        where: {
          groupId: { in: groupIds },
        },
        select: {
          groupId: true,
          userId: true,
          amountCents: true,
        },
      }),
      this.prisma.recurringExpense.findMany({
        where: {
          groupId: { in: groupIds },
          active: true,
        },
        select: {
          groupId: true,
          nextOccurrenceAt: true,
        },
      }),
    ]);

    const totalBalanceCents = userBalances.reduce((sum, balance) => sum + balance.amountCents, 0n);

    const netBalanceByGroup = new Map<string, bigint>();
    for (const balance of userBalances) {
      netBalanceByGroup.set(
        balance.groupId,
        (netBalanceByGroup.get(balance.groupId) ?? 0n) + balance.amountCents,
      );
    }

    const dueRecurringByGroup = new Map<string, number>();
    for (const recurringExpense of recurringExpenses) {
      if (recurringExpense.nextOccurrenceAt.getTime() <= Date.now()) {
        dueRecurringByGroup.set(
          recurringExpense.groupId,
          (dueRecurringByGroup.get(recurringExpense.groupId) ?? 0) + 1,
        );
      }
    }

    const netBalanceGraph = new Map<string, Map<string, bigint>>();
    for (const balance of groupBalances) {
      const groupNet = netBalanceGraph.get(balance.groupId) ?? new Map<string, bigint>();
      groupNet.set(balance.userId, (groupNet.get(balance.userId) ?? 0n) + balance.amountCents);
      netBalanceGraph.set(balance.groupId, groupNet);
    }

    const attentionItems: GroupDashboardItemDto[] = groups
      .map((group) => {
        const positions = netBalanceGraph.get(group.id) ?? new Map<string, bigint>();
        const settlementCount = this.countSimplifiedSettlements(positions);
        const dueRecurringCount = dueRecurringByGroup.get(group.id) ?? 0;
        const pendingActionCount = settlementCount + dueRecurringCount;

        return {
          groupId: group.id,
          groupName: group.name,
          currency: group.currency as GroupDashboardItemDto['currency'],
          memberCount: group._count.members,
          netBalanceCents: (netBalanceByGroup.get(group.id) ?? 0n).toString(),
          settlementCount,
          dueRecurringCount,
          pendingActionCount,
        };
      })
      .filter((item) => item.pendingActionCount > 0)
      .sort((left, right) => right.pendingActionCount - left.pendingActionCount);

    return {
      totalBalanceCents: totalBalanceCents.toString(),
      activeGroupCount: groups.length,
      groups: groups.map((group) => ({
        id: group.id,
        name: group.name,
        currency: group.currency as GroupDashboardDto['groups'][number]['currency'],
      })),
      attentionItems,
    };
  }
  
  async toggleShare(groupId: string, actorUserId: string, enabled: boolean): Promise<GroupDto> {
    await this.assertMembership(groupId, actorUserId);
    
    let shareToken = null;
    if (enabled) {
      const group = await this.prisma.group.findUnique({ where: { id: groupId } });
      shareToken = group?.shareToken ?? randomBytes(16).toString('hex');
    }
    
    const updated = await this.prisma.group.update({
      where: { id: groupId },
      data: {
        shareEnabled: enabled,
        shareToken: enabled ? shareToken : null,
      },
      include: { members: true },
    });
    
    await this.redis.invalidateGroupCache(groupId);
    
    return {
      id: updated.id,
      name: updated.name,
      currency: updated.currency as 'USD' | 'EUR' | 'INR',
      createdBy: updated.createdBy,
      createdAt: updated.createdAt.toISOString(),
      shareEnabled: updated.shareEnabled,
      shareToken: updated.shareToken,
      defaultSplitPreference: this.parseDefaultSplitPreference(
        updated.defaultSplitType,
        updated.defaultSplitConfig,
      ),
      members: updated.members.map((member) => ({
        id: member.id,
        userId: member.userId,
        groupId: member.groupId,
        role: member.role,
        joinedAt: member.joinedAt.toISOString(),
      })),
    };
  }

  async getGroupByShareToken(token: string): Promise<GroupDto> {
    const group = await this.prisma.group.findUnique({
      where: { shareToken: token },
      include: { members: true },
    });
    
    if (!group || !group.shareEnabled) {
      throw new NotFoundException('Shared group not found');
    }
    
    return {
      id: group.id,
      name: group.name,
      currency: group.currency as 'USD' | 'EUR' | 'INR',
      createdBy: group.createdBy,
      createdAt: group.createdAt.toISOString(),
      shareEnabled: group.shareEnabled,
      shareToken: group.shareToken,
      defaultSplitPreference: this.parseDefaultSplitPreference(
        group.defaultSplitType,
        group.defaultSplitConfig,
      ),
      members: group.members.map((member) => ({
        id: member.id,
        userId: member.userId,
        groupId: member.groupId,
        role: member.role,
        joinedAt: member.joinedAt.toISOString(),
      })),
    };
  }

  async updateDefaultSplit(
    groupId: string,
    actorUserId: string,
    dto: UpdateGroupDefaultSplitDto,
  ): Promise<GroupDto> {
    await this.assertMembership(groupId, actorUserId);

    let normalizedPreference: GroupDefaultSplitDto | null = null;
    if (dto.defaultSplitPreference) {
      const members = await this.prisma.groupMember.findMany({
        where: { groupId },
        select: { userId: true },
      });
      const memberIds = new Set(members.map((member) => member.userId));
      const participantUserIds = Array.from(new Set(dto.defaultSplitPreference.participantUserIds));

      if (participantUserIds.length === 0) {
        throw new ForbiddenException('Default split must include at least one participant');
      }

      const invalidParticipant = participantUserIds.find((userId) => !memberIds.has(userId));
      if (invalidParticipant) {
        throw new ForbiddenException('Default split participants must belong to the group');
      }

      normalizedPreference = {
        splitType: dto.defaultSplitPreference.splitType,
        participantUserIds,
        exactAmountsCentsByUser: dto.defaultSplitPreference.exactAmountsCentsByUser,
        percentagesByUser: dto.defaultSplitPreference.percentagesByUser,
      };
    }

    await this.prisma.group.update({
      where: { id: groupId },
      data: {
        defaultSplitType: normalizedPreference?.splitType ?? null,
        defaultSplitConfig: normalizedPreference
          ? JSON.stringify({
              participantUserIds: normalizedPreference.participantUserIds,
              exactAmountsCentsByUser: normalizedPreference.exactAmountsCentsByUser ?? {},
              percentagesByUser: normalizedPreference.percentagesByUser ?? {},
            })
          : null,
      },
    });

    const group = await this.prisma.group.findUniqueOrThrow({
      where: { id: groupId },
      include: { members: true },
    });

    await this.redis.invalidateGroupCache(groupId);

    return {
      id: group.id,
      name: group.name,
      currency: group.currency as 'USD' | 'EUR' | 'INR',
      createdBy: group.createdBy,
      createdAt: group.createdAt.toISOString(),
      shareEnabled: group.shareEnabled,
      shareToken: group.shareToken,
      defaultSplitPreference: this.parseDefaultSplitPreference(
        group.defaultSplitType,
        group.defaultSplitConfig,
      ),
      members: group.members.map((member) => ({
        id: member.id,
        userId: member.userId,
        groupId: member.groupId,
        role: member.role,
        joinedAt: member.joinedAt.toISOString(),
      })),
    };
  }

  async invite(
    groupId: string,
    actorUserId: string,
    dto: InviteMemberDto,
  ): Promise<{ success: true }> {
    await this.assertMembership(groupId, actorUserId);
    const email = dto.email.toLowerCase();

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      await this.prisma.groupInvite.upsert({
        where: {
          groupId_email: {
            groupId,
            email,
          },
        },
        create: {
          groupId,
          email,
          invitedBy: actorUserId,
          role: 'MEMBER',
        },
        update: {},
      });
      return { success: true };
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

  async remindSettlement(
    groupId: string,
    actorUserId: string,
    dto: RemindSettlementRequestDto,
  ): Promise<{ success: true; activity: ActivityDto }> {
    await this.assertMembership(groupId, actorUserId);

    const memberRecords = await this.prisma.groupMember.findMany({
      where: {
        groupId,
        userId: {
          in: [actorUserId, dto.payerId, dto.receiverId],
        },
      },
      include: { user: true },
    });

    const membersById = new Map(memberRecords.map((member) => [member.userId, member]));
    if (
      !membersById.has(dto.payerId) ||
      !membersById.has(dto.receiverId) ||
      !membersById.has(actorUserId)
    ) {
      throw new ForbiddenException('Reminder participants must belong to the group');
    }

    const amount = (Number(dto.amountCents) / 100).toFixed(2);
    const receiverName = membersById.get(dto.receiverId)?.user.name ?? 'group member';
    const actorName = membersById.get(actorUserId)?.user.name ?? 'Someone';

    await this.notificationsService.sendPushNotification([dto.payerId], {
      type: 'settlement_reminder',
      title: 'Settlement reminder',
      body: `${actorName} reminded you to pay ${receiverName} ${amount}`,
      data: {
        groupId,
        payerId: dto.payerId,
        receiverId: dto.receiverId,
        amountCents: dto.amountCents,
        notificationType: 'settlement_reminder',
      },
    });

    const activity = await this.prisma.activity.create({
      data: {
        groupId,
        actorUserId,
        type: 'settlement_reminder',
        entityId: `${dto.payerId}-${dto.receiverId}-${dto.amountCents}`,
        metadata: {
          payerId: dto.payerId,
          receiverId: dto.receiverId,
          amountCents: dto.amountCents,
        },
      },
    });

    return {
      success: true,
      activity: {
        id: activity.id,
        groupId: activity.groupId,
        actorUserId: activity.actorUserId,
        type: activity.type,
        entityId: activity.entityId,
        metadata: activity.metadata as Record<string, unknown>,
        createdAt: activity.createdAt.toISOString(),
      },
    };
  }

  async delete(groupId: string, actorUserId: string): Promise<{ success: true }> {
    const membership = await this.prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId: actorUserId,
        },
      },
    });

    if (!membership || membership.role !== 'OWNER') {
      throw new ForbiddenException('Only the group owner can delete the group');
    }

    await this.prisma.group.update({
      where: { id: groupId },
      data: { 
        deletedAt: new Date(),
        shareEnabled: false,
        shareToken: null
      },
    });

    await this.redis.invalidateGroupCache(groupId);
    await this.redis.invalidateUserDashboardCache(actorUserId);

    return { success: true };
  }

  async resolvePendingInvites(userId: string, email: string): Promise<void> {
    const invites = await this.prisma.groupInvite.findMany({
      where: { email: email.toLowerCase() },
    });

    if (invites.length === 0) {
      return;
    }

    await this.prisma.$transaction(async (tx) => {
      for (const invite of invites) {
        await tx.groupMember.create({
          data: {
            groupId: invite.groupId,
            userId,
            role: invite.role,
          },
        });

        await tx.activity.create({
          data: {
            groupId: invite.groupId,
            actorUserId: invite.invitedBy,
            type: 'member_joined',
            entityId: userId,
            metadata: { role: invite.role },
          },
        });

        await tx.groupInvite.delete({
          where: { id: invite.id },
        });

        await this.redis.invalidateGroupCache(invite.groupId);
      }
    });
  }

  private parseDefaultSplitPreference(
    splitType: string | null,
    splitConfig: string | null,
  ): GroupDefaultSplitDto | null {
    if (!splitType || !splitConfig) {
      return null;
    }

    try {
      const config = JSON.parse(splitConfig) as {
        participantUserIds?: unknown;
        exactAmountsCentsByUser?: unknown;
        percentagesByUser?: unknown;
      };

      return {
        splitType: splitType as GroupDefaultSplitDto['splitType'],
        participantUserIds: Array.isArray(config.participantUserIds)
          ? config.participantUserIds.filter((value): value is string => typeof value === 'string')
          : [],
        exactAmountsCentsByUser:
          config.exactAmountsCentsByUser &&
          typeof config.exactAmountsCentsByUser === 'object' &&
          !Array.isArray(config.exactAmountsCentsByUser)
            ? (config.exactAmountsCentsByUser as Record<string, string>)
            : undefined,
        percentagesByUser:
          config.percentagesByUser &&
          typeof config.percentagesByUser === 'object' &&
          !Array.isArray(config.percentagesByUser)
            ? (config.percentagesByUser as Record<string, string>)
            : undefined,
      };
    } catch {
      return null;
    }
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

  private countSimplifiedSettlements(positions: Map<string, bigint>): number {
    const creditors: Array<{ userId: string; amount: bigint }> = [];
    const debtors: Array<{ userId: string; amount: bigint }> = [];

    for (const [userId, amount] of positions.entries()) {
      if (amount > 0n) {
        creditors.push({ userId, amount });
      } else if (amount < 0n) {
        debtors.push({ userId, amount: -amount });
      }
    }

    creditors.sort((a, b) => Number(b.amount - a.amount));
    debtors.sort((a, b) => Number(b.amount - a.amount));

    let settlementCount = 0;
    let debtorIndex = 0;
    let creditorIndex = 0;

    while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
      const debtor = debtors[debtorIndex];
      const creditor = creditors[creditorIndex];
      const amount = debtor.amount < creditor.amount ? debtor.amount : creditor.amount;

      if (amount > 0n) {
        settlementCount += 1;
      }

      debtor.amount -= amount;
      creditor.amount -= amount;

      if (debtor.amount === 0n) {
        debtorIndex += 1;
      }
      if (creditor.amount === 0n) {
        creditorIndex += 1;
      }
    }

    return settlementCount;
  }
}
