module.exports = function requireApiKey(req, res, next) {
  const expectedApiKey = process.env.API_KEY || 'hackaton-key';
  const apiKey = req.header('x-api-key');

  if (!apiKey || apiKey !== expectedApiKey) {
    return res.status(401).json({ error: 'Invalid or missing x-api-key header' });
  }

  return next();
};
