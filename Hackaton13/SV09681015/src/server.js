const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📋 Docs Swagger:  http://localhost:${PORT}/api/docs`);
  console.log(`📊 Métricas:      http://localhost:${PORT}/api/metrics`);
  console.log(`🔴 SSE Stream:    http://localhost:${PORT}/api/stream\n`);
});
