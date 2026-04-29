/**
 * BONUS: Middleware condicional que solo loguea métodos POST y PUT.
 */
const conditionalLogger = (req, res, next) => {
  if (['POST', 'PUT'].includes(req.method)) {
    console.log(`\x1b[35m[CONDITIONAL]\x1b[0m ${req.method} ${req.originalUrl}`, {
      body: req.body,
      headers: {
        'content-type': req.headers['content-type'],
        'x-api-key': req.headers['x-api-key'] ? '***' : undefined,
      },
    });
  }
  next();
};

module.exports = { conditionalLogger };
