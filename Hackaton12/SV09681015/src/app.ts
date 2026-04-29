import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import connectDB from './config/database';
import itemRoutes from './routes/item.routes';
import loggerMiddleware from './middleware/logger.middleware';

const app: Application = express();
const PORT = process.env.PORT ?? 3000;

// ─── Middleware globales ───────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// ─── Archivos estáticos (interfaz web) ────────────────────────────────────────
app.use(express.static(path.join(__dirname, '..', 'public')));

// ─── Ruta de salud ─────────────────────────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    message: '🛒 Shopping List API corriendo',
    timestamp: new Date().toISOString(),
  });
});

// ─── Rutas principales ─────────────────────────────────────────────────────────
app.use('/items', itemRoutes);

// ─── Ruta 404 ──────────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

// ─── Iniciar servidor ──────────────────────────────────────────────────────────
const startServer = async (): Promise<void> => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`🌐 Interfaz web en   http://localhost:${PORT}/index.html`);
    console.log(`📋 Endpoints disponibles:`);
    console.log(`   POST   /items`);
    console.log(`   GET    /items/pending`);
    console.log(`   GET    /items/completed`);
    console.log(`   PATCH  /items/:id/complete`);
    console.log(`   DELETE /items/:id`);
    console.log(`   PUT    /items/:id`);
    console.log(`   GET    /items/filter/by-date?from=&to=`);
  });
};

startServer();

export default app;
