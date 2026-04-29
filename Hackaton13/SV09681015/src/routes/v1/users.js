const { Router } = require('express');
const { body, param, validationResult } = require('express-validator');
const { asyncHandler } = require('../../middlewares/errorHandler');

const router = Router();

// Base de datos en memoria
let users = [
  { id: '1', name: 'Juan Perez', email: 'juan@example.com', createdAt: new Date().toISOString() },
  { id: '2', name: 'Pedro Tinoco', email: 'pedro@example.com', createdAt: new Date().toISOString() },
];

// ── Validaciones ────────────────────────────────────────────────────────────
const validateUser = [
  body('name')
    .trim()
    .notEmpty().withMessage('name es requerido')
    .isLength({ min: 2, max: 100 }).withMessage('name debe tener entre 2 y 100 caracteres'),
  body('email')
    .trim()
    .notEmpty().withMessage('email es requerido')
    .isEmail().withMessage('email inválido')
    .normalizeEmail(),
];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: 'Validación fallida', details: errors.array() });
  }
  next();
};

// ── GET /api/v1/users ───────────────────────────────────────────────────────
router.get('/', asyncHandler(async (req, res) => {
  res.json({ total: users.length, users });
}));

// ── POST /api/v1/users ──────────────────────────────────────────────────────
router.post(
  '/',
  validateUser,
  handleValidation,
  asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    if (users.find((u) => u.email === email)) {
      return res.status(409).json({ error: 'Conflict', message: 'Email ya registrado' });
    }

    const newUser = {
      id: String(Date.now()),
      name,
      email,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    res.status(201).json(newUser);
  })
);

// ── GET /api/v1/users/:id ───────────────────────────────────────────────────
router.get(
  '/:id',
  [param('id').notEmpty().withMessage('id es requerido')],
  handleValidation,
  asyncHandler(async (req, res) => {
    const user = users.find((u) => u.id === req.params.id);
    if (!user) {
      const err = new Error('Usuario no encontrado');
      err.statusCode = 404;
      throw err;
    }
    res.json(user);
  })
);

module.exports = router;
