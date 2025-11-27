import { post, get } from '../utils/api';

/**
 * Register a new user
 */
export const register = async (userData) => {
  const response = await post('/auth/register', {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    phone: userData.phone,
    address: userData.address,
  });

  if (response.success && response.data) {
    return {
      id: response.data.user.id,
      _id: response.data.user.id,
      name: response.data.user.name,
      email: response.data.user.email,
      role: response.data.user.role || 'user',
      phone: response.data.user.phone,
      address: response.data.user.address,
      token: response.data.token,
    };
  }

  throw new Error(response.message || 'Registration failed');
};

/**
 * Login user
 */
export const login = async (email, password) => {
  const response = await post('/auth/login', {
    email,
    password,
  });

  if (response.success && response.data) {
    return {
      id: response.data.user.id,
      _id: response.data.user.id,
      name: response.data.user.name,
      email: response.data.user.email,
      role: response.data.user.role || 'user',
      phone: response.data.user.phone,
      address: response.data.user.address,
      token: response.data.token,
    };
  }

  throw new Error(response.message || 'Invalid email or password');
};

/**
 * Get current user
 */
export const getMe = async () => {
  const response = await get('/auth/me');

  if (response.success && response.data) {
    return {
      id: response.data._id || response.data.id,
      _id: response.data._id || response.data.id,
      name: response.data.name,
      email: response.data.email,
      role: response.data.role || 'user',
      phone: response.data.phone,
      address: response.data.address,
    };
  }

  throw new Error(response.message || 'Failed to get user');
};

/**
 * Logout user (client-side token removal)
 */
export const logout = async () => {
  try {
    await post('/auth/logout');
  } catch (error) {
    // Even if the request fails, we still want to logout on client side
    console.error('Logout error:', error);
  }
  return true;
};
