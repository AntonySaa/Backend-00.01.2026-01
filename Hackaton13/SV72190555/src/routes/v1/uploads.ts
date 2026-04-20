import { Router } from 'express';
import { uploadAvatar } from '../../middlewares/multer.ts';
import { uploadAvatarPublic } from '../../controllers/uploadsV1.controller.ts';

const router = Router();

/**
 * @swagger
 * /api/v1/uploads/avatar:
 *   post:
 *     summary: Subir imagen de avatar (max 2MB, solo image/*)
 *     tags: [Uploads v1]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Avatar subido
 */
router.post('/avatar', uploadAvatar.single('avatar'), uploadAvatarPublic);

export default router;
