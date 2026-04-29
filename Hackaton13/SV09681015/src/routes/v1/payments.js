const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const { asyncHandler } = require('../../middlewares/errorHandler');

const router = Router();

// Store de idempotencia en memoria (en prod usar Redis)
const idempotencyStore = new Map();

// ── Middleware idempotencia ───────────────────────────────────────────────────
const idempotencyMiddleware = (req, res, next) => {
  const key = req.headers['idempotency-key'];
  if (!key) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Header Idempotency-Key es requerido',
    });
  }

  if (idempotencyStore.has(key)) {
    const cached = idempotencyStore.get(key);
    return res
      .status(cached.status)
      .set('X-Idempotent-Replayed', 'true')
      .json(cached.body);
  }

  // Interceptar la respuesta para cachear
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    idempotencyStore.set(key, { status: res.statusCode, body });
    return originalJson(body);
  };

  next();
};

// ── Validaciones ─────────────────────────────────────────────────────────────
const validatePayment = [
  body('amount').isFloat({ min: 0.01 }).withMessage('amount debe ser mayor a 0'),
  body('currency').isIn(['USD', 'EUR', 'PEN']).withMessage('currency debe ser USD, EUR o PEN'),
  body('description').trim().notEmpty().withMessage('description es requerida'),
];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: 'Validación fallida', details: errors.array() });
  }
  next();
};

// ── POST /api/v1/payments ────────────────────────────────────────────────────
router.post(
  '/',
  idempotencyMiddleware,
  validatePayment,
  handleValidation,
  asyncHandler(async (req, res) => {
    const { amount, currency, description } = req.body;

    // Simular procesamiento de pago
    const payment = {
      id: `pay_${Date.now()}`,
      amount,
      currency,
      description,
      status: 'completed',
      processedAt: new Date().toISOString(),
    };

    res.status(201).json(payment);
  })
);

// ── GET /api/v1/payments ─────────────────────────────────────────────────────
router.get('/', asyncHandler(async (req, res) => {
  const payments = Array.from(idempotencyStore.values())
    .map((entry) => entry.body)
    .filter((p) => p && p.id);

  res.json({ total: payments.length, payments });
}));

module.exports = router;
