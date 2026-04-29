import dotenv from 'dotenv';
dotenv.config();

import app from './app.ts';

const PORT = process.env['PORT'] || 3000;
const MONGODB_URI = process.env['MONGODB_URI'];

async function start(): Promise<void> {
  try {
    // MongoDB es opcional: si no hay URI configurada, arranca sin BD
    if (MONGODB_URI) {
      const { connectDB } = await import('./config/database.ts');
      await connectDB();
    } else {
      console.log('ℹ️  MONGODB_URI no configurado — modo memoria (hackathon)');
    }

    app.listen(PORT, () => {
      console.log(`\n==================================================`);
      console.log(`Servidor corriendo en el puerto: ${PORT}`);
      console.log(`Docs:     http://localhost:${PORT}/api/docs`);
      console.log(`Health:   http://localhost:${PORT}/api/health`);
      console.log(`Metrics:  http://localhost:${PORT}/api/metrics`);
      console.log(`Stream:   http://localhost:${PORT}/api/stream`);
      console.log(`====================================================\n`);
    });
  } catch (err) {
    console.log('Fallo al iniciar el servidor: ', err);
    process.exit(1);
  }
}

process.on('unhandledRejection', (reason: unknown) => {
  console.log('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (reason: unknown) => {
  console.log('Uncaught Exception:', reason);
  process.exit(1);
});

start();
