const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const apiRouter = require('./routes');
const logger = require('./middlewares/logger');
const conditionalMethodLogger = require('./middlewares/conditionalMethodLogger');
const metricsMiddleware = require('./middlewares/metricsMiddleware');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

const swaggerDocPath = path.join(__dirname, '..', 'docs', 'openapi.yaml');
const swaggerDocument = YAML.load(swaggerDocPath);

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('dev'));
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);
app.use(conditionalMethodLogger);
app.use(metricsMiddleware);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', apiRouter);

app.use((req, res, next) => {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  err.status = 404;
  next(err);
});

app.use(errorHandler);

module.exports = app;
