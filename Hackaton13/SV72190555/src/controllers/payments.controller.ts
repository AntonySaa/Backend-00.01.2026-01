import type { Request, Response, NextFunction } from 'express';
import { store } from '../utils/store.ts';
import { appError } from '../middlewares/errorHandler.ts';
import { v4 as uuidv4 } from 'uuid';
import type { IPayment } from '../interface/IStore.ts';

export const createPayment = (req: Request, res: Response, next: NextFunction): void => {
  const key = req.headers['idempotency-key'] as string | undefined;
  if (!key) return void next(appError(400, 'MISSING_IDEMPOTENCY_KEY', 'Header Idempotency-Key requerido'));

  const cached = store.idempotency.get(key);
  if (cached) {
    res.status(200).json({ ...cached, _idempotent: true });
    return;
  }

  const { amount, currency = 'USD', description } = req.body as { amount?: number; currency?: string; description?: string };
  if (!amount || typeof amount !== 'number')
    return void next(appError(400, 'VALIDATION_ERROR', 'amount: numero requerido'));

  const payment: IPayment = {
    id: uuidv4(),
    amount,
    currency,
    description,
    status: 'processed',
    processedAt: new Date().toISOString(),
  };

  store.idempotency.set(key, { status: 'ok', data: payment });
  res.status(201).json({ status: 'ok', data: payment });
};
