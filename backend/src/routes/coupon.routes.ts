import express from 'express';
import * as couponController from '../controllers/coupon.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = express.Router();

// Public route for validation
router.post('/validate', couponController.validateCoupon);

// Admin routes
router.use(protect);
router.use(restrictTo('ADMIN'));

router.route('/')
  .get(couponController.getCoupons)
  .post(couponController.createCoupon);

router.route('/:id')
  .delete(couponController.deleteCoupon);

router.patch('/:id/status', couponController.toggleStatus);

export default router;
