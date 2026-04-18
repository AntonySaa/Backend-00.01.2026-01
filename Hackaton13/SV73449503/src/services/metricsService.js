const metrics = {
  startedAt: new Date().toISOString(),
  totalRequests: 0,
  routes: {}
};

function trackMetric({ method, path, statusCode, durationMs }) {
  const key = `${method} ${path}`;

  metrics.totalRequests += 1;

  if (!metrics.routes[key]) {
    metrics.routes[key] = {
      hits: 0,
      avgDurationMs: 0,
      lastStatusCode: statusCode
    };
  }

  const routeMetric = metrics.routes[key];
  routeMetric.hits += 1;
  routeMetric.lastStatusCode = statusCode;
  routeMetric.avgDurationMs = Number(
    ((routeMetric.avgDurationMs * (routeMetric.hits - 1) + durationMs) / routeMetric.hits).toFixed(2)
  );
}

function getMetrics() {
  return metrics;
}

module.exports = {
  trackMetric,
  getMetrics
};
