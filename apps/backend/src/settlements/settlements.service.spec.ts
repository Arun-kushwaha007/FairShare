import { BadRequestException } from '@nestjs/common';
import { SettlementsService } from './settlements.service';

describe('SettlementsService', () => {
  it('returns the existing settlement when the idempotency key already exists', async () => {
    const existingSettlement = {
      id: 'settlement-1',
      groupId: 'group-1',
      payerId: 'payer-1',
      receiverId: 'receiver-1',
      amountCents: 1200n,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    };
    const prisma: any = {
      settlement: {
        findUnique: jest.fn().mockResolvedValue(existingSettlement),
      },
    };
    const service = new SettlementsService(prisma, {} as any, {} as any, {} as any, {} as any);

    await expect(
      service.create(
        'group-1',
        'payer-1',
        { payerId: 'payer-1', receiverId: 'receiver-1', amountCents: '1200' },
        'payment:settlement-1',
      ),
    ).resolves.toEqual({
      id: 'settlement-1',
      groupId: 'group-1',
      payerId: 'payer-1',
      receiverId: 'receiver-1',
      amountCents: '1200',
      createdAt: '2026-01-01T00:00:00.000Z',
    });
  });

  it('re-reads the existing settlement after a unique-key race on idempotency', async () => {
    const existingSettlement = {
      id: 'settlement-2',
      groupId: 'group-1',
      payerId: 'payer-1',
      receiverId: 'receiver-1',
      amountCents: 1200n,
      createdAt: new Date('2026-01-02T00:00:00.000Z'),
    };
    const prisma: any = {
      settlement: {
        findUnique: jest
          .fn()
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce(existingSettlement),
        findFirst: jest.fn().mockResolvedValue(null),
      },
      groupMember: {
        findMany: jest.fn().mockResolvedValue([{ userId: 'payer-1' }, { userId: 'receiver-1' }]),
      },
      $transaction: jest.fn().mockRejectedValue({ code: 'P2002' }),
    };
    const service = new SettlementsService(prisma, {} as any, {} as any, {} as any, {} as any);

    await expect(
      service.create(
        'group-1',
        'payer-1',
        { payerId: 'payer-1', receiverId: 'receiver-1', amountCents: '1200' },
        'payment:settlement-2',
      ),
    ).resolves.toEqual({
      id: 'settlement-2',
      groupId: 'group-1',
      payerId: 'payer-1',
      receiverId: 'receiver-1',
      amountCents: '1200',
      createdAt: '2026-01-02T00:00:00.000Z',
    });
  });

  it('rejects non-positive settlements before any downstream work', async () => {
    const prisma: any = {
      settlement: {
        findUnique: jest.fn(),
      },
    };
    const service = new SettlementsService(prisma, {} as any, {} as any, {} as any, {} as any);

    await expect(
      service.create('group-1', 'payer-1', { payerId: 'payer-1', receiverId: 'receiver-1', amountCents: '0' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('generates a fallback idempotency key and prevents duplicates in the same minute', async () => {
    const prisma: any = {
      settlement: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'existing-1',
          groupId: 'g1',
          payerId: 'u1',
          receiverId: 'u2',
          amountCents: 5000n,
          createdAt: new Date(),
        }),
      },
      groupMember: {
        findMany: jest.fn().mockResolvedValue([{ userId: 'u1' }, { userId: 'u2' }]),
      },
    };
    const service = new SettlementsService(prisma, {} as any, {} as any, {} as any, {} as any);

    // This should hit the findUnique with the fallback key and return existing
    const result = await service.create('g1', 'u1', {
      payerId: 'u1',
      receiverId: 'u2',
      amountCents: '5000',
    });

    expect(result.id).toBe('existing-1');
    expect(prisma.settlement.findUnique).toHaveBeenCalled();
  });
});
