import type { Request, Response, NextFunction } from 'express';
import { store } from '../utils/store.ts';
import { appError } from '../middlewares/errorHandler.ts';

export const getUsers = (_req: Request, res: Response): void => {
  res.json({ status: 'ok', data: store.users.findAll() });
};

export const getUserById = (req: Request, res: Response, next: NextFunction): void => {
  const user = store.users.findById(req.params['id'] ?? '');
  if (!user) return void next(appError(404, 'NOT_FOUND', 'Usuario no encontrado'));
  res.json({ status: 'ok', data: user });
};

export const createUser = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email } = req.body as { name?: string; email?: string };
  const errors: string[] = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2)
    errors.push('name: minimo 2 caracteres');
  if (!email || !/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email))
    errors.push('email: formato invalido');
  if (errors.length) {
    res.status(400).json({ status: 'error', code: 'VALIDATION_ERROR', errors });
    return;
  }

  if (store.users.findByEmail(email!)) return void next(appError(409, 'EMAIL_EXISTS', 'El email ya esta registrado'));

  const user = store.users.create({ name: name!.trim(), email: email! });
  res.status(201).json({ status: 'ok', data: user });
};
