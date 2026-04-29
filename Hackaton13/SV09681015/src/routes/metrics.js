const { Router } = require('express');
const { getMetrics } = require('../middlewares/metrics');

const router = Router();

// GET /api/metrics
router.get('/metrics', (req, res) => {
  res.json(getMetrics());
});

module.exports = router;
