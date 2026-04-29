const express = require('express');
const router = express.Router();

// Base de datos en memoria para la Hackatón Idat
const users = [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com' }
];

// GET /api/v1/users -> Lista de usuarios
router.get('/', (req, res) => {
    res.json(users);
});

// GET /api/v1/users/:id -> Retorna usuario específico
router.get('/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
});

// POST /api/v1/users -> Valida y crea usuario
router.post('/', (req, res) => {
    const { name, email } = req.body;
    
    // Validación básica
    if (!name || !email) {
        return res.status(400).json({ error: 'El name y email son obligatorios' });
    }
    
    const newUser = { id: users.length + 1, name, email };
    users.push(newUser);
    res.status(201).json(newUser);
});

module.exports = router;