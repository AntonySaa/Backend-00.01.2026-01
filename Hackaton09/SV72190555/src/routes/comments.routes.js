const { Router } = require("express");

const { Comment, User } = require("../models");
const { appError } = require("../middlewares/errorHandler");
const { getPagination, paginatedResponse } = require("../utils/pagination");

const router = Router({ mergeParams: true });

// POST /api/lessons/:lessonId/comments
router.post("/", async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const { body, userId } = req.body;
    const comment = await Comment.create({ body, userId, lessonId });
    return res.status(201).json({ status: "ok", data: comment });
  } catch (error) {
    next(error);
  }
});

// GET /api/lessons/:lessonId/comments
router.get("/", async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const { page, pageSize, limit, offset } = getPagination(req.query);
    const result = await Comment.findAndCountAll({
      where: { lessonId },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [{ model: User, as: "author", attributes: ["id", "firstName", "lastName"] }],
    });
    return res.json(paginatedResponse(result, page, pageSize));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
