import { Controller, Headers, HttpCode, HttpStatus, Post, Body } from '@nestjs/common';
import { CreatePaymentIntentResponseDto } from '@fairshare/shared-types';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequestUser } from '../common/types/authenticated-request-user.type';
import { UseGuards } from '@nestjs/common';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-intent')
  createIntent(
    @CurrentUser() user: AuthenticatedRequestUser,
    @Body() dto: CreatePaymentIntentDto,
    @Headers('x-idempotency-key') idempotencyKey?: string,
  ): Promise<CreatePaymentIntentResponseDto> {
    return this.paymentsService.createIntent(user.sub, dto, idempotencyKey);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async webhook(
    @Headers('stripe-signature') signature: string | undefined,
    @Body() payload: Record<string, unknown>,
  ): Promise<{ received: true }> {
    await this.paymentsService.handleWebhook(signature, payload);
    return { received: true };
  }
}
