 const { sequelize, User, Course, Lesson, Enrollment, Comment } = require('./models');

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Base de datos limpiada');
    
    const users = await User.bulkCreate([
      { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@dev.io', passwordHash: 'hash123', role: 'instructor' },
      { firstName: 'Linus', lastName: 'Torvalds', email: 'linus@dev.io', passwordHash: 'hash123', role: 'student' },
      { firstName: 'Grace', lastName: 'Hopper', email: 'grace@dev.io', passwordHash: 'hash123', role: 'student' },
      { firstName: 'Alan', lastName: 'Turing', email: 'alan@dev.io', passwordHash: 'hash123', role: 'student' }
    ]);
    console.log('Creados', users.length, 'usuarios');
    
    const course = await Course.create({
      title: 'Introducción a Node.js',
      slug: 'introduccion-a-node-js',
      description: 'Aprende los fundamentos de Node.js, Express y bases de datos',
      published: true,
      ownerId: users[0].id
    });
    console.log('Curso creado:', course.title);
    
    const lessons = await Lesson.bulkCreate([
      { title: 'Setup inicial', slug: 'setup-inicial', body: 'En esta lección aprenderás a instalar Node.js', order: 1, courseId: course.id },
      { title: 'HTTP y Express', slug: 'http-y-express', body: 'Creación de servidores HTTP con Express', order: 2, courseId: course.id },
      { title: 'Bases de datos con Sequelize', slug: 'bases-de-datos-con-sequelize', body: 'Aprende a conectar bases de datos', order: 3, courseId: course.id }
    ]);
    console.log('Creadas', lessons.length, 'lecciones');
    
    const enrollments = await Enrollment.bulkCreate([
      { userId: users[1].id, courseId: course.id, status: 'active', score: 85.5 },
      { userId: users[2].id, courseId: course.id, status: 'active', score: 92.0 },
      { userId: users[3].id, courseId: course.id, status: 'pending' }
    ]);
    console.log('Creadas', enrollments.length, 'inscripciones');
    
    const comments = await Comment.bulkCreate([
      { body: 'Excelente introducción, muy clara.', userId: users[1].id, lessonId: lessons[0].id },
      { body: 'Me encantó la parte de Express.', userId: users[2].id, lessonId: lessons[1].id },
      { body: 'Excelente curso.', userId: users[3].id, lessonId: lessons[2].id }
    ]);
    console.log('Creados', comments.length, 'comentarios');
    
    console.log('Base de datos poblada exitosamente');
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedDatabase();