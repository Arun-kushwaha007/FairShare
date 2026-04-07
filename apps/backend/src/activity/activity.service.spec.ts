import { ActivityService } from './activity.service';

describe('ActivityService', () => {
  it('maps actor and group names for group activity', async () => {
    const prisma = {
      activity: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'activity-1',
            groupId: 'group-1',
            actorUserId: 'user-1',
            type: 'expense_created',
            entityId: 'expense-1',
            metadata: { totalAmountCents: '1234', currency: 'USD' },
            createdAt: new Date('2026-04-07T00:00:00.000Z'),
            actor: { name: 'Ava' },
            group: { name: 'Trip Fund' },
          },
        ]),
      },
      user: {
        findMany: jest.fn().mockResolvedValue([
          { id: 'user-1', name: 'Ava' },
        ]),
      },
    };

    const service = new ActivityService(prisma as any);
    const result = await service.getGroupActivity('group-1');

    expect(prisma.activity.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { groupId: 'group-1' },
        include: {
          actor: { select: { name: true } },
          group: { select: { name: true } },
        },
      }),
    );
    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: { id: { in: ['user-1'] } },
      select: { id: true, name: true },
    });
    expect(result.items).toEqual([
      expect.objectContaining({
        actorUserId: 'user-1',
        actorName: 'Ava',
        groupName: 'Trip Fund',
      }),
    ]);
  });

  it('keeps responses backward compatible when names are missing', async () => {
    const prisma = {
      activity: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'activity-2',
            groupId: 'group-2',
            actorUserId: 'user-2',
            type: 'member_joined',
            entityId: 'member-1',
            metadata: {},
            createdAt: new Date('2026-04-07T00:00:00.000Z'),
            actor: null,
            group: null,
          },
        ]),
      },
      user: {
        findMany: jest.fn().mockResolvedValue([]),
      },
    };

    const service = new ActivityService(prisma as any);
    const result = await service.getUserActivity('user-2');

    expect(result.items[0]).toEqual(
      expect.objectContaining({
        actorUserId: 'user-2',
        actorName: undefined,
        groupName: undefined,
      }),
    );
  });
});
