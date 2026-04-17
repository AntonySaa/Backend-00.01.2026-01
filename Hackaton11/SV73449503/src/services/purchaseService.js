const Compra = require('../models/Compra');
const MateriaPrima = require('../models/MateriaPrima');
const Insumo = require('../models/Insumo');

const comprarMateriaPrima = async ({ nombre, cantidad, costoUnitario }) => {
  if (cantidad <= 0) throw new Error('La cantidad debe ser mayor a 0');
  if (costoUnitario < 0) throw new Error('El costo unitario no puede ser negativo');

  const item = await MateriaPrima.findOne({ nombre });
  if (!item) throw new Error(`Materia prima no encontrada: ${nombre}`);

  item.stock += cantidad;
  if (costoUnitario > 0) item.costoUnitario = costoUnitario;
  await item.save();

  const compra = await Compra.create({
    tipo: 'materia_prima',
    item: item._id,
    itemModel: 'MateriaPrima',
    cantidad,
    costoTotal: cantidad * item.costoUnitario
  });

  return compra;
};

const comprarInsumo = async ({ nombre, cantidad, costoUnitario }) => {
  if (cantidad <= 0) throw new Error('La cantidad debe ser mayor a 0');
  if (costoUnitario < 0) throw new Error('El costo unitario no puede ser negativo');

  const item = await Insumo.findOne({ nombre });
  if (!item) throw new Error(`Insumo no encontrado: ${nombre}`);

  item.stock += cantidad;
  if (costoUnitario > 0) item.costoUnitario = costoUnitario;
  await item.save();

  const compra = await Compra.create({
    tipo: 'insumo',
    item: item._id,
    itemModel: 'Insumo',
    cantidad,
    costoTotal: cantidad * item.costoUnitario
  });

  return compra;
};

module.exports = { comprarMateriaPrima, comprarInsumo };
