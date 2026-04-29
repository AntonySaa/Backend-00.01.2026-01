/**
 * Middleware errorHandler global con soporte para errores async.
 * Debe registrarse al FINAL de todos los middlewares en app.js.
 */
const errorHandler = (err, req, res, next) => {
  console.error('\x1b[31m[ERROR]\x1b[0m', err.message);

  const statusCode = err.statusCode || err.status || 500;

  res.status(statusCode).json({
    error: err.name || 'Error interno',
    message: err.message || 'Ocurrió un error inesperado',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

/**
 * Wrapper para manejar errores en handlers async sin try/catch repetitivo.
 * Uso: router.get('/ruta', asyncHandler(async (req, res) => { ... }))
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { errorHandler, asyncHandler };
