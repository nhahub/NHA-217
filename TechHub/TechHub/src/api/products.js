import { get, post, put, del } from '../utils/api';

/**
 * Get all products with filters
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const FILE_BASE_URL = API_BASE_URL.replace(/\/api$/, '');

const resolveImage = (imagePath) => {
  if (!imagePath) {
    return null;
  }
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  return `${FILE_BASE_URL}${imagePath}`;
};

const mapProduct = (product) => {
  // Handle images - can be array of objects {url, alt} or array of strings
  const images = (product.images || []).map(img => {
    if (typeof img === 'string') {
      return resolveImage(img);
    } else if (img && img.url) {
      return resolveImage(img.url);
    }
    return null;
  }).filter(Boolean);

  return {
    id: product._id,
    _id: product._id,
    name: product.name,
    price: product.price,
    image: images[0] || null,
    images: images,
    category: product.category,
    description: product.description,
    stock: product.stock,
    inStock: product.stock > 0,
    isNew: product.isNew || false,
    isFeatured: product.isFeatured || false,
    tags: product.tags || [],
    specifications: product.specifications || {},
    createdAt: product.createdAt,
  };
};

export const getProducts = async (filters = {}) => {
  const response = await get('/products', filters);

  if (response.success) {
    // Handle different response structures
    let rawProducts = [];
    
    if (Array.isArray(response.data)) {
      // Backend returns data as array directly
      rawProducts = response.data;
    } else if (response.data?.products) {
      // Some endpoints return { data: { products: [...] } }
      rawProducts = response.data.products;
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      // Nested data structure
      rawProducts = response.data.data;
    } else if (response.products && Array.isArray(response.products)) {
      // Direct products array
      rawProducts = response.products;
    }

    const products = rawProducts.map(mapProduct);

    return {
      products,
      count: response.count ?? products.length,
      total: response.total ?? products.length,
      page: response.page ?? 1,
      pages: response.pages ?? 1,
    };
  }

  return {
    products: [],
    count: 0,
    total: 0,
    page: 1,
    pages: 1,
  };
};

/**
 * Get a single product by ID
 */
export const getProductById = async (id) => {
  const response = await get(`/products/${id}`);

  if (response.success && response.data) {
    return mapProduct(response.data);
  }

  return null;
};

/**
 * Get featured products
 */
export const getFeaturedProducts = async () => {
  const response = await get('/products/featured/list');

  if (response.success && response.data) {
    return (response.data.products || response.data).map(mapProduct);
  }

  return [];
};

/**
 * Get categories
 */
export const getCategories = async () => {
  const response = await get('/products/categories/list');

  if (response.success && response.data) {
    return response.data.categories || response.data || [];
  }

  return [];
};

/**
 * Create a new product (Admin only)
 */
export const createProduct = async (productData) => {
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
