/**
 * Middleware requireJson: bloquea peticiones sin Content-Type: application/json.
 * Solo aplica a métodos con body (POST, PUT, PATCH).
 */
const requireJson = (req, res, next) => {
  const methodsWithBody = ['POST', 'PUT', 'PATCH'];

  if (methodsWithBody.includes(req.method)) {
    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('application/json')) {
      return res.status(415).json({
        error: 'Unsupported Media Type',
        message: 'El header Content-Type debe ser application/json',
      });
    }
  }

  next();
};

module.exports = { requireJson };
