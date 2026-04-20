import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import type { Request, Response } from 'express';
import router from './routes/index.ts';
import { errorHandler } from './middlewares/errorHandler.ts';
import { logger } from './middlewares/logger.ts';
import { metricsMiddleware } from './middlewares/metrics.ts';
import { requireJson } from './middlewares/requireJson.ts';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.ts';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('dev'));  // activado (estaba comentado)

// Rate limit
const limiter = rateLimit({
  windowMs: Number(process.env['RATE_LIMIT_WINDOW_MS']) || 15 * 60 * 1000,
  max: Number(process.env['RATE_LIMIT_MAX']) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    code: 'RATE_LIMIT',
    message: 'Demasiadas solicitudes, intenta más tarde',
  },
});

app.use('/api', limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// MIDDLEWARES
app.use(logger);
app.use(metricsMiddleware);

// requireJson solo en rutas versionadas (no afecta multipart/form-data ni rutas originales)
app.use(/^\/api\/v1\/(?!uploads)/, requireJson);

app.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// SWAGGER
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Hackatón 13 Express Pro API',
    customCss: '.swagger-ui .topbar { background-color: #2c3e50; }',
  }),
);

// ROUTES (todas en router, incluyendo las nuevas)
app.use('/api/', router);

// ERROR HANDLER GLOBAL
app.use(errorHandler);

export default app;
