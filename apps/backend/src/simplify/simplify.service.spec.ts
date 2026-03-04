import { SimplifyService } from './simplify.service';

describe('SimplifyService', () => {
  it('should generate greedy suggestions', async () => {
    const prisma = {
      balance: {
        findMany: jest.fn().mockResolvedValue([
          { userId: 'A', amountCents: 700n },
          { userId: 'B', amountCents: -500n },
          { userId: 'C', amountCents: -200n },
        ]),
      },
    } as any;

    const service = new SimplifyService(prisma);
    const result = await service.simplifyGroup('group-1');

    expect(result).toEqual([
      { fromUserId: 'B', toUserId: 'A', amountCents: '500' },
      { fromUserId: 'C', toUserId: 'A', amountCents: '200' },
    ]);
  });
});
