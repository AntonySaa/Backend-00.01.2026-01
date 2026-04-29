const express = require('express');

const requireJson = require('../middlewares/requireJson');

const router = express.Router();

router.post('/', requireJson, (req, res) => {
  res.json({ received: true });
});

module.exports = router;
