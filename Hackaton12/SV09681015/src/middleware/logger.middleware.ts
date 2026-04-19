import { Request, Response, NextFunction } from 'express';

const loggerMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip ?? req.socket.remoteAddress ?? 'unknown';

  console.log(`[${timestamp}] ${method} ${url} — IP: ${ip}`);
  next();
};

export default loggerMiddleware;
