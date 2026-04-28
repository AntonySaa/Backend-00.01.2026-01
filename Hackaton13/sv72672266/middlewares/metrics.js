const metrics = {
    routes: {}
};

module.exports = (req, res, next) => {
    const route = `${req.method} ${req.path}`;
    if (!metrics.routes[route]) {
        metrics.routes[route] = { count: 0, lastAccess: null };
    }
    metrics.routes[route].count++;
    metrics.routes[route].lastAccess = new Date();
    res.locals.metrics = metrics;
    next();
}

module.exports.getMetrics = () => metrics;
