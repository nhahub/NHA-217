import { get, put } from '../utils/api';

/**
 * Fetch the authenticated user's profile
 */
export const getProfile = async () => {
  const response = await get('/users/profile');

  if (response.success && response.data) {
    return response.data;
  }

  throw new Error(response.message || 'Failed to load profile');
};

/**
 * Update the authenticated user's profile
 */
export const updateProfile = async (profileData) => {
  const payload = {
    name: profileData.name?.trim(),
    email: profileData.email?.trim(),
    phone: profileData.phone?.trim(),
    address: profileData.address,
  };

  const response = await put('/users/profile', payload);

  if (response.success && response.data) {
    return response.data;
  }

  throw new Error(response.message || 'Failed to update profile');
};





