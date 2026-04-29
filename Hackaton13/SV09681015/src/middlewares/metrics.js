/**
 * Métricas en memoria: conteo de requests por ruta y método.
 */
const metrics = {
  totalRequests: 0,
  startTime: Date.now(),
  routes: {},
};

const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  metrics.totalRequests++;

  res.on('finish', () => {
    const key = `${req.method} ${req.route?.path || req.path}`;
    const duration = Date.now() - start;

    if (!metrics.routes[key]) {
      metrics.routes[key] = { count: 0, totalMs: 0, avgMs: 0, lastStatus: null };
    }

    metrics.routes[key].count++;
    metrics.routes[key].totalMs += duration;
    metrics.routes[key].avgMs = Math.round(metrics.routes[key].totalMs / metrics.routes[key].count);
    metrics.routes[key].lastStatus = res.statusCode;
  });

  next();
};

const getMetrics = () => ({
  uptime: `${Math.round((Date.now() - metrics.startTime) / 1000)}s`,
  totalRequests: metrics.totalRequests,
  routes: metrics.routes,
});

module.exports = { metricsMiddleware, getMetrics };
