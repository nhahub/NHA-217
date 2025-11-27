import { get, put, del } from '../utils/api';

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async () => {
  const response = await get('/admin/stats');

  if (response.success && response.data) {
    return response.data;
  }

  throw new Error(response.message || 'Failed to load dashboard stats');
};

/**
 * Get all users with pagination and filters
 */
export const getAllUsers = async (params = {}) => {
  const response = await get('/admin/users', params);

  if (response.success) {
    return {
      users: response.data || [],
      count: response.count || 0,
      total: response.total || 0,
      page: response.page || 1,
      pages: response.pages || 1,
    };
  }

  throw new Error(response.message || 'Failed to load users');
};

/**
 * Update user status (activate/deactivate)
 */
export const updateUserStatus = async (userId, isActive) => {
  const response = await put(`/admin/users/${userId}/status`, { isActive });

  if (response.success && response.data) {
    return {
      id: response.data._id || response.data.id,
      ...response.data,
    };
  }

  throw new Error(response.message || 'Failed to update user status');
};

/**
 * Delete a user
 */
export const deleteUser = async (userId) => {
  const response = await del(`/admin/users/${userId}`);

  if (response.success) {
    return true;
  }

  throw new Error(response.message || 'Failed to delete user');
};

/**
 * Get all orders with pagination and filters
 */
export const getAllOrders = async (params = {}) => {
  const response = await get('/admin/orders', params);

  if (response.success) {
    return {
      orders: response.data || [],
      count: response.count || 0,
      total: response.total || 0,
      page: response.page || 1,
      pages: response.pages || 1,
    };
  }

  throw new Error(response.message || 'Failed to load orders');
};

/**
 * Update order status
 */
export const updateOrderStatus = async (orderId, status, note) => {
  const response = await put(`/admin/orders/${orderId}/status`, { 
    status,
    note: note || `Status updated to ${status}`,
  });

  if (response.success && response.data) {
    return {
      id: response.data._id || response.data.id,
      ...response.data,
    };
  }

  throw new Error(response.message || 'Failed to update order status');
};

/**
 * Get single order details (Admin)
 */
export const getAdminOrderById = async (orderId) => {
  const response = await get(`/admin/orders/${orderId}`);

  if (response.success && response.data) {
    return response.data;
  }

  throw new Error(response.message || 'Failed to load order details');
};

/**
 * Get all products for admin (with inactive products)
 */
export const getAllProducts = async (params = {}) => {
  const response = await get('/products', params);

  if (response.success && response.data) {
    const products = response.data.products || response.data;
    return products.map(product => ({
      id: product._id,
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images && product.images.length > 0 
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.images[0]}`
        : '/api/placeholder/300/300',
      images: product.images || [],
      category: product.category,
      description: product.description,
      stock: product.stock,
      inStock: product.stock > 0,
      isActive: product.isActive !== false,
      isNew: product.isNew || false,
      isFeatured: product.isFeatured || false,
      createdAt: product.createdAt,
    }));
  }

  return [];
};

/**
 * Create a new product (Admin only)
 */
export const createProduct = async (productData) => {
  const { post } = await import('../utils/api');
  const response = await post('/products', productData);

  if (response.success && response.data) {
    return response.data;
  }

  throw new Error(response.message || 'Failed to create product');
};

/**
 * Update a product (Admin only)
 */
export const updateProduct = async (productId, productData) => {
  const { put } = await import('../utils/api');
  const response = await put(`/products/${productId}`, productData);

  if (response.success && response.data) {
    return response.data;
  }

  throw new Error(response.message || 'Failed to update product');
};

/**
 * Delete a product (Admin only)
 */
export const deleteProduct = async (productId) => {
  const response = await del(`/products/${productId}`);

  if (response.success) {
    return true;
  }

  throw new Error(response.message || 'Failed to delete product');
};

/**
 * Upload product images (Admin only)
 */
export const uploadProductImages = async (imageFiles) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const user = localStorage.getItem('user');
  let token = null;
  
  if (user) {
    try {
      const userData = JSON.parse(user);
      token = userData.token;
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }

  const formData = new FormData();
  
  // Append all image files
  imageFiles.forEach((file) => {
    formData.append('images', file);
  });

  const response = await fetch(`${API_BASE_URL}/upload/product`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to upload images');
  }

  if (data.success && data.data) {
    return data.data;
  }

  throw new Error(data.message || 'Failed to upload images');
};
