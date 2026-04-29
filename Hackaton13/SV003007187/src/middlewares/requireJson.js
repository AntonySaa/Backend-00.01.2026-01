const requireJson = (req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        if (!req.is('application/json')) {
            return res.status(415).json({ error: 'Content-Type debe ser application/json' });
        }
    }
    next();
};

module.exports = requireJson;