const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');

// Proteger todas las rutas de este router con el header x-token
router.use(verifyToken);

// Datos en memoria
const orders = [
    { id: 1, customerId: 101, status: 'completed', items: ['Laptop'] },
    { id: 2, customerId: 102, status: 'pending', items: ['Teclado', 'Mouse'] }
];

// GET /api/v1/orders/export -> CSV streaming 
router.get('/export', (req, res) => {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="orders.csv"');
    
    res.write('id,customerId,status\n');
    orders.forEach(order => {
        res.write(`${order.id},${order.customerId},${order.status}\n`);
    });
    
    res.end();
});

// GET /api/v1/orders -> Paginación, filtro y orden
router.get('/', (req, res) => {
    let { page = 1, limit = 10, status, sort } = req.query;
    let result = [...orders];

    if (status) result = result.filter(o => o.status === status);
    
    if (sort === 'asc') result.sort((a, b) => a.id - b.id);
    if (sort === 'desc') result.sort((a, b) => b.id - a.id);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedResults = result.slice(startIndex, endIndex);

    res.json({
        total: result.length,
        page: parseInt(page),
        limit: parseInt(limit),
        data: paginatedResults
    });
});

// POST /api/v1/orders -> Valida y crea orden
router.post('/', (req, res) => {
    const { items, customerId } = req.body;
    
    if (!items || !Array.isArray(items) || !customerId) {
        return res.status(400).json({ error: 'El campo items (como array) y customerId son requeridos' });
    }
    
    const newOrder = { id: orders.length + 1, customerId, status: 'pending', items };
    orders.push(newOrder);
    res.status(201).json(newOrder);
});

module.exports = router;