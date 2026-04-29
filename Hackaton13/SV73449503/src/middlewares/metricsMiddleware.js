const { trackMetric } = require('../services/metricsService');

module.exports = function metricsMiddleware(req, res, next) {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1e6;
    const routePath = req.baseUrl && req.route
      ? `${req.baseUrl}${req.route.path}`
      : req.originalUrl.split('?')[0];

    trackMetric({
      method: req.method,
      path: routePath,
      statusCode: res.statusCode,
      durationMs
    });
  });

  next();
};
