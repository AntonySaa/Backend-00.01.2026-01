const { Router } = require('express');
const router = Router();

// POST /api/data  (requireJson aplicado en app.js)
router.post('/data', (req, res) => {
  res.status(200).json({
    received: true,
    data: req.body,
  });
});

module.exports = router;
