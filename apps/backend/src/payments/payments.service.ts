import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { CreatePaymentIntentResponseDto } from '@fairshare/shared-types';
import Stripe from 'stripe';
import { randomUUID } from 'crypto';
import { PrismaService } from '../common/prisma.service';
import { SettlementsService } from '../settlements/settlements.service';
import { AppConfigService } from '../config/app-config.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    private readonly settlementsService: SettlementsService,
    private readonly config: AppConfigService,
  ) {
    this.stripe = new Stripe(this.config.stripeSecretKey, {
      apiVersion: '2025-08-27.basil',
    });
  }

  async createIntent(actorUserId: string, dto: CreatePaymentIntentDto): Promise<CreatePaymentIntentResponseDto> {
    const amount = BigInt(dto.amountCents);
    if (amount <= 0n) {
      throw new BadRequestException('Amount must be positive');
    }

    if (actorUserId !== dto.payerId) {
      throw new ForbiddenException('Only payer can initiate payment');
    }

    const memberships = await this.prisma.groupMember.findMany({
      where: {
        groupId: dto.groupId,
        userId: { in: [dto.payerId, dto.receiverId] },
      },
      select: { userId: true },
    });
    if (memberships.length !== 2) {
      throw new BadRequestException('Payer and receiver must be group members');
    }

    const payment = await this.prisma.payment.create({
      data: {
        groupId: dto.groupId,
        payerId: dto.payerId,
        receiverId: dto.receiverId,
        amountCents: amount,
        stripePaymentIntentId: `pending_${randomUUID()}`,
        status: 'pending',
      },
    });

    const intent = await this.stripe.paymentIntents.create({
      amount: Number(amount),
      currency: dto.currency.toLowerCase(),
      metadata: {
        paymentId: payment.id,
        groupId: dto.groupId,
        payerId: dto.payerId,
        receiverId: dto.receiverId,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { stripePaymentIntentId: intent.id },
    });

    return {
      paymentId: payment.id,
      paymentIntentId: intent.id,
      clientSecret: intent.client_secret ?? '',
    };
  }

  async handleWebhook(signature: string | undefined, payload: Record<string, unknown>): Promise<void> {
    const event = await this.resolveEvent(signature, payload);

    if (event.type !== 'payment_intent.succeeded') {
      return;
    }

    const intent = event.data.object as Stripe.PaymentIntent;
    const payment = await this.prisma.payment.findUnique({
      where: { stripePaymentIntentId: intent.id },
    });

    if (!payment || payment.status === 'succeeded') {
      return;
    }

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'succeeded' },
    });

    await this.settlementsService.create(payment.groupId, payment.payerId, {
      payerId: payment.payerId,
      receiverId: payment.receiverId,
      amountCents: payment.amountCents.toString(),
    });

    this.logger.log(`Payment succeeded and settlement recorded paymentId=${payment.id}`);
  }

  private async resolveEvent(
    signature: string | undefined,
    payload: Record<string, unknown>,
  ): Promise<Stripe.Event> {
    const webhookSecret = this.config.stripeWebhookSecret;
    if (signature && webhookSecret) {
      const rawBody = JSON.stringify(payload);
      return this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    }

    return payload as unknown as Stripe.Event;
  }
}
