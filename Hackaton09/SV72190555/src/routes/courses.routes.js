const { Router } = require("express");
const { Op } = require("sequelize");

const { Course, User, Lesson, Enrollment } = require("../models");
const { appError } = require("../middlewares/errorHandler");
const { getPagination, paginatedResponse } = require("../utils/pagination");

const router = Router();

// POST /api/courses
router.post("/", async (req, res, next) => {
  try {
    const { title, description, published, ownerId, slug } = req.body;
    const owner = await User.findByPk(ownerId);
    if (!owner) return next(appError(404, "NOT_FOUND", "Owner user not found."));
    if (!["instructor", "admin"].includes(owner.role)) {
      return next(appError(403, "FORBIDDEN", "Only instructors or admins can create courses."));
    }
    const course = await Course.create({ title, description, published, ownerId, slug });
    return res.status(201).json({ status: "ok", data: course });
  } catch (error) {
    next(error);
  }
});

// GET /api/courses
router.get("/", async (req, res, next) => {
  try {
    const { published, q, order: rawOrder } = req.query;
    const { page, pageSize, limit, offset } = getPagination(req.query);
    const where = {};
    if (published !== undefined) where.published = published === "true";
    if (q && q.trim()) where.title = { [Op.like]: `%${q.trim()}%` };
    let orderClause = [["createdAt", "DESC"]];
    if (rawOrder) {
      const [field, dir] = rawOrder.split(":");
      const allowed = ["title", "createdAt", "published"];
      if (allowed.includes(field)) orderClause = [[field, (dir || "DESC").toUpperCase()]];
    }
    const result = await Course.findAndCountAll({
      where,
      order: orderClause,
      limit,
      offset,
      include: [{ model: User, as: "owner", attributes: ["id", "firstName", "lastName"] }],
    });
    return res.json(paginatedResponse(result, page, pageSize));
  } catch (error) {
    next(error);
  }
});

// GET /api/courses/:slug
router.get("/:slug", async (req, res, next) => {
  try {
    const course = await Course.findOne({
      where: { slug: req.params.slug },
      include: [
        { model: User, as: "owner", attributes: ["id", "firstName", "lastName", "email"] },
        { model: Lesson, as: "lessons", attributes: ["id", "title", "order"], required: false },
      ],
    });
    if (!course) return next(appError(404, "NOT_FOUND", "Curso no encontrado."));
    const studentsCount = await Enrollment.count({ where: { courseId: course.id, status: "active" } });
    return res.json({ ...course.toJSON(), stats: { lessonsCount: course.lessons.length, studentsCount } });
  } catch (error) {
    next(error);
  }
});

// PUT /api/courses/:id
router.put("/:id", async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return next(appError(404, "NOT_FOUND", "Curso no encontrado."));
    const { title, description, published } = req.body;
    await course.update({ title, description, published });
    return res.json({ status: "ok", data: course });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/courses/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return next(appError(404, "NOT_FOUND", "Curso no encontrado."));
    await course.destroy();
    return res.json({ status: "ok", message: "Curso eliminado correctamente." });
  } catch (error) {
    next(error);
  }
});

// POST /api/courses/:courseId/enroll
router.post("/:courseId/enroll", async (req, res, next) => {
  const sequelize = require("../db");
  const t = await sequelize.transaction();
  try {
    const { userId } = req.body;
    const { courseId } = req.params;
    const course = await Course.findByPk(courseId);
    if (!course) { await t.rollback(); return next(appError(404, "NOT_FOUND", "Curso no encontrado.")); }
    const user = await User.findByPk(userId);
    if (!user) { await t.rollback(); return next(appError(404, "NOT_FOUND", "Usuario no encontrado.")); }
    const enr = await Enrollment.create({ userId, courseId, status: "pending" }, { transaction: t });
    await enr.update({ status: "active" }, { transaction: t });
    await Course.increment("studentsCount", { by: 1, where: { id: courseId }, transaction: t });
    await t.commit();
    return res.status(201).json({ status: "ok", data: enr });
  } catch (error) {
    await t.rollback();
    next(error);
  }
});

// GET /api/courses/:courseId/enrollments
router.get("/:courseId/enrollments", async (req, res, next) => {
  try {
    const { status } = req.query;
    const { page, pageSize, limit, offset } = getPagination(req.query);
    const where = { courseId: req.params.courseId };
    if (status) where.status = status;
    const result = await Enrollment.findAndCountAll({
      where,
      limit,
      offset,
      include: [{ model: User, as: "user", attributes: ["id", "firstName", "lastName", "email"] }],
    });
    return res.json(paginatedResponse(result, page, pageSize));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
