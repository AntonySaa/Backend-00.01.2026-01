/**
 * Middleware logger: muestra método, ruta y duración de cada request.
 */
const loggerMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const color =
      status >= 500 ? '\x1b[31m' :   // rojo
      status >= 400 ? '\x1b[33m' :   // amarillo
      status >= 300 ? '\x1b[36m' :   // cyan
                      '\x1b[32m';    // verde
    const reset = '\x1b[0m';

    console.log(
      `${color}[LOGGER]${reset} ${req.method} ${req.originalUrl} → ${color}${status}${reset} (${duration}ms)`
    );
  });

  next();
};

module.exports = { loggerMiddleware };
