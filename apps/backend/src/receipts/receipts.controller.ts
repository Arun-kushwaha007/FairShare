import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReceiptsService } from './receipts.service';
import { CreateReceiptUrlDto } from './dto/create-receipt-url.dto';

@Controller('expenses/:id/receipt-url')
@UseGuards(JwtAuthGuard)
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Post()
  createUrl(@Param('id') expenseId: string, @Body() dto: CreateReceiptUrlDto) {
    return this.receiptsService.createUploadUrl(expenseId, dto);
  }
}
