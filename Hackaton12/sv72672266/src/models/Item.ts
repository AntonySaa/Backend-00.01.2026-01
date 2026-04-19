import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Document {
    nombre: string;
    descripcion: string;
    fecha: Date;
    esCompletado: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const itemSchema = new Schema<IItem>(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true,
            minlength: [3, 'El nombre debe tener al menos 3 caracteres']
        },
        descripcion: {
            type: String,
            required: [true, 'La descripción es obligatoria'],
            trim: true,
            minlength: [5, 'La descripción debe tener al menos 5 caracteres']
        },
        fecha: {
            type: Date,
            required: [true, 'La fecha es obligatoria'],
            default: new Date()
        },
        esCompletado: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        timestamps: true
    }
);

export const Item = mongoose.model<IItem>('Item', itemSchema);
