/*
 * BONUS: Autenticación con API Key via header x-api-key.
 */

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error('Variable de entorno API_KEY no definida. Agrégala en tu archivo .env');
}

const requireApiKey = (req, res, next) => {
  const key = req.headers['x-api-key'];
  if (!key || key !== API_KEY) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Se requiere header x-api-key válido',
    });
  }
  next();
};

module.exports = { requireApiKey };