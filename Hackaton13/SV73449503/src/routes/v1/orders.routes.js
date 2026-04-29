const express = require('express');

const orders = require('../../data/orders');
const requireJson = require('../../middlewares/requireJson');
const requireToken = require('../../middlewares/requireToken');

const router = express.Router();

router.use(requireToken);

router.get('/', (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
  const status = req.query.status;
  const sortBy = req.query.sortBy || 'createdAt';
  const order = (req.query.order || 'desc').toLowerCase();

  let result = [...orders];

  if (status) {
    result = result.filter((orderRow) => orderRow.status === status);
  }

  result.sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return order === 'asc' ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const start = (page - 1) * limit;
  const data = result.slice(start, start + limit);

  res.json({
    meta: {
      page,
      limit,
      total: result.length,
      sortBy,
      order,
      status: status || null
    },
    data
  });
});

router.post('/', requireJson, (req, res) => {
  const { items, customerId } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items must be a non-empty array' });
  }

  if (!customerId || Number.isNaN(Number(customerId))) {
    return res.status(400).json({ error: 'customerId is required and must be numeric' });
  }

  const orderRow = {
    id: orders.length + 1,
    customerId: Number(customerId),
    status: 'pending',
    items,
    total: 0,
    createdAt: new Date().toISOString()
  };

  orders.push(orderRow);

  return res.status(201).json({ data: orderRow });
});

router.get('/export', (req, res) => {
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="orders.csv"');

  res.write('id,customerId,status,total,createdAt\n');

  orders.forEach((orderRow) => {
    res.write(
      `${orderRow.id},${orderRow.customerId},${orderRow.status},${orderRow.total},${orderRow.createdAt}\n`
    );
  });

  res.end();
});

module.exports = router;
