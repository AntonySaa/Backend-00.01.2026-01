import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Document {
  nombre: string;
  descripcion: string;
  fecha: Date;
  esCompletado: boolean;
}

const ItemSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria']
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  esCompletado: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model<IItem>('Item', ItemSchema);