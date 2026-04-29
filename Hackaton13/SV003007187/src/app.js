 const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const logger = require('./middlewares/logger');
const requireJson = require('./middlewares/requireJson');
const errorHandler = require('./middlewares/errorHandler');

const usersRoutesV1 = require('./routes/v1/users');
const ordersRoutesV1 = require('./routes/v1/orders');

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(limiter);
app.use(logger);
app.use(express.json());
app.use(requireJson);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.post('/api/data', (req, res) => {
    res.json({ received: true, data: req.body });
});

app.use('/api/v1/users', usersRoutesV1);
app.use('/api/v1/orders', ordersRoutesV1);

app.use(errorHandler);

module.exports = app;