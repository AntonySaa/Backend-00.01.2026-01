const { Router } = require('express');
const { body, query, validationResult } = require('express-validator');
const { asyncHandler } = require('../../middlewares/errorHandler');

const router = Router();

// ── Auth middleware x-token ─────────────────────────────────────────────────
const requireToken = (req, res, next) => {
  const token = req.headers['x-token'];
  if (!token || token !== 'secret') {
    return res.status(401).json({ error: 'Unauthorized', message: 'Header x-token requerido' });
  }
  next();
};

router.use(requireToken);

// Base de datos en memoria
let orders = [
  { id: '1', customerId: 'c1', items: ['laptop', 'mouse'], status: 'pending', total: 1200, createdAt: '2024-01-10' },
  { id: '2', customerId: 'c2', items: ['keyboard'], status: 'delivered', total: 80, createdAt: '2024-01-12' },
  { id: '3', customerId: 'c1', items: ['monitor', 'cable'], status: 'shipped', total: 350, createdAt: '2024-01-15' },
];

// ── Validaciones ─────────────────────────────────────────────────────────────
const validateOrder = [
  body('items').isArray({ min: 1 }).withMessage('items debe ser un array con al menos 1 elemento'),
  body('customerId').trim().notEmpty().withMessage('customerId es requerido'),
];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: 'Validación fallida', details: errors.array() });
  }
  next();
};

// ── GET /api/v1/orders (paginación, filtro, orden) ───────────────────────────
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('status').optional().isIn(['pending', 'shipped', 'delivered']),
    query('sort').optional().isIn(['asc', 'desc']),
  ],
  handleValidation,
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, status, sort = 'desc', customerId } = req.query;

    let result = [...orders];

    // Filtros
    if (status) result = result.filter((o) => o.status === status);
    if (customerId) result = result.filter((o) => o.customerId === customerId);

    // Orden
    result.sort((a, b) =>
      sort === 'asc'
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Paginación
    const total = result.length;
    const start = (page - 1) * limit;
    const paginated = result.slice(start, start + limit);

    res.json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      orders: paginated,
    });
  })
);

// ── GET /api/v1/orders/export (CSV streaming) ────────────────────────────────
router.get('/export', asyncHandler(async (req, res) => {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="orders.csv"');

  // Header CSV
  res.write('id,customerId,items,status,total,createdAt\n');

  // Streaming fila por fila
  for (const order of orders) {
    const row = [
      order.id,
      order.customerId,
      `"${order.items.join(';')}"`,
      order.status,
      order.total,
      order.createdAt,
    ].join(',');
    res.write(row + '\n');
  }

  res.end();
}));

// ── POST /api/v1/orders ──────────────────────────────────────────────────────
router.post(
  '/',
  validateOrder,
  handleValidation,
  asyncHandler(async (req, res) => {
    const { items, customerId } = req.body;
    const newOrder = {
      id: String(Date.now()),
      customerId,
      items,
      status: 'pending',
      total: items.length * 10, // precio mock
      createdAt: new Date().toISOString().split('T')[0],
    };
    orders.push(newOrder);
    res.status(201).json(newOrder);
  })
);

module.exports = router;
