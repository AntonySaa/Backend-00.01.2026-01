const HttpError = require('./httpError');

module.exports = (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'DELETE' && req.method !== 'HEAD') {
        const contentType = req.get('content-type');
        if (contentType && !contentType.includes('application/json') && !contentType.includes('multipart/form-data')) {
            return next(new HttpError(400, 'Content-Type debe ser application/json o multipart/form-data'));
        }
    }
    next();
}
