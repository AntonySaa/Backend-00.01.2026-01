const router = require('express').Router();
const { Enrollment, Course, User, sequelize } = require('../models');

// POST /courses/:courseId/enroll - Inscribir usuario  
 
router.post('/courses/:courseId/enroll', async (req, res) => {
  const { userId } = req.body;
  const { courseId } = req.params;
  
  // Iniciar una transacción
  const t = await sequelize.transaction();
  
  try {
    // Verificar que el curso existe
    const course = await Course.findByPk(courseId);
    if (!course) {
      await t.rollback();
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    
    // Verificar que el usuario existe
    const user = await User.findByPk(userId);
    if (!user) {
      await t.rollback();
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Crear inscripción en estado pending
    const enrollment = await Enrollment.create({ 
      userId, 
      courseId, 
      status: 'pending' 
    }, { transaction: t });
    
    // Cambiar a active
    await enrollment.update({ status: 'active' }, { transaction: t });
    
    // Si todo salió bien, confirmar la transacción
    await t.commit();
    res.status(201).json({ ok: true, enrollment });
    
  } catch (error) {
    // Si algo salió mal, deshacer todo
    await t.rollback();
    res.status(400).json({ error: error.message });
  }
});


// PATCH /enrollments/:id/status - Cambiar estado de inscripción

router.patch('/:id/status', async (req, res) => {
  const { status, score } = req.body;
  const enrollment = await Enrollment.findByPk(req.params.id);
  if (!enrollment) return res.status(404).json({ error: 'Inscripción no encontrada' });
  
  await enrollment.update({ status, score });
  res.json(enrollment);
});


// GET /courses/:courseId/enrollments - Listar inscripciones de un curso

router.get('/courses/:courseId/enrollments', async (req, res) => {
  const { status } = req.query;
  const where = { courseId: req.params.courseId };
  if (status) where.status = status;
  
  const enrollments = await Enrollment.findAll({
    where,
    include: [{ model: User, attributes: ['id', 'firstName', 'lastName', 'email'] }],
    attributes: ['id', 'status', 'score', 'createdAt']
  });
  
  res.json(enrollments);
});

module.exports = router;