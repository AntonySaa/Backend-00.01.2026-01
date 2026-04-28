module.exports = (err, req, res, next) => {
    console.error(err);
    const status = err.status || 500;
    
    if (req.accepts('html')) {
        res.status(status).render('error', {
            message: err.message || "Error",
            error: req.app.get('env') === 'development' ? err : {}
        });
    } else {
        res.status(status).json({
            error: err.message,
            message: err.message || "Error Interno",
            details: err.errors || undefined
        })
    }
}
