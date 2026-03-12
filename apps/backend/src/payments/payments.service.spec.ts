import { BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentsService } from './payments.service';

describe('PaymentsService', () => {
  const basePayment = {
    id: 'payment-1',
    groupId: 'group-1',
    payerId: 'payer-1',
    receiverId: 'receiver-1',
    amountCents: 1250n,
    stripePaymentIntentId: 'pi_123',
    status: 'pending',
  };

  function createService(options?: { webhookSecret?: string }) {
    const prisma: any = {
      payment: {
        findUnique: jest.fn(),
        update: jest.fn().mockResolvedValue(undefined),
      },
    };
    const settlementsService: any = {
      create: jest.fn().mockResolvedValue({
        id: 'settlement-1',
      }),
    };
    const config: any = {
      stripeSecretKey: 'sk_test_123',
      stripeWebhookSecret: options?.webhookSecret ?? '',
    };
    const service = new PaymentsService(prisma, settlementsService, config);

    (service as any).stripe = {
      webhooks: {
        constructEvent: jest.fn(),
      },
    };

    return { service, prisma, settlementsService };
  }

  it('creates the settlement before marking the payment as succeeded', async () => {
    const { service, prisma, settlementsService } = createService();
    prisma.payment.findUnique.mockResolvedValue(basePayment);

    await service.handleWebhook(undefined, {
      type: 'payment_intent.succeeded',
      data: { object: { id: 'pi_123' } },
    } as Stripe.Event as unknown as Record<string, unknown>);

    expect(settlementsService.create).toHaveBeenCalledWith(
      'group-1',
      'payer-1',
      {
        payerId: 'payer-1',
        receiverId: 'receiver-1',
        amountCents: '1250',
      },
      'payment:payment-1',
    );
    expect(prisma.payment.update).toHaveBeenCalledWith({
      where: { id: 'payment-1' },
      data: { status: 'succeeded' },
    });
    expect(settlementsService.create.mock.invocationCallOrder[0]).toBeLessThan(prisma.payment.update.mock.invocationCallOrder[0]);
  });

  it('skips the payment update when the payment is already succeeded but still relies on settlement idempotency', async () => {
    const { service, prisma, settlementsService } = createService();
    prisma.payment.findUnique.mockResolvedValue({
      ...basePayment,
      status: 'succeeded',
    });

    await service.handleWebhook(undefined, {
      type: 'payment_intent.succeeded',
      data: { object: { id: 'pi_123' } },
    } as Stripe.Event as unknown as Record<string, unknown>);

    expect(settlementsService.create).toHaveBeenCalledWith(
      'group-1',
      'payer-1',
      expect.any(Object),
      'payment:payment-1',
    );
    expect(prisma.payment.update).not.toHaveBeenCalled();
  });

  it('rejects webhook processing when a secret is configured but the signature is missing', async () => {
    const { service } = createService({ webhookSecret: 'whsec_test' });

    await expect(
      service.handleWebhook(undefined, {
        type: 'payment_intent.succeeded',
        data: { object: { id: 'pi_123' } },
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('validates the Stripe signature when a webhook secret is configured', async () => {
    const { service, prisma } = createService({ webhookSecret: 'whsec_test' });
    prisma.payment.findUnique.mockResolvedValue(basePayment);
    const constructEvent = (service as any).stripe.webhooks.constructEvent as jest.Mock;
    constructEvent.mockReturnValue({
      type: 'payment_intent.succeeded',
      data: { object: { id: 'pi_123' } },
    });

    await service.handleWebhook('sig_test', { id: 'evt_123' });

    expect(constructEvent).toHaveBeenCalledWith('{"id":"evt_123"}', 'sig_test', 'whsec_test');
  });
});
