import type { Request, Response, NextFunction } from 'express';
import { appError } from '../middlewares/errorHandler.ts';

export const uploadAvatarPublic = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.file) return void next(appError(400, 'FILE_REQUIRED', 'Se requiere una imagen'));
  const avatarUrl = `/uploads/${req.file.filename}`;
  res.status(201).json({
    status: 'ok',
    message: 'Avatar subido correctamente',
    file: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: avatarUrl,
    },
  });
};
