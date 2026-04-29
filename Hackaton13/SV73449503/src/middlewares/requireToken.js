module.exports = function requireToken(req, res, next) {
  const token = req.header('x-token');

  if (token !== 'secret') {
    return res.status(401).json({ error: 'Invalid or missing x-token header' });
  }

  return next();
};
