import { Router } from 'express';
import {
  createItem,
  getPendingItems,
  getCompletedItems,
  completeItem,
  deleteItem,
  updateItem,
  getItemsByDate,
} from '../controllers/item.controller';

const router = Router();

// ─── Rutas requeridas ──────────────────────────────────────────────────────────
router.post('/', createItem);                        // Crear ítem
router.get('/pending', getPendingItems);             // Ver pendientes
router.get('/completed', getCompletedItems);         // Ver completados
router.patch('/:id/complete', completeItem);         // Marcar como completado

// ─── BONUS: Rutas adicionales ──────────────────────────────────────────────────
router.delete('/:id', deleteItem);                   // Eliminar ítem
router.put('/:id', updateItem);                      // Editar ítem
router.get('/filter/by-date', getItemsByDate);       // Filtrar por fecha (?from=&to=)

export default router;
