const { Router } = require("express");

const { Lesson, Course } = require("../models");
const { appError } = require("../middlewares/errorHandler");
const { getPagination, paginatedResponse } = require("../utils/pagination");

const router = Router({ mergeParams: true });

// POST /api/courses/:courseId/lessons
router.post("/", async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { title, body, slug } = req.body;
    const course = await Course.findByPk(courseId);
    if (!course) return next(appError(404, "NOT_FOUND", "Curso no encontrado."));
    const lastLesson = await Lesson.findOne({ where: { courseId }, order: [["order", "DESC"]] });
    const order = lastLesson ? lastLesson.order + 1 : 1;
    const lesson = await Lesson.create({ title, body, slug, order, courseId });
    return res.status(201).json({ status: "ok", data: lesson });
  } catch (error) {
    next(error);
  }
});

// GET /api/courses/:courseId/lessons
router.get("/", async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { order: rawOrder } = req.query;
    const { page, pageSize, limit, offset } = getPagination(req.query);
    const dir = rawOrder === "ASC" ? "ASC" : "DESC";
    const result = await Lesson.findAndCountAll({
      where: { courseId },
      order: [["order", dir]],
      limit,
      offset,
      include: [{ model: Course, as: "course", attributes: ["id", "title", "slug"] }],
    });
    return res.json(paginatedResponse(result, page, pageSize));
  } catch (error) {
    next(error);
  }
});

// PUT /api/lessons/:id
router.put("/:id", async (req, res, next) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id);
    if (!lesson) return next(appError(404, "NOT_FOUND", "Leccion no encontrada."));
    const { title, body } = req.body;
    await lesson.update({ title, body });
    return res.json({ status: "ok", data: lesson });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/lessons/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id);
    if (!lesson) return next(appError(404, "NOT_FOUND", "Leccion no encontrada."));
    await lesson.destroy();
    return res.json({ status: "ok", message: "Leccion eliminada correctamente." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
