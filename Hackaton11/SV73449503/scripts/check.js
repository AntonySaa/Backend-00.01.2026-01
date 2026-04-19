require('dotenv').config();

const { connectDB, disconnectDB } = require('../src/db');
const MateriaPrima = require('../src/models/MateriaPrima');
const Insumo = require('../src/models/Insumo');
const Personal = require('../src/models/Personal');
const { comprarMateriaPrima, comprarInsumo } = require('../src/services/purchaseService');
const { producirArmarios, REQUERIMIENTOS_ARMARIO } = require('../src/services/productionService');

const check = async () => {
  await connectDB();

  const tablon = await MateriaPrima.findOne({ nombre: 'tablon' });
  const goma = await Insumo.findOne({ nombre: 'goma' });
  const personal = await Personal.find();

  if (!tablon || !goma || personal.length === 0) {
    throw new Error('Datos base no encontrados. Ejecuta primero: npm run seed');
  }

  const horasIniciales = personal.reduce((s, p) => s + p.horasDisponibles, 0);

  // Compras solicitadas
  await comprarMateriaPrima({ nombre: 'tablon', cantidad: 3, costoUnitario: tablon.costoUnitario });
  await comprarInsumo({ nombre: 'goma', cantidad: 1, costoUnitario: goma.costoUnitario });

  const tablonPostCompra = await MateriaPrima.findOne({ nombre: 'tablon' });
  const gomaPostCompra = await Insumo.findOne({ nombre: 'goma' });

  if (tablonPostCompra.stock < 3) throw new Error('Compra de tablones no registrada');
  if (gomaPostCompra.stock < 1) throw new Error('Compra de goma no registrada');

  // Producción de armarios
  const cantidadArmarios = 3;
  await producirArmarios(cantidadArmarios);

  const tablonFinal = await MateriaPrima.findOne({ nombre: 'tablon' });
  const gomaFinal = await Insumo.findOne({ nombre: 'goma' });
  const personalFinal = await Personal.find();

  const esperadoTablon = tablonPostCompra.stock - REQUERIMIENTOS_ARMARIO.tablon * cantidadArmarios;
  const esperadoGoma = gomaPostCompra.stock - REQUERIMIENTOS_ARMARIO.gomaKg * cantidadArmarios;
  const horasConsumidas = REQUERIMIENTOS_ARMARIO.horasHombre * cantidadArmarios;
  const horasDisponibles = personalFinal.reduce((s, p) => s + p.horasDisponibles, 0);

  if (tablonFinal.stock !== esperadoTablon) throw new Error('Stock de tablones inconsistente');
  if (gomaFinal.stock !== esperadoGoma) throw new Error('Stock de goma inconsistente');
  if (horasDisponibles > horasIniciales || horasDisponibles < horasIniciales - horasConsumidas) {
    throw new Error('Horas de personal inconsistentes');
  }

  await disconnectDB();
};

check()
  .then(() => {
    console.log('Validación OK');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Validación fallida:', err.message);
    process.exit(1);
  });
