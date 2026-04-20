import type { Request, Response, NextFunction } from 'express';

export const requireToken = (req: Request, res: Response, next: NextFunction): void => {
  if (req.headers['x-token'] !== 'secret') {
    res.status(401).json({
      status: 'error',
      code: 'INVALID_TOKEN',
      message: 'x-token invalido o ausente',
    });
    return;
  }
  next();
};

export default requireToken;
