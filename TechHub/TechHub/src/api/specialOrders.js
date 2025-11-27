import { post } from '../utils/api';

export const submitSpecialOrder = async (payload) => {
  const response = await post('/special-orders', payload);

  if (response.success) {
    return response.data;
  }

  throw new Error(response.message || 'Failed to submit special order');
};





