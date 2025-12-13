import { Request, Response, NextFunction } from 'express';
import { createPaymentIntent, handleWebhook } from '../services/payment.service';

const getUserId = (req: Request) => {
  const user = (req as any).user;
  if (!user || !user.id) {
    throw new Error('User not authenticated');
  }
  return user.id;
};

export const createIntent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const data = await createPaymentIntent(userId);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const webhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    await handleWebhook(signature, req.body);
    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
};
