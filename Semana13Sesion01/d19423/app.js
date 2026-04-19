require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');

const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit'  );


const logger = require('./middlewares/logger');
const error = require('./middlewares/errorHandler')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');

var app = express();

// view engine setup
console.log(__dirname)
console.log(path.join(__dirname, 'views'))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(compression());
app.use(cors({
  origin: process.env.ORIGINS,
  methods: ["GET","POST"]
}))
app.use(helmet())
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);
//app.use(logger);
app.use(error);

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
