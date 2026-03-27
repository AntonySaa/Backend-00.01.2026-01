 const router = require('express').Router();
const { Course, User, Lesson, Enrollment } = require('../models');
const { Op } = require('sequelize');

router.post('/', async (req, res) => {
  try {
    const course = await Course.create({ ...req.body, ownerId: 1 });
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { published, q, order = 'createdAt:DESC', page = 1, pageSize = 10 } = req.query;
    const where = {};
    
    if (published !== undefined) {
      where.published = published === 'true';
    }
    
    if (q) {
      where[Op.or] = [
        { title: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } }
      ];
    }
    
    const [orderField, orderDirection] = order.split(':');
    const limit = parseInt(pageSize);
    const offset = (parseInt(page) - 1) * limit;
    
    const result = await Course.findAndCountAll({
      where,
      limit,
      offset,
      order: [[orderField, orderDirection]],
      include: [{ model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName'] }]
    });
    
    console.log('Cursos encontrados:', result.count);
    
    res.json({
      total: result.count,
      page: parseInt(page),
      pageSize: limit,
      data: result.rows
    });
  } catch (error) {
    console.error('Error en GET /courses:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const course = await Course.findOne({
      where: { slug: req.params.slug },
      include: [
        { model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName'] },
        { model: Lesson, as: 'lessons', attributes: ['id', 'title', 'order'] }
      ]
    });
    
    if (!course) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    
    const studentsCount = await Enrollment.count({ 
      where: { courseId: course.id, status: 'active' } 
    });
    
    res.json({
      ...course.toJSON(),
      stats: {
        lessonsCount: course.lessons.length,
        studentsCount
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ error: 'Curso no encontrado' });
    await course.update(req.body);
    res.json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ error: 'Curso no encontrado' });
    await course.destroy();
    res.json({ message: 'Curso eliminado' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;