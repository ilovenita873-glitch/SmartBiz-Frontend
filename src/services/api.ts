import axios from 'axios';
import { Statistics } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Har bir so'rovga tokenni qo'shadi
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Token yaroqsiz bo'lsa, tokenni o'chiradi
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===== Auth =====
export const login = async (email: string, password: string) => {
  const { data } = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', data.token);
  return data;
};

export const logout = () => localStorage.removeItem('token');

export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data.data;
};

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

export const deleteProduct = async (id: string) => {
  await api.delete(`/products/${id}`);
};

// ===== Orders =====
export const getOrders = async (status?: string) => {
  const { data } = await api.get('/orders', { params: { status } });
  return data;
};

export const createOrder = async (order: {
  customerName: string;
  customerPhone?: string;
  items: { productId: string; quantity: number }[];
}) => {
  const { data } = await api.post('/orders', {
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    items: order.items.map((i) => ({ product: i.productId, quantity: i.quantity })),
  });
  return data;
};

export const updateOrderStatus = async (id: string, status: string) => {
  const { data } = await api.patch(`/orders/${id}/status`, { status });
  return data;
};

// ===== Statistics =====
export const getStatistics = async (): Promise<Statistics> => {
  const [summaryRes, topRes] = await Promise.all([
    api.get('/statistics/summary'),
    api.get('/statistics/top-products'),
  ]);

  const s = summaryRes.data.data;
  const completed = s.ordersByStatus?.completed || 0;

  return {
    products: {
      total: s.totalProducts,
      active: s.activeProducts ?? s.totalProducts,
    },
    orders: { total: s.totalOrders },
    sales: {
      totalRevenue: s.totalRevenue,
      averageOrderValue: completed ? Math.round(s.totalRevenue / completed) : 0,
    },
    topProducts: topRes.data.data.map((p: any) => ({
      productId: String(p._id),
      name: p.name ?? 'Noma’lum mahsulot',
      totalSold: p.totalSold,
      totalRevenue: p.revenue,
    })),
  };
};

export default api;