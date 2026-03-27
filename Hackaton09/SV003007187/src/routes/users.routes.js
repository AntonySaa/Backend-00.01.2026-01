const router = require('express').Router();
const { User } = require('../models');
const { Op } = require('sequelize');  // Operadores de Sequelize para búsquedas

 
// POST /users - Crear un nuevo usuario
 
router.post('/', async (req, res) => {
  try {
    // Crear usuario con los datos que vienen en el body
    const user = await User.create(req.body);
    
    // Quitar la contraseña antes de enviar la respuesta
    const { passwordHash, ...userWithoutPassword } = user.toJSON();
    
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    // Si el error es por email duplicado
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Email ya registrado' });
    }
    res.status(400).json({ error: error.message });
  }
});
 
// GET /users - Listar usuarios con filtros y paginación
 
router.get('/', async (req, res) => {
  // Obtener parámetros de la URL
  const { role, q, page = 1, pageSize = 10 } = req.query;
  
  // Construir filtros
  const where = {};
  if (role) where.role = role;
  
  // Búsqueda por nombre, apellido o email
  if (q) {
    where[Op.or] = [
      { firstName: { [Op.like]: `%${q}%` } },
      { lastName: { [Op.like]: `%${q}%` } },
      { email: { [Op.like]: `%${q}%` } }
    ];
  }
  
  // Configurar paginación
  const limit = parseInt(pageSize);
  const offset = (parseInt(page) - 1) * limit;
  
  // Buscar usuarios
  const { rows, count } = await User.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],  // Ordenar por fecha de creación
    attributes: { exclude: ['passwordHash'] }  // No incluir contraseña
  });
  
  // Enviar respuesta
  res.json({
    total: count,
    page: parseInt(page),
    pageSize: limit,
    data: rows
  });
});

module.exports = router;