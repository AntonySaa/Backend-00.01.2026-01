export interface IUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface IOrderItem {
  product: string;
  qty?: number;
  price?: number;
  [key: string]: unknown;
}

export interface IOrder {
  id: string;
  customerId: string;
  items: IOrderItem[];
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  createdAt: string;
}

export interface IPayment {
  id: string;
  amount: number;
  currency: string;
  description?: string;
  status: 'processed';
  processedAt: string;
}

export interface IIdempotencyResult {
  status: string;
  data: IPayment;
}
