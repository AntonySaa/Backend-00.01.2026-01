import type { Request, Response, NextFunction } from 'express';

export const requireJson = (req: Request, res: Response, next: NextFunction): void => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    if (!req.is('application/json')) {
      res.status(415).json({
        status: 'error',
        code: 'INVALID_CONTENT_TYPE',
        message: 'Content-Type debe ser application/json',
      });
      return;
    }
  }
  next();
};

export default requireJson;
