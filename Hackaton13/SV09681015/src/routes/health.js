const { Router } = require('express');
const router = Router();

// GET /api/health
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: `${Math.round(process.uptime())}s`,
  });
});

module.exports = router;
