import { ExpensesService } from '../expenses/expenses.service';

describe('Create Expense Flow (integration-ish)', () => {
  it('creates expense and updates balances via transaction', async () => {
    const tx: any = {
      expense: {
        create: jest.fn().mockResolvedValue({ id: 'e1' }),
        findUniqueOrThrow: jest.fn().mockResolvedValue({
          id: 'e1',
          groupId: 'g1',
          payerId: 'u1',
          description: 'Dinner',
          totalAmountCents: 1000n,
          currency: 'USD',
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          splits: [{ id: 's1', userId: 'u2', owedAmountCents: 500n, paidAmountCents: 0n }],
        }),
      },
      split: {
        createMany: jest.fn(),
      },
      activity: {
        create: jest.fn(),
      },
      balance: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    const prisma: any = {
      groupMember: {
        findMany: jest.fn().mockResolvedValue([{ userId: 'u1' }, { userId: 'u2' }]),
      },
      $transaction: jest.fn().mockImplementation(async (cb: (client: any) => unknown) => cb(tx)),
    };

    const balancesService: any = {
      adjustBalance: jest.fn().mockResolvedValue(undefined),
    };

    const redis: any = {
      invalidateGroupCache: jest.fn().mockResolvedValue(undefined),
    };

    const activityService: any = { log: jest.fn().mockResolvedValue(undefined) };
    const notificationsService: any = { sendPushNotification: jest.fn().mockResolvedValue(undefined) };
    const realtime: any = { emitToGroup: jest.fn() };
    const service = new ExpensesService(prisma, balancesService, redis, activityService, notificationsService, realtime);

    await service.create('g1', 'u1', {
      payerId: 'u1',
      description: 'Dinner',
      totalAmountCents: '1000',
      currency: 'USD',
      splits: [
        { userId: 'u1', owedAmountCents: '500', paidAmountCents: '1000' },
        { userId: 'u2', owedAmountCents: '500', paidAmountCents: '0' },
      ],
    });

    expect(prisma.groupMember.findMany).toHaveBeenCalled();
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(tx.expense.create).toHaveBeenCalled();
    expect(tx.split.createMany).toHaveBeenCalled();
    expect(tx.activity.create).toHaveBeenCalled();
    expect(balancesService.adjustBalance).toHaveBeenCalledTimes(2);
    expect(redis.invalidateGroupCache).toHaveBeenCalledWith('g1');
    expect(notificationsService.sendPushNotification).toHaveBeenCalledWith(
      ['u2'],
      expect.objectContaining({
        type: 'expense_created',
      }),
    );
    expect(realtime.emitToGroup).toHaveBeenCalledWith('g1', 'expense_created', expect.any(Object));
  });
});

