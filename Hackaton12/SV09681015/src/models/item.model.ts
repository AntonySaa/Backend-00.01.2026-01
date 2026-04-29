import { Schema, model, Document } from 'mongoose';

// Interfaz TypeScript para el documento
export interface IItem extends Document {
  nombre: string;
  descripcion: string;
  fecha: Date;
  esCompletado: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Schema de Mongoose
const itemSchema = new Schema<IItem>(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
      maxlength: [500, 'La descripción no puede exceder 500 caracteres'],
    },
    fecha: {
      type: Date,
      required: [true, 'La fecha es obligatoria'],
    },
    esCompletado: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // agrega createdAt y updatedAt automáticamente
    versionKey: false,
  }
);

export const Item = model<IItem>('Item', itemSchema);
