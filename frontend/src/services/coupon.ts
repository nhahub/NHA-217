import api from './api';

export interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}

export const couponService = {
  getAll: async () => {
    const response = await api.get('/coupons');
    return response.data.data.coupons;
  },

  create: async (data: Partial<Coupon>) => {
    const response = await api.post('/coupons', data);
    return response.data.data.coupon;
  },

  delete: async (id: string) => {
    await api.delete(`/coupons/${id}`);
  },

  toggleStatus: async (id: string) => {
    const response = await api.patch(`/coupons/${id}/status`);
    return response.data.data.coupon;
  },

  validate: async (code: string, total: number) => {
    const response = await api.post('/coupons/validate', { code, total });
    return response.data.data;
  },
};
