const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Importamos tus middlewares
const { logger, requireJson } = require('./middlewares/custom');
const errorHandler = require('./middlewares/errorHandler');
const { verifyApiKey } = require('./middlewares/auth'); // <-- BONUS: Importamos el validador de API Key

// ---> 1. IMPORTA TUS RUTAS AQUÍ <---
const usersRouter = require('./routes/users');
const ordersRouter = require('./routes/orders');
const uploadsRouter = require('./routes/uploads');
const paymentsRouter = require('./routes/payments');

const app = express();

// --- MIDDLEWARES GLOBALES (Seguridad y Optimización) ---
app.use(helmet({ contentSecurityPolicy: false })); // <-- Ajustado para evitar bloqueos en Swagger
app.use(cors());
app.use(compression());
app.use(morgan('dev'));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use(limiter);

app.use(express.json());
app.use(logger);
app.use(requireJson);

// --- SISTEMA DE MÉTRICAS BÁSICO (Fase 3) ---
const metrics = {
    requests: 0,
    routes: {}
};

app.use((req, res, next) => {
    metrics.requests++;
    const route = req.path;
    metrics.routes[route] = (metrics.routes[route] || 0) + 1;
    next();
});

// --- SWAGGER DOCS (Fase 3) ---
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/openapi.yaml');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- RUTAS BASE Y MÉTRICAS ---
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// BONUS: Protegemos esta ruta con el API Key
app.post('/api/data', verifyApiKey, (req, res) => res.json({ received: true }));

app.get('/api/metrics', (req, res) => res.json(metrics)); 

// BONUS: Endpoint SSE (Server-Sent Events)
app.get('/api/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let ticks = 0;
    const intervalId = setInterval(() => {
        ticks++;
        res.write(`data: {"tick": ${ticks}, "mensaje": "Transmitiendo en vivo"}\n\n`);

        if (ticks >= 5) {
            clearInterval(intervalId);
            res.write(`data: {"mensaje": "Transmisión finalizada"}\n\n`);
            res.end();
        }
    }, 1000);
});

// ---> 2. CONECTA TUS RUTAS AQUÍ <---
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/uploads', uploadsRouter);
app.use('/api/v1/payments', paymentsRouter);

// Manejador de errores SIEMPRE al final
app.use(errorHandler);

module.exports = app;