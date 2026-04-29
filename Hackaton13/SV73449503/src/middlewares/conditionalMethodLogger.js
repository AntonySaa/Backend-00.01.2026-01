module.exports = function conditionalMethodLogger(req, res, next) {
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log(`[post-put] ${req.method} ${req.originalUrl}`);
  }
  next();
};
