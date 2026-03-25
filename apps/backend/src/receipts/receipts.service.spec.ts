import { NotFoundException } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';

describe('ReceiptsService', () => {
  it('maps jpg uploads to image/jpeg', async () => {
    const prisma: any = {
      expense: {
        findUnique: jest.fn().mockResolvedValue({ id: 'expense-1', groupId: 'group-1' }),
      },
      receipt: {
        upsert: jest.fn().mockResolvedValue({ id: 'receipt-1' }),
      },
    };
    const s3: any = {
      getPresignedUploadUrl: jest.fn().mockResolvedValue('https://signed.example/upload'),
    };
    const jobsQueue: any = {
      enqueueReceiptProcessing: jest.fn().mockResolvedValue(undefined),
    };
    const service = new ReceiptsService(prisma, s3, jobsQueue);

    await service.createUploadUrl('expense-1', { extension: 'jpg' });

    expect(s3.getPresignedUploadUrl).toHaveBeenCalledWith(
      expect.stringMatching(/^receipts\/group-1\/expense-1\/.+\.jpg$/),
      'image/jpeg',
    );
  });

  it('creates a receipt record and returns a presigned upload URL', async () => {
    const prisma: any = {
      expense: {
        findUnique: jest.fn().mockResolvedValue({ id: 'expense-1', groupId: 'group-1' }),
      },
      receipt: {
        upsert: jest.fn().mockResolvedValue({ id: 'receipt-1' }),
      },
    };
    const s3: any = {
      getPresignedUploadUrl: jest.fn().mockResolvedValue('https://signed.example/upload'),
    };
    const jobsQueue: any = {
      enqueueReceiptProcessing: jest.fn().mockResolvedValue(undefined),
    };
    const service = new ReceiptsService(prisma, s3, jobsQueue);

    const result = await service.createUploadUrl('expense-1', { extension: 'png' });

    expect(prisma.expense.findUnique).toHaveBeenCalledWith({ where: { id: 'expense-1' } });
    expect(prisma.receipt.upsert).toHaveBeenCalledWith({
      where: { expenseId: 'expense-1' },
      update: {
        fileKey: expect.stringMatching(/^receipts\/group-1\/expense-1\/.+\.png$/),
      },
      create: {
        expenseId: 'expense-1',
        fileKey: expect.stringMatching(/^receipts\/group-1\/expense-1\/.+\.png$/),
      },
    });
    expect(s3.getPresignedUploadUrl).toHaveBeenCalledWith(
      expect.stringMatching(/^receipts\/group-1\/expense-1\/.+\.png$/),
      'image/png',
    );
    expect(jobsQueue.enqueueReceiptProcessing).toHaveBeenCalledWith({
      receiptId: 'receipt-1',
      expenseId: 'expense-1',
    });
    expect(result).toEqual({
      uploadUrl: 'https://signed.example/upload',
      fileKey: expect.stringMatching(/^receipts\/group-1\/expense-1\/.+\.png$/),
    });
  });

  it('throws when the expense does not exist', async () => {
    const prisma: any = {
      expense: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
    };
    const s3: any = {
      getPresignedUploadUrl: jest.fn(),
    };
    const jobsQueue: any = {
      enqueueReceiptProcessing: jest.fn(),
    };
    const service = new ReceiptsService(prisma, s3, jobsQueue);

    await expect(service.createUploadUrl('missing-expense', {})).rejects.toBeInstanceOf(NotFoundException);
    expect(s3.getPresignedUploadUrl).not.toHaveBeenCalled();
    expect(jobsQueue.enqueueReceiptProcessing).not.toHaveBeenCalled();
  });
});
