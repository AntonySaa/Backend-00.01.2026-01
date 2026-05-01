
import { Router } from "express";

import authRoutes    from "./auth.ts";
import messageRoutes from "./message.ts";
import userRoutes    from "./users.ts";
import itemRoutes    from "./item.ts";
import metricsRoutes from "./metrics.ts";
import streamRoutes  from "./stream.ts";

const router = Router();

router.use("/auth",     authRoutes);      // /api/auth/*
router.use("/messages", messageRoutes);   // /api/messages/*  ← fix: era /message
router.use("/users",    userRoutes);      // /api/users/*
router.use("/item",     itemRoutes);      // /api/item/*
router.use("/metrics",  metricsRoutes);   // /api/metrics
router.use("/stream",   streamRoutes);    // /api/stream

export default router;
