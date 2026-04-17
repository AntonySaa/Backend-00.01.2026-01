const mongoose = require('mongoose');

const AsignacionSchema = new mongoose.Schema(
  {
    personal: { type: mongoose.Schema.Types.ObjectId, ref: 'Personal', required: true },
    horas: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const ProduccionSchema = new mongoose.Schema(
  {
    producto: { type: String, required: true, trim: true },
    cantidad: { type: Number, required: true, min: 1 },
    tablonUsado: { type: Number, required: true, min: 0 },
    gomaKgUsada: { type: Number, required: true, min: 0 },
    horasHombre: { type: Number, required: true, min: 0 },
    asignaciones: { type: [AsignacionSchema], default: [] },
    fecha: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Produccion', ProduccionSchema, 'producciones');
