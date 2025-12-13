import api from './api';

export interface Category {
  id: string;
  name: string;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data.data.categories;
  },

  getById: async (id: string): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data.data.category;
  },

  create: async (data: { name: string }): Promise<Category> => {
    const response = await api.post('/categories', data);
    return response.data.data.category;
  },

  update: async (id: string, data: { name?: string }): Promise<Category> => {
    const response = await api.patch(`/categories/${id}`, data);
    return response.data.data.category;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};
