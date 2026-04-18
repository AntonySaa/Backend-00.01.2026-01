module.exports = function requireJson(req, res, next) {
  const methodsWithBody = ['POST', 'PUT', 'PATCH'];

  if (!methodsWithBody.includes(req.method)) {
    return next();
  }

  if (!req.is('application/json')) {
    return res.status(415).json({
      error: 'Content-Type must be application/json'
    });
  }

  return next();
};
