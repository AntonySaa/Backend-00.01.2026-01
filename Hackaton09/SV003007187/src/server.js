 const express = require('express');
const { sequelize } = require('./models');
require('dotenv').config();

const app = express();
app.use(express.json());

const userRoutes = require('./routes/users.routes');
const courseRoutes = require('./routes/courses.routes');
const lessonRoutes = require('./routes/lessons.routes');
const enrollmentRoutes = require('./routes/enrollments.routes');
const commentRoutes = require('./routes/comments.routes');

app.use('/users', userRoutes);
app.use('/courses', courseRoutes);
app.use('/lessons', lessonRoutes);
app.use('/enrollments', enrollmentRoutes);
app.use('/comments', commentRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

const syncDB = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Base de datos sincronizada correctamente');
  } catch (error) {
    console.error('Error:', error);
  }
};

syncDB();

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});