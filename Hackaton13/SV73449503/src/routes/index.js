const express = require('express');

const healthRouter = require('./health.routes');
const dataRouter = require('./data.routes');
const metricsRouter = require('./metrics.routes');
const streamRouter = require('./stream.routes');
const v1Router = require('./v1');

const router = express.Router();

router.use('/health', healthRouter);
router.use('/data', dataRouter);
router.use('/metrics', metricsRouter);
router.use('/stream', streamRouter);
router.use('/v1', v1Router);

module.exports = router;
