import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PresignedReceiptUrlResponseDto } from '@fairshare/shared-types';
import { PrismaService } from '../common/prisma.service';
import { JobsQueueService } from '../jobs/jobs-queue.service';
import { S3Service } from '../s3/s3.service';
import { CreateReceiptUrlDto, ReceiptExtension } from './dto/create-receipt-url.dto';

const RECEIPT_MIME_TYPES: Record<ReceiptExtension, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

    const extension = (dto.extension ?? 'jpg').toLowerCase() as ReceiptExtension;
    if (!RECEIPT_MIME_TYPES[extension]) {
      throw new BadRequestException(`Unsupported file extension: ${extension}`);
    }

    const fileKey = `receipts/${expense.groupId}/${expenseId}/${randomUUID()}.${extension}`;

    const receipt = await this.prisma.receipt.upsert({
      where: { expenseId },
      update: { fileKey },
      create: {
        expenseId,
        fileKey,
      },
    });

    await this.jobsQueue.enqueueReceiptProcessing({
      receiptId: receipt.id,
      expenseId,
    });

    const uploadUrl = await this.s3.getPresignedUploadUrl(fileKey, RECEIPT_MIME_TYPES[extension]);
    return { uploadUrl, fileKey };
  }
}
