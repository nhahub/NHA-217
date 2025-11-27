import { get, post, del } from '../utils/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const FILE_BASE_URL = API_BASE_URL.replace(/\/api$/, '');

const resolveImage = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${FILE_BASE_URL}${imagePath}`;
};

const normalizeWishlistItem = (product) => ({
  id: product._id || product.id,
  _id: product._id || product.id,
  name: product.name,
  price: product.price || 0,
  image: resolveImage(product.image || product.images?.[0]),
  images: (product.images || []).map(resolveImage),
  stock: product.stock,
  category: product.category,
  description: product.description,
});

export const fetchWishlist = async () => {
  const response = await get('/wishlist');

  if (response.success) {
    return (response.data || []).map(normalizeWishlistItem);
  }

  return [];
};

export const addWishlistItem = async (productId) => {
  const response = await post('/wishlist', { productId });

  if (response.success) {
    return (response.data || []).map(normalizeWishlistItem);
  }

  throw new Error(response.message || 'Failed to update wishlist');
};

export const removeWishlistItem = async (productId) => {
  const response = await del(`/wishlist/${productId}`);

  if (response.success) {
    return (response.data || []).map(normalizeWishlistItem);
  }

  throw new Error(response.message || 'Failed to remove wishlist item');
};

export const syncWishlistItems = async (productIds = []) => {
  const response = await post('/wishlist/sync', { productIds });

  if (response.success) {
    return (response.data || []).map(normalizeWishlistItem);
  }

  throw new Error(response.message || 'Failed to sync wishlist');
};


