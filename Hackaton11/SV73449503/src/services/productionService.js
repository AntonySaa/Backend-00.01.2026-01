const MateriaPrima = require('../models/MateriaPrima');
const Insumo = require('../models/Insumo');
const Personal = require('../models/Personal');
const Produccion = require('../models/Produccion');

const REQUERIMIENTOS_ARMARIO = {
  tablon: 1,
  gomaKg: 0.25,
  horasHombre: 8
};

const producirArmarios = async (cantidad) => {
  if (cantidad <= 0) throw new Error('La cantidad debe ser mayor a 0');

  const tablon = await MateriaPrima.findOne({ nombre: 'tablon' });
  const goma = await Insumo.findOne({ nombre: 'goma' });
  if (!tablon) throw new Error('No existe materia prima "tablon"');
  if (!goma) throw new Error('No existe insumo "goma"');

  const totalTablon = REQUERIMIENTOS_ARMARIO.tablon * cantidad;
  const totalGoma = REQUERIMIENTOS_ARMARIO.gomaKg * cantidad;
  const totalHH = REQUERIMIENTOS_ARMARIO.horasHombre * cantidad;

  if (tablon.stock < totalTablon) {
    throw new Error(`Stock insuficiente de tablones. Requiere ${totalTablon} y hay ${tablon.stock}`);
  }
  if (goma.stock < totalGoma) {
    throw new Error(`Stock insuficiente de goma. Requiere ${totalGoma} y hay ${goma.stock}`);
  }

  const personal = await Personal.find().sort({ createdAt: 1 });
  const horasDisponibles = personal.reduce((sum, p) => sum + p.horasDisponibles, 0);
  if (horasDisponibles < totalHH) {
    throw new Error(`Horas hombre insuficientes. Requiere ${totalHH} y hay ${horasDisponibles}`);
  }

  const asignaciones = [];
  let horasPendientes = totalHH;

  for (const p of personal) {
    if (horasPendientes <= 0) break;
    const usar = Math.min(p.horasDisponibles, horasPendientes);
    if (usar > 0) {
      p.horasDisponibles -= usar;
      asignaciones.push({ personal: p._id, horas: usar });
      horasPendientes -= usar;
    }
  }

  tablon.stock -= totalTablon;
  goma.stock -= totalGoma;

  await Promise.all([
    tablon.save(),
    goma.save(),
    ...personal.map((p) => p.save())
  ]);

  const produccion = await Produccion.create({
    producto: 'armario',
    cantidad,
    tablonUsado: totalTablon,
    gomaKgUsada: totalGoma,
    horasHombre: totalHH,
    asignaciones
  });

  return produccion;
};

module.exports = { producirArmarios, REQUERIMIENTOS_ARMARIO };
