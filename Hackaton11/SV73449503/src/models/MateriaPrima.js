const mongoose = require('mongoose');

const MateriaPrimaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, unique: true, trim: true },
    unidad: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, min: 0 },
    costoUnitario: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('MateriaPrima', MateriaPrimaSchema, 'materias_primas');
