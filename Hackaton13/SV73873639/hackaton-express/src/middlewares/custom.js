// Middleware logger condicional (SOLO POST y PUT)
const logger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        // BONUS: Condicional para filtrar los métodos
        if (['POST', 'PUT'].includes(req.method)) {
            const duration = Date.now() - start;
            console.log(`[BONUS LOGGER] ${req.method} ${req.originalUrl} - ${duration}ms`);
        }
    });
    next();
};

const requireJson = (req, res, next) => {
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        if (!req.is('application/json')) {
            return res.status(415).json({ 
                error: 'Unsupported Media Type: Content-Type must be application/json' 
            });
        }
    }
    next();
};

module.exports = { logger, requireJson };