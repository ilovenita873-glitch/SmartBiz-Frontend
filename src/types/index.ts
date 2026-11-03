export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  inStock?: boolean;
}

export interface OrderItem {
  product: string | Product;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  customerName: string;
  customerPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Statistics {
  products: {
    total: number;
    active: number;
  };
  orders: {
    total: number;
  };
  sales: {
    totalRevenue: number;
    averageOrderValue: number;
  };
  topProducts: {
    productId: string;
    name: string;
    totalSold: number;
    totalRevenue: number;
  }[];
}
