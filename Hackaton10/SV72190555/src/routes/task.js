const { Router } = require("express");
const { createTask, listAllTasks, listPendingTasks, listCompletedTasks, completeTask } = require("../controllers/task.controller");
const authMiddleware = require("../middlewares/auth");

const router = Router();

// POST /api/task — crear tarea (requiere token)
router.post("/", authMiddleware, createTask);

// GET /api/task — listar todas las tareas del usuario
router.get("/", authMiddleware, listAllTasks);

// GET /api/task/pending — listar tareas pendientes
router.get("/pending", authMiddleware, listPendingTasks);

// GET /api/task/completed — listar tareas completadas
router.get("/completed", authMiddleware, listCompletedTasks);

// PATCH /api/task/:id/complete — marcar tarea como completada
router.patch("/:id/complete", authMiddleware, completeTask);

module.exports = router;
