import type { Request, Response, NextFunction } from 'express';
import { store } from '../utils/store.ts';
import { appError } from '../middlewares/errorHandler.ts';
import type { IOrderItem } from '../interface/IStore.ts';

export const getOrders = (req: Request, res: Response): void => {
  const page = Number(req.query['page'] ?? 1);
  const limit = Number(req.query['limit'] ?? 10);
  const sort = String(req.query['sort'] ?? 'desc');
  res.json({ status: 'ok', ...store.orders.findAll({ page, limit, sort }) });
};

export const createOrder = (req: Request, res: Response, next: NextFunction): void => {
  const { items, customerId } = req.body as { items?: IOrderItem[]; customerId?: string };
  const errors: string[] = [];

  if (!items || !Array.isArray(items) || items.length === 0)
    errors.push('items: array no vacio requerido');
  if (!customerId || typeof customerId !== 'string')
    errors.push('customerId: string requerido');
  if (errors.length) {
    res.status(400).json({ status: 'error', code: 'VALIDATION_ERROR', errors });
    return;
  }

  if (!store.users.findById(customerId!))
    return void next(appError(404, 'NOT_FOUND', 'customerId no encontrado'));

  const order = store.orders.create({ items: items!, customerId: customerId! });
  res.status(201).json({ status: 'ok', data: order });
};

export const exportOrders = (_req: Request, res: Response): void => {
  const { data } = store.orders.findAll({ page: 1, limit: 99999 });
  const header = 'id,customerId,status,createdAt\n';
  const rows = data.map(o => `${o.id},${o.customerId},${o.status},${o.createdAt}`).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=orders.csv');
  res.send(header + rows);
};
