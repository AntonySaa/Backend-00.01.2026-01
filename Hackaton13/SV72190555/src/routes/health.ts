import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Estado del servidor
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Servidor activo
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * @swagger
 * /api/data:
 *   post:
 *     summary: Echo de datos recibidos
 *     tags: [Health]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Datos recibidos
 */
router.post('/data', (req: Request, res: Response) => {
  res.json({ received: true, data: req.body });
});

export default router;
