require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');

const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const {
    logger,
    errorHandler,
    requireJson,
    metrics
} = require('../middlewares');

var indexRouter = require('../routes/index');

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger_output.json');

var app = express();

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use(compression());
app.use(cors({
    origin: process.env.ORIGINS || '*',
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
}))
app.use(helmet())

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use(limiter);
app.use(logger);
app.use(metrics);
app.use(requireJson);

app.use('/', indexRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(errorHandler);

module.exports = app;