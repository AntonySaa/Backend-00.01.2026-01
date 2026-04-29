const express = require('express');

const usersRouter = require('./users.routes');
const ordersRouter = require('./orders.routes');
const uploadsRouter = require('./uploads.routes');
const paymentsRouter = require('./payments.routes');

const router = express.Router();

router.use('/users', usersRouter);
router.use('/orders', ordersRouter);
router.use('/uploads', uploadsRouter);
router.use('/payments', paymentsRouter);

module.exports = router;
