import { BadRequestException } from '@nestjs/common';
import { ExpensesService } from './expenses.service';

describe('ExpensesService', () => {
  it('rejects create when split sum does not match total', async () => {
    const prisma: any = {
      groupMember: {
        findMany: jest.fn().mockResolvedValue([{ userId: 'u1' }, { userId: 'u2' }]),
      },
    };

    const balancesService: any = { adjustBalance: jest.fn() };
    const redis: any = { invalidateGroupCache: jest.fn() };
    const activityService: any = { log: jest.fn() };
    const notificationsService: any = { sendPushNotification: jest.fn() };

    const service = new ExpensesService(prisma, balancesService, redis, activityService, notificationsService);

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
