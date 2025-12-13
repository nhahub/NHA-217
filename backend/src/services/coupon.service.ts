import prisma from '../utils/prisma';
import { AppError } from '../middlewares/error.middleware';

export const createCoupon = async (data: any) => {
  const existing = await prisma.coupon.findUnique({
    where: { code: data.code },
  });

  if (existing) {
    throw new AppError('Coupon code already exists', 400);
  }

  return await prisma.coupon.create({
    data: {
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    },
  });
};

export const getCoupons = async () => {
  return await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const deleteCoupon = async (id: string) => {
  return await prisma.coupon.delete({
    where: { id },
  });
};

export const toggleCouponStatus = async (id: string) => {
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) throw new AppError('Coupon not found', 404);

  return await prisma.coupon.update({
    where: { id },
    data: { isActive: !coupon.isActive },
  });
};

export const validateCoupon = async (code: string, orderTotal: number) => {
  const coupon = await prisma.coupon.findUnique({
    where: { code },
  });

  if (!coupon) {
    throw new AppError('Invalid coupon code', 404);
  }

  if (!coupon.isActive) {
    throw new AppError('Coupon is inactive', 400);
  }

  const now = new Date();
  if (now < coupon.startDate || now > coupon.endDate) {
    throw new AppError('Coupon is expired', 400);
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new AppError('Coupon usage limit reached', 400);
  }

  if (coupon.minOrderValue && orderTotal < Number(coupon.minOrderValue)) {
    throw new AppError(`Minimum order value of $${coupon.minOrderValue} required`, 400);
  }

  // Calculate discount
  let discountAmount = 0;
  if (coupon.discountType === 'PERCENTAGE') {
    discountAmount = (orderTotal * Number(coupon.discountValue)) / 100;
    if (coupon.maxDiscount && discountAmount > Number(coupon.maxDiscount)) {
      discountAmount = Number(coupon.maxDiscount);
    }
  } else {
    discountAmount = Number(coupon.discountValue);
  }

  return {
    coupon,
    discountAmount,
    finalTotal: orderTotal - discountAmount,
  };
};
