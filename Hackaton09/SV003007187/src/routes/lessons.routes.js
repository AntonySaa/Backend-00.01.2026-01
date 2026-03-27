const router = require('express').Router();
const { Lesson, Course } = require('../models');

router.post('/courses/:courseId/lessons', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.courseId);
    if (!course) return res.status(404).json({ error: 'Curso no encontrado' });
    
    const lastLesson = await Lesson.findOne({
      where: { courseId: course.id },
      order: [['order', 'DESC']]
    });
    
    const order = lastLesson ? lastLesson.order + 1 : 1;
    const lesson = await Lesson.create({ ...req.body, courseId: course.id, order });
    res.status(201).json(lesson);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/courses/:courseId/lessons', async (req, res) => {
  const { order = 'ASC' } = req.query;
  const lessons = await Lesson.findAll({
    where: { courseId: req.params.courseId },
    order: [['order', order]],
    include: [{ model: Course, as: 'course', attributes: ['title'] }]
  });
  res.json(lessons);
});

router.put('/lessons/:id', async (req, res) => {
  const lesson = await Lesson.findByPk(req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lección no encontrada' });
  await lesson.update(req.body);
  res.json(lesson);
});

router.delete('/lessons/:id', async (req, res) => {
  const lesson = await Lesson.findByPk(req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lección no encontrada' });
  await lesson.destroy();
  res.json({ message: 'Lección eliminada' });
});

module.exports = router;