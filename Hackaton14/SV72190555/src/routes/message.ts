import { Router } from "express";
import {
  getMessagesFrom,
  deleteMessage,
  deleteHistory,
  editMessage,
} from "../controllers/message.controller.ts";
import { authMiddleware } from "../middlewares/auth.ts";

const router = Router();

router.get("/from", authMiddleware, getMessagesFrom);
router.delete("/history", authMiddleware, deleteHistory);
router.delete("/:id", authMiddleware, deleteMessage);
router.patch("/:id", authMiddleware, editMessage);

export default router;
