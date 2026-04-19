 import { Router } from 'express';
import { 
  createItem, 
  getPendingItems, 
  getCompletedItems, 
  completeItem 
} from '../controllers/itemController';  

const router = Router();

router.post('/items', createItem);
router.get('/items/pending', getPendingItems);
router.get('/items/completed', getCompletedItems);
router.patch('/items/:id/complete', completeItem);

export default router;