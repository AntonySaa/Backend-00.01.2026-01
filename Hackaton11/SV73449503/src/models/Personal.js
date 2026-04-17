const mongoose = require('mongoose');

const PersonalSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    rol: { type: String, required: true, trim: true },
    horasDisponibles: { type: Number, required: true, min: 0 },
    costoHora: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Personal', PersonalSchema, 'personales');
