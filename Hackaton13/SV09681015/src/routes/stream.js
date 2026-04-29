const { Router } = require('express');

const router = Router();

/**
 * BONUS: GET /api/stream
 * SSE que emite 5 ticks (uno por segundo) y cierra la conexión.
 */
router.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  let tick = 0;
  const MAX_TICKS = 5;

  const interval = setInterval(() => {
    tick++;
    const data = { tick, timestamp: new Date().toISOString(), message: `Tick ${tick} de ${MAX_TICKS}` };
    res.write(`event: tick\ndata: ${JSON.stringify(data)}\n\n`);

    if (tick >= MAX_TICKS) {
      res.write(`event: done\ndata: ${JSON.stringify({ message: 'Stream completado' })}\n\n`);
      clearInterval(interval);
      res.end();
    }
  }, 1000);

  // Limpiar si el cliente desconecta
  req.on('close', () => clearInterval(interval));
});

module.exports = router;
