const router = require('express').Router();

router.get('/stream', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    let count = 0;
    const interval = setInterval(() => {
        res.write(`data: tick ${count++}\n\n`);
        if (count >= 5) {
            clearInterval(interval);
            res.end();
        }
    }, 1000);

    req.on('close', () => {
        clearInterval(interval);
        res.end();
    });
})

module.exports = router;
