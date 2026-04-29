const verifyToken = (req, res, next) => {
    const token = req.headers['x-token'];
    if (!token || token !== 'secret') {
        return res.status(401).json({ error: 'No autorizado. x-token inválido o faltante.' });
    }
    next();
};

// BONUS: Autenticación con API Key
const verifyApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    // Definimos nuestra llave secreta para la Hackatón
    if (!apiKey || apiKey !== 'idat-super-key') {
        return res.status(403).json({ error: 'Acceso Denegado. x-api-key inválida.' });
    }
    next();
};

module.exports = { verifyToken, verifyApiKey }; // Exportamos ambas