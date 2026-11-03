import axios from 'axios';
import { Product, Order, Statistics } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===== Products =====
export const getProducts = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
}) => {
  const { data } = await api.get('/products', { params });
  return data;
};

export const createProduct = async (product: {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  category: string;
}) => {
  const { data } = await api.post('/products', product);
  return data;
};

export const getProductById = async (id: string) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

// ===== Orders =====
export const createOrder = async (order: {
  customerName: string;
  customerPhone?: string;
  items: { productId: string; quantity: number }[];
}) => {
  const { data } = await api.post('/orders', order);
  return data;
};

// ===== Statistics =====
export const getStatistics = async () => {
  const { data } = await api.get('/statistics');
  return data;
};

export default api;