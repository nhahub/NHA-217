import api from './api';
import { Product } from './product';

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: string;
  product: Product;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: string;
}

export const cartService = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data.data.cart;
  },

  addItem: async (productId: string, quantity: number) => {
    const response = await api.post('/cart', { productId, quantity });
    return response.data.data.cart;
  },

  removeItem: async (itemId: string) => {
    const response = await api.delete(`/cart/${itemId}`);
    return response.data.data.cart;
  },
};
