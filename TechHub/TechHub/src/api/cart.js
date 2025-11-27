import { get, post, put, del } from '../utils/api';

/**
 * Get user's cart
 */
export const getCart = async () => {
  const response = await get('/cart');

  if (response.success && response.data) {
    return {
      items: response.data.items || [],
      total: response.data.total || 0,
      itemCount: response.data.itemCount || 0,
    };
  }

  return {
    items: [],
    total: 0,
    itemCount: 0,
  };
};

/**
 * Add item to cart
 */
export const addToCart = async (productId, quantity = 1) => {
  const response = await post('/cart/items', {
    productId,
    quantity,
  });

  if (response.success && response.data) {
    return response.data;
  }

  throw new Error(response.message || 'Failed to add item to cart');
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (productId, quantity) => {
  const response = await put(`/cart/items/${productId}`, { quantity });

  if (response.success && response.data) {
    return response.data;
  }

  throw new Error(response.message || 'Failed to update cart item');
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (productId) => {
  const response = await del(`/cart/items/${productId}`);

  if (response.success) {
    return true;
  }

  throw new Error(response.message || 'Failed to remove item from cart');
};

/**
 * Clear entire cart
 */
export const clearCart = async () => {
  const response = await del('/cart');

  if (response.success) {
    return true;
  }

  throw new Error(response.message || 'Failed to clear cart');
};


