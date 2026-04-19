const mongoose = require("mongoose");

const insumoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
      default: "",
    },
    tipo: {
      type: String,
      enum: [
        "goma",
        "pegamento",
        "barniz",
        "pintura",
        "clavos",
        "tornillos",
        "madera",
        "otro",
      ],
      default: "goma",
    },
    unidadMedida: {
      type: String,
      enum: ["kg", "litro", "unidad", "metro"],
      default: "kg",
    },
    cantidadComprada: {
      type: Number,
      required: [true, "La cantidad comprada es obligatoria"],
      min: [1, "Mínimo 1 unidad"],
    },
    cantidadRecibida: {
      type: Number,
      default: 0,
    },
    ratioConversion: {
      type: Number,
      default: 0.25, // Ratio 1:0.25 → 0.25 kg por cada 1 comprada
    },
    precioUnitario: {
      type: Number,
      required: [true, "El precio unitario es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },
     fechaCompra: {
      type: Date,
      default: Date.now,
    },
    estado: {
      type: String,
      enum: ["pendiente", "recibido", "parcial"],
      default: "pendiente",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

insumoSchema.pre("save", function () {
  if (this.isModified("cantidadComprada")) {
    this.cantidadRecibida = this.cantidadComprada * this.ratioConversion;
  }
});

insumoSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();

  if (update.cantidadComprada) {
    update.cantidadRecibida = update.cantidadComprada * 0.25;
  }
});

insumoSchema.virtual("costoTotal").get(function () {
  return this.cantidadComprada * this.precioUnitario;
});

insumoSchema.set("toJSON", { virtuals: true });
insumoSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Insumo", insumoSchema);