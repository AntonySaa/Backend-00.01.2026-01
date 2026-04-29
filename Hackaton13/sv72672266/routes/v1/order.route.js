const router = require('express').Router();
const { dtoCreateOrder } = require('../../middlewares/validateOrder');
const { validateAuth } = require('../../middlewares/validateAuth');
const { async: asyncHandler } = require('../../middlewares');
const multer = require('multer');
const controller = require('../../controllers/order.controller');

const upload = multer({
    dest: 'uploads',
    limits: {
        fileSize: 2 * 1024 * 1024,
        files: 1
    }
})

router.post('/envio-captura', upload.single('captura'), (req, res) => {
    res.json({
        originalName: req.file.originalname,
        storedAt: req.file.filename,
        size: req.file.size
    })
})

const imgOnly = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error("Only images allowed"));
    cb(null, true);
}

const uploadImage = multer({
    dest: 'uploads',
    fileFilter: imgOnly
});

router.post('/avatar', uploadImage.single('avatar'), (req, res) => {
    res.json({
        originalName: req.file.originalname,
        storedAt: req.file.filename,
        size: req.file.size
    })
})

const cryptoRandom = () => {
    return Math.random().toString(36).slice(2);
}

const seen = new Map();

router.post('/payment', (req, res) => {
    const key = req.headers['idempotency-key'];
    if (!key) return res.status(400).json({ error: "header required" });
    if (seen.has(key)) return res.status(200).json(seen.get(key));
    const result = { paymentID: cryptoRandom(), status: 'ok' };
    seen.set(key, result);
    res.status(201).json(result);
})

router.use('/', validateAuth);

router.get('/', asyncHandler(controller.listOrders));
router.post('/', [dtoCreateOrder], asyncHandler(controller.createOrder));
router.get('/export', asyncHandler(controller.exportCSV));

module.exports = router;
