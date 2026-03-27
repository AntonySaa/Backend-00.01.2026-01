const { sequelize } = require('./models');

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión exitosa a PostgreSQL!');
    console.log('Base de datos conectada correctamente');
    process.exit();
  } catch (error) {
    console.error(' Error de conexión:', error.message);
    process.exit(1);
  }
};

testConnection();