const { Task } = require("../models");
const { getPagination, paginatedResponse } = require("../utils/pagination");

// POST /api/task — crear tarea
const createTask = async (req, res, next) => {
  try {
    const { title, description, deadline } = req.body;
    const task = await Task.create({
      title,
      description,
      deadline,
      userId: req.usuario.id,
    });
    return res.status(201).json({ status: "ok", data: task });
  } catch (error) {
    next(error);
  }
};

// GET /api/task — listar todas las tareas del usuario autenticado
const listAllTasks = async (req, res, next) => {
  try {
    const { page, pageSize, limit, offset } = getPagination(req.query);
    const result = await Task.findAndCountAll({
      where: { userId: req.usuario.id },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({ status: "ok", ...paginatedResponse(result, page, pageSize) });
  } catch (error) {
    next(error);
  }
};

// GET /api/task/pending — listar tareas pendientes (isCompleted = false)
const listPendingTasks = async (req, res, next) => {
  try {
    const { page, pageSize, limit, offset } = getPagination(req.query);
    const result = await Task.findAndCountAll({
      where: { userId: req.usuario.id, isCompleted: false },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({ status: "ok", ...paginatedResponse(result, page, pageSize) });
  } catch (error) {
    next(error);
  }
};

// GET /api/task/completed — listar tareas completadas (isCompleted = true)
const listCompletedTasks = async (req, res, next) => {
  try {
    const { page, pageSize, limit, offset } = getPagination(req.query);
    const result = await Task.findAndCountAll({
      where: { userId: req.usuario.id, isCompleted: true },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({ status: "ok", ...paginatedResponse(result, page, pageSize) });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/task/:id/complete — marcar tarea como completada
const completeTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.usuario.id },
    });

    if (!task) {
      const { appError } = require("../middlewares/errorHandler");
      return next(appError(404, "NOT_FOUND", "Tarea no encontrada."));
    }

    await task.update({ isCompleted: true });
    return res.status(200).json({ status: "ok", data: task });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTask, listAllTasks, listPendingTasks, listCompletedTasks, completeTask };
