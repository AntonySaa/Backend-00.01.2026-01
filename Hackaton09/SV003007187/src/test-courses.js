const { sequelize, Course, User } = require('./models');

const test = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión exitosa');
    
    const courses = await Course.findAll({
      include: [{ model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName'] }]
    });
    
    console.log('Cursos encontrados:', courses.length);
    courses.forEach(c => {
      console.log('  -', c.title, '(ID:', c.id, ')');
    });
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

test();