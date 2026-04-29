const express = require('express');
const router = express.Router();

// Memoria temporal para guardar los pagos procesados
const processedPayments = new Map();

// POST /api/v1/payments
router.post('/', (req, res) => {
    const idempotencyKey = req.headers['idempotency-key'];

    if (!idempotencyKey) {
        return res.status(400).json({ error: 'El header Idempotency-Key es obligatorio' });
    }

    // 1. Si la llave ya existe, devolvemos la respuesta guardada (IDEMPOTENCIA)
    if (processedPayments.has(idempotencyKey)) {
        return res.status(200).json({
            ...processedPayments.get(idempotencyKey),
            cached: true // Indicador para saber que es repetido
        });
    }

    // 2. Si es nueva, "procesamos" el pago
    const { amount } = req.body;
    const newPayment = {
        transactionId: `TXN-${Date.now()}`,
        amount: amount || 0,
        status: 'success'
    };

    // Guardamos la respuesta asociada a esa llave
    processedPayments.set(idempotencyKey, newPayment);

    res.status(201).json(newPayment);
});

module.exports = router;