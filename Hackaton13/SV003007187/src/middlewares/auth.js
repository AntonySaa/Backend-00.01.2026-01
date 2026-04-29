const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-token'];
    if (apiKey !== 'secret') {
        return res.status(401).json({ error: 'x-token inválido o faltante' });
    }
    next();
};

module.exports = { validateApiKey };