import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { GroupDto } from '@fairshare/shared-types';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { InviteMemberDto } from './dto/invite-member.dto';

@Injectable()
export class GroupsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
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

  async getById(id: string): Promise<GroupDto> {
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

  async invite(groupId: string, actorUserId: string, dto: InviteMemberDto): Promise<{ success: true }> {
    const actorMembership = await this.prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId: actorUserId,
        },
      },
    });
    if (!actorMembership) {
      throw new ForbiddenException('Actor is not a group member');
    }

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

    await this.redis.invalidateGroupCache(groupId);

    return { success: true };
  }
}

