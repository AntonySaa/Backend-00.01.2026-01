require('dotenv').config();

const { connectDB, disconnectDB } = require('../src/db');
const MateriaPrima = require('../src/models/MateriaPrima');
const Insumo = require('../src/models/Insumo');
const Personal = require('../src/models/Personal');
const Compra = require('../src/models/Compra');
const Produccion = require('../src/models/Produccion');

const seed = async () => {
  await connectDB();

  await Promise.all([
    MateriaPrima.deleteMany({}),
    Insumo.deleteMany({}),
    Personal.deleteMany({}),
    Compra.deleteMany({}),
    Produccion.deleteMany({})
  ]);

  await MateriaPrima.create({ nombre: 'tablon', unidad: 'unidad', stock: 0, costoUnitario: 50 });
  await Insumo.create({ nombre: 'goma', unidad: 'kg', stock: 0, costoUnitario: 20 });

  await Personal.create({
    nombre: 'Juan Perez',
    rol: 'operario',
    horasDisponibles: 40,
    costoHora: 10
  });

  await disconnectDB();
};

seed()
  .then(() => {
    console.log('Seed completado');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error en seed:', err.message);
    process.exit(1);
  });
