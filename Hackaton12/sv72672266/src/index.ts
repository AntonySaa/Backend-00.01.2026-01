import express, { Request, Response } from 'express';
import { ENV } from './config/env';
import { connectDB } from './config/database';
import itemRoutes from './routes/itemRoutes';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.get('/', (req: Request, res: Response) => {
    res.send({
        'title': 'Hackaton 12',
        'description': 'API de Gestión de Lista de Compras',
        'author': 'nelhoesp',
        'version': '1.0.0',
        'endpoints': {
            'crear_item': 'POST /api/items',
            'obtener_todos': 'GET /api/items',
            'obtener_pendientes': 'GET /api/items/pending',
            'obtener_completados': 'GET /api/items/completed',
            'marcar_completado': 'PATCH /api/items/:id/complete',
            'actualizar_item': 'PATCH /api/items/:id',
            'eliminar_item': 'DELETE /api/items/:id'
        }
    });
});

// Rutas de API
app.use('/api/items', itemRoutes);

// Iniciar servidor
const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT, () => {
            console.log(`\nServer is running on port ${ENV.PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};

startServer();
