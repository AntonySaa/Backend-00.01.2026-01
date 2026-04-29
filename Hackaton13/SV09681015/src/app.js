const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { loggerMiddleware } = require('./middlewares/logger');
const { requireJson } = require('./middlewares/requireJson');
const { errorHandler } = require('./middlewares/errorHandler');
const { metricsMiddleware } = require('./middlewares/metrics');
const { conditionalLogger } = require('./middlewares/conditionalLogger');

const healthRouter = require('./routes/health');
const dataRouter = require('./routes/data');
const usersRouter = require('./routes/v1/users');
const ordersRouter = require('./routes/v1/orders');
const uploadsRouter = require('./routes/v1/uploads');
const paymentsRouter = require('./routes/v1/payments');
const metricsRouter = require('./routes/metrics');
const streamRouter = require('./routes/stream');
const docsRouter = require('./routes/docs');

const app = express();

// ── Seguridad & utilidades ──────────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('dev'));

// ── Rate limiting ───────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  message: { error: 'Demasiadas solicitudes, intenta más tarde.' },
});
app.use(limiter);

// ── Middlewares globales ────────────────────────────────────────────────────
app.use(metricsMiddleware);
app.use(loggerMiddleware);
app.use(conditionalLogger);

// ── Body parsers ────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Rutas base ──────────────────────────────────────────────────────────────
app.use('/api', healthRouter);
app.use('/api', requireJson, dataRouter);

// ── Rutas v1 ────────────────────────────────────────────────────────────────
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/uploads', uploadsRouter);
app.use('/api/v1/payments', paymentsRouter);

// ── Métricas, SSE y Docs ────────────────────────────────────────────────────
app.use('/api', metricsRouter);
app.use('/api', streamRouter);
app.use('/api', docsRouter);

// ── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ── Error handler global ────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
