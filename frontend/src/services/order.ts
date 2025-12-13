import api from './api';
import { Product } from './product';

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: string;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  status: string;
  total: string;
  items: OrderItem[];
  createdAt: string;
}

export const orderService = {
  getMyOrders: async () => {
    const response = await api.get('/orders');
    return response.data.data.orders;
  },

  getOrder: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data.data.order;
  },
};
