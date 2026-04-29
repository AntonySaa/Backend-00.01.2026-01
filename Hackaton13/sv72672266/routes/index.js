var router = require('express').Router();
const healthController = require('../controllers/health')
const v1Router = require('./v1');
const v2Router = require('./v2');
const { metrics } = require('../middlewares');

router.get('/', function (req, res, next) {
    res.render('index', { title: 'API Express Pro' });
});

router.get('/api/health', healthController.getHealthApi);

router.get('/api/metrics', (req, res) => {
    res.json(metrics.getMetrics());
});

router.use('/api/v1', v1Router);
router.use('/api/v2', v2Router);

module.exports = router;
