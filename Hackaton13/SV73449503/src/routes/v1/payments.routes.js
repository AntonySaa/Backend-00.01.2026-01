const crypto = require('crypto');
const express = require('express');

const requireJson = require('../../middlewares/requireJson');
const requireApiKey = require('../../middlewares/requireApiKey');
const asyncHandler = require('../../middlewares/asyncHandler');
const {
  getSavedResponse,
  saveResponse,
  isSamePayload
} = require('../../services/idempotencyService');

const router = express.Router();

router.post(
  '/',
  requireApiKey,
  requireJson,
  asyncHandler(async (req, res) => {
    const idempotencyKey = req.header('Idempotency-Key');

    if (!idempotencyKey) {
      return res.status(400).json({ error: 'Idempotency-Key header is required' });
    }

    const { amount, currency } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'amount must be greater than 0' });
    }

    if (!currency || typeof currency !== 'string') {
      return res.status(400).json({ error: 'currency is required' });
    }

    const saved = getSavedResponse(idempotencyKey);

    if (saved) {
      if (!isSamePayload(saved, req.body)) {
        return res.status(409).json({ error: 'Idempotency-Key already used with different payload' });
      }

      return res.json(saved.response);
    }

    const paymentResponse = {
      paymentId: crypto.randomUUID(),
      status: 'processed',
      amount: Number(amount),
      currency: currency.toUpperCase(),
      createdAt: new Date().toISOString()
    };

    saveResponse(idempotencyKey, req.body, paymentResponse);

    return res.status(201).json(paymentResponse);
  })
);

module.exports = router;
