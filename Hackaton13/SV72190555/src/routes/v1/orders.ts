import { Router } from 'express';
import { requireToken } from '../../middlewares/requireToken.ts';
import { getOrders, createOrder, exportOrders } from '../../controllers/orders.controller.ts';

const router = Router();

router.use(requireToken);

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: Listar ordenes paginadas
 *     tags: [Orders v1]
 *     security:
 *       - XToken: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [asc, desc], default: desc }
 *     responses:
 *       200:
 *         description: Lista paginada
 *       401:
 *         description: x-token invalido
 *   post:
 *     summary: Crear orden
 *     tags: [Orders v1]
 *     security:
 *       - XToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items, customerId]
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *               customerId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Orden creada
 * /api/v1/orders/export:
 *   get:
 *     summary: Exportar ordenes a CSV
 *     tags: [Orders v1]
 *     security:
 *       - XToken: []
 *     responses:
 *       200:
 *         description: Archivo CSV
 */
router.get('/export', exportOrders);
router.get('/', getOrders);
router.post('/', createOrder);

export default router;
