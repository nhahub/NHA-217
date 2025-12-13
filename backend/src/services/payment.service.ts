import Stripe from 'stripe';
import { env } from '../config/env';
import prisma from '../utils/prisma';
import { AppError } from '../middlewares/error.middleware';

const stripe = new Stripe(env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-11-17.clover' as any, // Force type if needed, or just use the string
});

export const createPaymentIntent = async (userId: string) => {
  const cart = await prisma.order.findFirst({
    where: { userId, status: 'PENDING' },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) {
    throw new AppError('Cart is empty', 400);
  }

  const amount = Math.round(Number(cart.total) * 100); // Stripe expects cents

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    metadata: {
      orderId: cart.id,
      userId,
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    amount,
    currency: 'usd',
  };
};

export const handleWebhook = async (signature: string, payload: Buffer) => {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    throw new AppError(`Webhook Error: ${err.message}`, 400);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata.orderId;

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'PROCESSING' },
    });

    await prisma.payment.create({
      data: {
        orderId,
        amount: paymentIntent.amount / 100,
        method: 'stripe',
        status: 'succeeded',
        stripeId: paymentIntent.id,
      },
    });
  }
};
