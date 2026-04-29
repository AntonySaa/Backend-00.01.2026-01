import { Router } from 'express';
import { getUsers, getUserById, createUser } from '../../controllers/users.controller.ts';

const router = Router();

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Listar usuarios
 *     tags: [Users v1]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *   post:
 *     summary: Crear usuario (valida name y email)
 *     tags: [Users v1]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Milan
 *               email:
 *                 type: string
 *                 example: milan@example.com
 *     responses:
 *       201:
 *         description: Usuario creado
 * /api/v1/users/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Users v1]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: No encontrado
 */
router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUserById);

export default router;
