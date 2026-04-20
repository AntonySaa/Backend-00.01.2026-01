import type { Request, Response, NextFunction } from 'express';

const API_KEY = process.env['API_KEY'] ?? 'api-key-demo';

export const apiKey = (req: Request, res: Response, next: NextFunction): void => {
  if (req.headers['x-api-key'] !== API_KEY) {
    res.status(403).json({
      status: 'error',
      code: 'INVALID_API_KEY',
      message: 'x-api-key invalida o ausente',
    });
    return;
  }
  next();
};

export default apiKey;
