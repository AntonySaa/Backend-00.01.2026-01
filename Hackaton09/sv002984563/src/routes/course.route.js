const controller = require(`../controllers/course.controller`);
const courseRouter = require(`express`).Router();

courseRouter.post(`/:userId`,controller.addCourse);

module.exports = { courseRouter };

