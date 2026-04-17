import { Schema, model, Document } from "mongoose";

export interface ItemDocument extends Document {
  nombre: string;
  descripcion: string;
  fecha: Date;
  esCompletado: boolean;
}

const ItemSchema = new Schema<ItemDocument>(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 300
    },
    fecha: {
      type: Date,
      required: true
    },
    esCompletado: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export const Item = model<ItemDocument>("Item", ItemSchema);
