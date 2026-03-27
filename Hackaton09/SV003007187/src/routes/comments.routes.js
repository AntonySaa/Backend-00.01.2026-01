const router = require('express').Router();
const { Comment, Lesson, User } = require('../models');

router.post('/lessons/:lessonId/comments', async (req, res) => {
  try {
    const lesson = await Lesson.findByPk(req.params.lessonId);
    if (!lesson) return res.status(404).json({ error: 'Lección no encontrada' });
    
    const comment = await Comment.create({ 
      ...req.body, 
      lessonId: req.params.lessonId,
      userId: 1 
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/lessons/:lessonId/comments', async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const limit = parseInt(pageSize);
  const offset = (parseInt(page) - 1) * limit;
  
  const { rows, count } = await Comment.findAndCountAll({
    where: { lessonId: req.params.lessonId },
    limit,
    offset,
    include: [{ model: User, as: 'author', attributes: ['id', 'firstName', 'lastName'] }],
    order: [['createdAt', 'DESC']]
  });
  
  res.json({
    total: count,
    page: parseInt(page),
    pageSize: limit,
    data: rows
  });
});

module.exports = router;