import express from 'express';
import { createIntent, webhook } from '../controllers/payment.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

// Payment intent requires authentication
router.post('/create-intent', protect, createIntent);

// Webhook needs raw body and no auth (Stripe will verify signature)
router.post('/webhook', express.raw({ type: 'application/json' }), webhook);

export default router;
