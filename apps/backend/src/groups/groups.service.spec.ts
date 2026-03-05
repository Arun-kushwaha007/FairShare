import { ConflictException, ForbiddenException } from '@nestjs/common';
import { GroupsService } from './groups.service';

describe('GroupsService', () => {
  const prisma = {
    groupMember: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
  } as any;

  const redis = {
    invalidateGroupCache: jest.fn(),
    getGroupMembersCache: jest.fn(),
    setGroupMembersCache: jest.fn(),
  } as any;

  const notificationsService = {
    sendPushNotification: jest.fn(),
  } as any;
  const realtime = { emitToGroup: jest.fn() } as any;

  let service: GroupsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new GroupsService(prisma, redis, notificationsService, realtime);
  });

  it('lists group members for a valid group member', async () => {
    prisma.groupMember.findUnique.mockResolvedValueOnce({ id: 'actor-membership' });
    prisma.groupMember.findMany.mockResolvedValueOnce([
      {
        id: 'm1',
        groupId: 'g1',
        userId: 'u1',
        role: 'OWNER',
        user: { id: 'u1', name: 'Arun', email: 'arun@example.com', avatarUrl: null },
      },
      {
        id: 'm2',
        groupId: 'g1',
        userId: 'u2',
        role: 'MEMBER',
        user: { id: 'u2', name: 'Test', email: 'test@example.com', avatarUrl: 'https://avatar' },
      },
    ]);

    const result = await service.members('g1', 'u1');

    expect(result).toEqual([
      {
        memberId: 'm1',
        userId: 'u1',
        name: 'Arun',
        email: 'arun@example.com',
        avatarUrl: null,
        role: 'OWNER',
      },
      {
        memberId: 'm2',
        userId: 'u2',
        name: 'Test',
        email: 'test@example.com',
        avatarUrl: 'https://avatar',
        role: 'MEMBER',
      },
    ]);
  });

  it('blocks member listing when actor is not a group member', async () => {
    prisma.groupMember.findUnique.mockResolvedValueOnce(null);

    await expect(service.members('g1', 'u9')).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('invites a user and writes activity event', async () => {
    prisma.groupMember.findUnique
      .mockResolvedValueOnce({ id: 'actor-membership' })
      .mockResolvedValueOnce(null);
    prisma.user.findUnique.mockResolvedValueOnce({ id: 'u2', email: 'test@example.com' });

    prisma.$transaction.mockImplementationOnce(async (fn: any) => {
      const tx = {
        groupMember: { create: jest.fn().mockResolvedValue({}) },
        activity: { create: jest.fn().mockResolvedValue({}) },
      };
      return fn(tx);
    });

    const result = await service.invite('g1', 'u1', { email: 'test@example.com' });

    expect(result).toEqual({ success: true });
    expect(notificationsService.sendPushNotification).toHaveBeenCalledWith(
      ['u2'],
      expect.objectContaining({ type: 'group_invite', data: { groupId: 'g1', notificationType: 'group_invite' } }),
    );
    expect(redis.invalidateGroupCache).toHaveBeenCalledWith('g1');
    expect(realtime.emitToGroup).toHaveBeenCalledWith(
      'g1',
      'group_member_joined',
      expect.objectContaining({ userId: 'u2' }),
    );
  });

  it('prevents duplicate invites', async () => {
    prisma.groupMember.findUnique
      .mockResolvedValueOnce({ id: 'actor-membership' })
      .mockResolvedValueOnce({ id: 'existing-membership' });
    prisma.user.findUnique.mockResolvedValueOnce({ id: 'u2', email: 'test@example.com' });

    await expect(service.invite('g1', 'u1', { email: 'test@example.com' })).rejects.toBeInstanceOf(ConflictException);
  });

  it('blocks invite when actor is not a member', async () => {
    prisma.groupMember.findUnique.mockResolvedValueOnce(null);

    await expect(service.invite('g1', 'u9', { email: 'test@example.com' })).rejects.toBeInstanceOf(ForbiddenException);
  });
});
