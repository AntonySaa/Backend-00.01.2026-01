import { Router } from "express";
import { crearItem, verPendientes, verCompletados, completarItem } from "../controllers/itemController";

const router = Router();

router.post("/items", crearItem);
router.get("/items/pending", verPendientes);
router.get("/items/completed", verCompletados);
router.patch("/items/:id/complete", completarItem);

export default router;
