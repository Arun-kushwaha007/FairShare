import { BadRequestException } from '@nestjs/common';
import { ExpensesService } from './expenses.service';

describe('ExpensesService', () => {
  it('returns the existing expense when the idempotency key already exists', async () => {
    const existingExpense = {
      id: 'expense-1',
      groupId: 'group-1',
      payerId: 'payer-1',
      description: 'Dinner',
      totalAmountCents: 1250n,
      currency: 'USD',
      category: null,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      splits: [{ id: 'split-1', userId: 'payer-1', owedAmountCents: 1250n, paidAmountCents: 1250n }],
      receipt: null,
    };
    const prisma: any = {
      expense: {
        findUnique: jest.fn().mockResolvedValue(existingExpense),
      },
    };

    const service = new ExpensesService(prisma, {} as any, {} as any, {} as any, {} as any, {} as any);

    await expect(
      service.create(
        'group-1',
        'payer-1',
        {
          payerId: 'payer-1',
          description: 'Dinner',
          totalAmountCents: '1250',
          currency: 'USD',
          splits: [{ userId: 'payer-1', owedAmountCents: '1250', paidAmountCents: '1250' }],
        },
        'mobile:expense:existing',
      ),
    ).resolves.toEqual({
      id: 'expense-1',
      groupId: 'group-1',
      payerId: 'payer-1',
      description: 'Dinner',
      totalAmountCents: '1250',
      currency: 'USD',
      category: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      receiptFileKey: null,
      splits: [{ id: 'split-1', userId: 'payer-1', owedAmountCents: '1250', paidAmountCents: '1250' }],
    });
  });

  it('re-reads the existing expense after a unique-key race on idempotency', async () => {
    const existingExpense = {
      id: 'expense-2',
      groupId: 'group-1',
      payerId: 'payer-1',
      description: 'Lunch',
      totalAmountCents: 1500n,
      currency: 'USD',
      category: null,
      createdAt: new Date('2026-01-02T00:00:00.000Z'),
      splits: [
        { id: 'split-1', userId: 'payer-1', owedAmountCents: 1000n, paidAmountCents: 1500n },
        { id: 'split-2', userId: 'payer-2', owedAmountCents: 500n, paidAmountCents: 0n },
      ],
      receipt: null,
    };
    const prisma: any = {
      expense: {
        findUnique: jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce(existingExpense),
      },
      groupMember: {
        findMany: jest.fn().mockResolvedValue([{ userId: 'payer-1' }, { userId: 'payer-2' }]),
      },
      $transaction: jest.fn().mockRejectedValue({ code: 'P2002' }),
    };
    const service = new ExpensesService(prisma, {} as any, {} as any, {} as any, {} as any, {} as any);

    await expect(
      service.create(
        'group-1',
        'payer-1',
        {
          payerId: 'payer-1',
          description: 'Lunch',
          totalAmountCents: '1500',
          currency: 'USD',
          splits: [
            { userId: 'payer-1', owedAmountCents: '1000', paidAmountCents: '1500' },
            { userId: 'payer-2', owedAmountCents: '500', paidAmountCents: '0' },
          ],
        },
        'mobile:expense:race',
      ),
    ).resolves.toEqual({
      id: 'expense-2',
      groupId: 'group-1',
      payerId: 'payer-1',
      description: 'Lunch',
      totalAmountCents: '1500',
      currency: 'USD',
      category: null,
      createdAt: '2026-01-02T00:00:00.000Z',
      receiptFileKey: null,
      splits: [
        { id: 'split-1', userId: 'payer-1', owedAmountCents: '1000', paidAmountCents: '1500' },
        { id: 'split-2', userId: 'payer-2', owedAmountCents: '500', paidAmountCents: '0' },
      ],
    });
  });

  it('rejects create when split sum does not match total', async () => {
    const prisma: any = {
      expense: {
        findUnique: jest.fn(),
      },
      groupMember: {
        findMany: jest.fn().mockResolvedValue([{ userId: 'u1' }, { userId: 'u2' }]),
      },
    };

    const balancesService: any = { adjustBalance: jest.fn() };
    const redis: any = { invalidateGroupCache: jest.fn() };
    const activityService: any = { log: jest.fn() };
    const notificationsService: any = { sendPushNotification: jest.fn() };
    const realtime: any = { emitToGroup: jest.fn() };

    const service = new ExpensesService(prisma, balancesService, redis, activityService, notificationsService, realtime);

    await expect(
      service.create('g1', 'u1', {
        payerId: 'u1',
        description: 'Dinner',
        totalAmountCents: '1000',
        currency: 'USD',
        splits: [
          { userId: 'u1', owedAmountCents: '200', paidAmountCents: '1000' },
          { userId: 'u2', owedAmountCents: '500', paidAmountCents: '0' },
        ],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
