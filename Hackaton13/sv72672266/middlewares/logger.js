module.exports = function logger(req, res, next) {
    const start = process.hrtime.bigint();
    res.on('finish', () => {
        const dur = Number(process.hrtime.bigint() - start) / 1e6;
        console.log(`${req.method} ${req.path} - ${dur.toFixed(2)}ms`);
    })
    next();
}
