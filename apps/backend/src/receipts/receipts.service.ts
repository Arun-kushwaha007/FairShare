import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PresignedReceiptUrlResponseDto } from '@fairshare/shared-types';
import { PrismaService } from '../common/prisma.service';
import { S3Service } from '../s3/s3.service';
import { CreateReceiptUrlDto } from './dto/create-receipt-url.dto';

@Injectable()
export class ReceiptsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
  ) {}

  async createUploadUrl(expenseId: string, dto: CreateReceiptUrlDto): Promise<PresignedReceiptUrlResponseDto> {
    const expense = await this.prisma.expense.findUnique({ where: { id: expenseId } });
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    const extension = dto.extension ?? 'jpg';
    const fileKey = `receipts/${expense.groupId}/${expenseId}/${randomUUID()}.${extension}`;

    await this.prisma.receipt.upsert({
      where: { expenseId },
      update: { fileKey },
      create: {
        expenseId,
        fileKey,
      },
    });

    const uploadUrl = await this.s3.getPresignedUploadUrl(fileKey, `image/${extension}`);
    return { uploadUrl, fileKey };
  }
}
