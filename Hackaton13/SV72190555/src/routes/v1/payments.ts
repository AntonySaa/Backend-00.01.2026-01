import { Router } from 'express';
import { createPayment } from '../../controllers/payments.controller.ts';

const router = Router();

/**
 * @swagger
 * /api/v1/payments:
 *   post:
 *     summary: Crear pago idempotente
 *     tags: [Payments v1]
 *     parameters:
 *       - in: header
 *         name: Idempotency-Key
 *         required: true
 *         schema:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 99.99
 *               currency:
 *                 type: string
 *                 example: USD
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pago procesado
 *       200:
 *         description: Idempotente — misma respuesta (_idempotent true)
 */
router.post('/', createPayment);

export default router;
