const { DataTypes } = require('sequelize');
const sequelize = require('../db');


// usuario

const User = sequelize.define('User', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  firstName: { 
    type: DataTypes.STRING, 
    allowNull: false,
    validate: { len: [2, 50] }  // Mínimo 2, máximo 50 caracteres
  },
  lastName: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true,  // No se repite el email
    validate: { isEmail: true }  // Debe ser formato email
  },
  passwordHash: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  role: { 
    type: DataTypes.ENUM('admin', 'instructor', 'student'), 
    defaultValue: 'student',
    allowNull: false
  }
}, {
  timestamps: true  // Crea createdAt y updatedAt automáticamente
});


// curso

const Course = sequelize.define('Course', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  title: { 
    type: DataTypes.STRING, 
    allowNull: false,
    validate: { len: [5, 100] }  // Título mínimo 5 caracteres
  },
  slug: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true  // URL amigable única
  },
  description: { 
    type: DataTypes.TEXT 
  },
  published: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false  // Por defecto no publicado
  },
  ownerId: { 
    type: DataTypes.INTEGER, 
    references: { model: 'Users', key: 'id' },
    allowNull: false
  }
}, {
  paranoid: true,  // Soft delete (no se borra físicamente)
  timestamps: true,
  hooks: {
    // Antes de guardar, genera el slug automáticamente
    beforeValidate: (course) => {
      if (!course.slug && course.title) {
        course.slug = course.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
      }
      if (course.title) course.title = course.title.trim();
    }
  },
  scopes: {
    published: { where: { published: true } }  // Scope para cursos publicados
  }
});


// 3 lección

const Lesson = sequelize.define('Lesson', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  title: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  slug: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  body: { 
    type: DataTypes.TEXT, 
    allowNull: false,
    validate: { len: [20, 5000] }  // Mínimo 20 caracteres
  },
  order: { 
    type: DataTypes.INTEGER, 
    allowNull: false  // Orden de la lección en el curso
  },
  courseId: { 
    type: DataTypes.INTEGER, 
    references: { model: 'Courses', key: 'id' },
    allowNull: false
  }
}, {
  paranoid: true,  // Soft delete
  timestamps: true,
  hooks: {
    beforeValidate: (lesson) => {
      if (!lesson.slug && lesson.title) {
        lesson.slug = lesson.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
      }
    }
  }
});


// inscripción - tabla intermedia

const Enrollment = sequelize.define('Enrollment', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  status: { 
    type: DataTypes.ENUM('active', 'pending'), 
    defaultValue: 'pending' 
  },
  score: { 
    type: DataTypes.DECIMAL(5,2), 
    validate: { min: 0, max: 100 } 
  },
  userId: { 
    type: DataTypes.INTEGER, 
    references: { model: 'Users', key: 'id' } 
  },
  courseId: { 
    type: DataTypes.INTEGER, 
    references: { model: 'Courses', key: 'id' } 
  }
}, {
  timestamps: true
});


// comentarios

const Comment = sequelize.define('Comment', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  body: { 
    type: DataTypes.TEXT, 
    allowNull: false,
    validate: { len: [3, 500] }  // Mínimo 3 caracteres
  },
  userId: { 
    type: DataTypes.INTEGER, 
    references: { model: 'Users', key: 'id' } 
  },
  lessonId: { 
    type: DataTypes.INTEGER, 
    references: { model: 'Lessons', key: 'id' } 
  }
}, {
  timestamps: true,
  hooks: {
    // limpia el comentario antes de crear y cuando este vacio
    beforeCreate: (comment) => {
      comment.body = comment.body.trim();
      if (comment.body.length < 3) {
        throw new Error('El comentario debe tener al menos 3 caracteres');
      }
    }
  }
});

 
// relaciones entre modelos
 

// usuario (instructor) -> cursos (un instructor tiene muchos cursos)
User.hasMany(Course, { foreignKey: 'ownerId', as: 'courses' });
Course.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// Curso -> Lessons (un curso tiene muchas lecciones)
Course.hasMany(Lesson, { foreignKey: 'courseId', as: 'lessons' });
Lesson.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Usuario <-> Curso (relación muchos a muchos a través de Enrollment)
User.belongsToMany(Course, { through: Enrollment, foreignKey: 'userId', otherKey: 'courseId', as: 'enrolledCourses' });
Course.belongsToMany(User, { through: Enrollment, foreignKey: 'courseId', otherKey: 'userId', as: 'students' });

// isncripcion pertenece a User y Course
Enrollment.belongsTo(User, { foreignKey: 'userId' });
Enrollment.belongsTo(Course, { foreignKey: 'courseId' });

// Lesson -> Comments (una lección tiene muchos comentarios)
Lesson.hasMany(Comment, { foreignKey: 'lessonId', as: 'comments' });
Comment.belongsTo(Lesson, { foreignKey: 'lessonId', as: 'lesson' });

// User -> Comments (un usuario tiene muchos comentarios)
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// Exportar todos los modelos para usarlos en otros archivos
module.exports = { sequelize, User, Course, Lesson, Enrollment, Comment };