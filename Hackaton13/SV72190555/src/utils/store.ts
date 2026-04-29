import { v4 as uuidv4 } from 'uuid';
import type { IUser, IOrder, IOrderItem, IPayment, IIdempotencyResult } from '../interface/IStore.ts';

const users: IUser[] = [];
const orders: IOrder[] = [];
const idempotencyCache: Record<string, IIdempotencyResult> = {};

export const store = {
  users: {
    findAll: (): IUser[] => users,
    findById: (id: string): IUser | undefined => users.find(u => u.id === id),
    findByEmail: (email: string): IUser | undefined => users.find(u => u.email === email),
    create: (data: { name: string; email: string }): IUser => {
      const u: IUser = { id: uuidv4(), ...data, createdAt: new Date().toISOString() };
      users.push(u);
      return u;
    },
  },

  orders: {
    findAll: ({ page = 1, limit = 10, sort = 'desc' }: { page?: number; limit?: number; sort?: string } = {}) => {
      const sorted = [...orders].sort((a, b) =>
        sort === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      const start = (page - 1) * limit;
      return {
        data: sorted.slice(start, start + Number(limit)),
        total: orders.length,
        page: Number(page),
        pageSize: Number(limit),
        totalPages: Math.ceil(orders.length / limit),
      };
    },
    findById: (id: string): IOrder | undefined => orders.find(o => o.id === id),
    create: (data: { items: IOrderItem[]; customerId: string }): IOrder => {
      const o: IOrder = { id: uuidv4(), ...data, status: 'pending', createdAt: new Date().toISOString() };
      orders.push(o);
      return o;
    },
  },

  idempotency: {
    get: (key: string): IIdempotencyResult | null => idempotencyCache[key] ?? null,
    set: (key: string, val: IIdempotencyResult): IIdempotencyResult => {
      idempotencyCache[key] = val;
      return val;
    },
  },
};

export default store;
