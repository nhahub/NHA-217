import express from 'express';
import { getMyOrders, getOrder, getAll, updateStatus, createOrder } from '../controllers/order.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = express.Router();

// User routes - require authentication
router.use(protect);

router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrder);

// Admin routes - require admin role
router.get('/admin/all', restrictTo('ADMIN'), getAll);
router.patch('/admin/:id/status', restrictTo('ADMIN'), updateStatus);

export default router;
