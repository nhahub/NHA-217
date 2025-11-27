import { get, post, put } from '../utils/api';

/**
 * Get user's orders
 */
export const getUserOrders = async (params = {}) => {
  const response = await get('/orders', params);

  if (response.success) {
    const orders =
      (Array.isArray(response.data) && response.data) ||
      response.data?.orders ||
      response.data?.data ||
      [];

    return {
      orders,
      count: response.count ?? orders.length,
      total: response.total ?? orders.length,
      page: response.page ?? 1,
      pages: response.pages ?? 1,
    };
  }

  throw new Error(response.message || 'Failed to load orders');
};

/**
 * Get a single order by ID
 */
export const getOrder = async (orderId) => {
  const response = await get(`/orders/${orderId}`);

  if (response.success && response.data) {
    return response.data;
  }

  throw new Error(response.message || 'Failed to get order');
};

/**
 * Create a new order
 */
export const createOrder = async (orderData) => {
  const response = await post('/orders', {
    shippingAddress: orderData.shippingAddress,
    items: orderData.items,
    paymentMethod: orderData.paymentMethod || 'Cash on Delivery',
    note: orderData.note,
  });

  if (response.success && response.data) {
    return response.data;
  }

  throw new Error(response.message || 'Failed to create order');
};

/**
 * Cancel an order
 */
export const cancelOrder = async (orderId, reason) => {
  const response = await put(`/orders/${orderId}/cancel`, { reason });

  if (response.success && response.data) {
    return response.data;
  }

  throw new Error(response.message || 'Failed to cancel order');
};


