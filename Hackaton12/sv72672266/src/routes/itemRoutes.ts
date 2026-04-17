import express, { Router } from 'express';
import {
    createItem,
    getAllItems,
    getPendingItems,
    getCompletedItems,
    completeItem,
    updateItem,
    deleteItem
} from '../controllers/itemController';

const router: Router = express.Router();

// Rutas principales
router.post('/', createItem);                      // POST /items - Crear item
router.get('/', getAllItems);                      // GET /items - Obtener todos los items
router.get('/pending', getPendingItems);          // GET /items/pending - Obtener pendientes
router.get('/completed', getCompletedItems);      // GET /items/completed - Obtener completados
router.patch('/:id/complete', completeItem);      // PATCH /items/:id/complete - Marcar como completado
router.patch('/:id', updateItem);                 // PATCH /items/:id - Actualizar item
router.delete('/:id', deleteItem);                // DELETE /items/:id - Eliminar item

export default router;
