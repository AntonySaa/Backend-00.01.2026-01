const { Router } = require("express");

const { Enrollment } = require("../models");
const { appError } = require("../middlewares/errorHandler");

const router = Router();

// PATCH /api/enrollments/:id/status
router.patch("/:id/status", async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findByPk(req.params.id);
    if (!enrollment) return next(appError(404, "NOT_FOUND", "Inscripcion no encontrada."));
    const { status, score } = req.body;
    await enrollment.update({ status, score });
    return res.json({ status: "ok", data: enrollment });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
