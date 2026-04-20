import { Router } from 'express';

// Rutas originales del repo
import authRouter from './auth.ts';
import itemRouter from './item.ts';
import metricsRouter from './metrics.ts';
import streamRouter from './stream.ts';

// Rutas nuevas (Hackathon README)
import healthRouter from './health.ts';
import usersV1Router from './v1/users.ts';
import ordersV1Router from './v1/orders.ts';
import uploadsV1Router from './v1/uploads.ts';
import paymentsV1Router from './v1/payments.ts';

const router = Router();

// ── Rutas originales ────────────────────────────────────────
router.use('/auth', authRouter);
router.use('/item', itemRouter);
router.use('/metrics', metricsRouter);
router.use('/stream', streamRouter);

// ── Rutas nuevas (Fase 1) ───────────────────────────────────
router.use('/', healthRouter);          // GET /api/health  POST /api/data

// ── Rutas nuevas (Fase 2 + 3) ──────────────────────────────
router.use('/v1/users', usersV1Router);
router.use('/v1/orders', ordersV1Router);
router.use('/v1/uploads', uploadsV1Router);
router.use('/v1/payments', paymentsV1Router);

export default router;
