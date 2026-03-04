import { SettlementsService } from './settlements.service';

describe('Settlement Flow (integration-ish)', () => {
  it('creates settlement and adjusts balances', async () => {
    const tx: any = {
      settlement: {
        create: jest.fn().mockResolvedValue({
          id: 'st1',
          groupId: 'g1',
          payerId: 'u2',
          receiverId: 'u1',
          amountCents: 500n,
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
        }),
      },
      balance: {
        findUnique: jest.fn().mockResolvedValue(null),
        update: jest.fn(),
        create: jest.fn(),
      },
    };

    const prisma: any = {
      $transaction: jest.fn().mockImplementation(async (cb: (client: any) => unknown) => cb(tx)),
    };

    const balancesService: any = { adjustBalance: jest.fn().mockResolvedValue(undefined) };
    const redis: any = { invalidateGroupCache: jest.fn().mockResolvedValue(undefined) };
    const service = new SettlementsService(prisma, balancesService, redis);

    await service.create('g1', { payerId: 'u2', receiverId: 'u1', amountCents: '500' });

    expect(prisma.$transaction).toHaveBeenCalled();
    expect(tx.settlement.create).toHaveBeenCalled();
    expect(balancesService.adjustBalance).toHaveBeenCalledTimes(2);
    expect(redis.invalidateGroupCache).toHaveBeenCalledWith('g1');
  });
});
