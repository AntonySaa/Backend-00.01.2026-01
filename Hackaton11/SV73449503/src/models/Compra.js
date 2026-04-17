const mongoose = require('mongoose');

const CompraSchema = new mongoose.Schema(
  {
    tipo: { type: String, required: true, enum: ['materia_prima', 'insumo'] },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'itemModel'
    },
    itemModel: {
      type: String,
      required: true,
      enum: ['MateriaPrima', 'Insumo']
    },
    cantidad: { type: Number, required: true, min: 0 },
    costoTotal: { type: Number, required: true, min: 0 },
    fecha: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Compra', CompraSchema, 'compras');
