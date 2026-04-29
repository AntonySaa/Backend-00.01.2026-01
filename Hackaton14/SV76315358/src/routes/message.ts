import { Router } from "express";
import { getMessagesFrom } from "../controllers/message.controller.ts";
import { authMiddleware } from "../middlewares/auth.ts";

const router = Router();

router.get("/from", authMiddleware, getMessagesFrom);

export default router;
