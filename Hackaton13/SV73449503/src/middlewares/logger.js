module.exports = function logger(req, res, next) {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1e6;
    console.log(`[logger] ${req.method} ${req.originalUrl} - ${durationMs.toFixed(2)} ms`);
  });

  next();
};
