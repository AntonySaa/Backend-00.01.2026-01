const express = require('express');
const router = express.Router();
const { validateApiKey } = require('../../middlewares/auth');

router.use(validateApiKey);

let orders = [
    { id: 1, items: ['producto1'], customerId: 101 },
    { id: 2, items: ['producto2'], customerId: 102 }
];

router.get('/', (req, res) => {
    let { page = 1, limit = 10, sort = 'id', filter = '' } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    
    let result = [...orders];
    if (filter) {
        result = result.filter(o => o.customerId == filter);
    }
    if (sort === 'id') {
        result.sort((a, b) => a.id - b.id);
    }
    const start = (page - 1) * limit;
    const end = start + limit;
    result = result.slice(start, end);
    
    res.json({ page, limit, total: orders.length, data: result });
});

router.post('/', (req, res) => {
    const { items, customerId } = req.body;
    if (!items || !customerId) {
        return res.status(400).json({ error: 'items y customerId son requeridos' });
    }
    const newOrder = { id: orders.length + 1, items, customerId };
    orders.push(newOrder);
    res.status(201).json(newOrder);
});

router.get('/export', (req, res) => {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=orders.csv');
    let csv = 'id,items,customerId\n';
    orders.forEach(o => {
        csv += `${o.id},"${o.items.join(';')}",${o.customerId}\n`;
    });
    res.send(csv);
});

module.exports = router;