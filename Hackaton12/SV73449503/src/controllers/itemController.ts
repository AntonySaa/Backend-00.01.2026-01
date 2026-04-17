import { Request, Response } from "express";
import mongoose from "mongoose";
import { Item } from "../models/Item";

const allowedKeys = ["nombre", "descripcion", "fecha", "esCompletado"];

const parseFecha = (value: unknown): Date | null => {
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "string") {
    const soloFecha = /^\d{4}-\d{2}-\d{2}$/.test(value);
    if (soloFecha) {
      const [y, m, d] = value.split("-").map(Number);
      const date = new Date(Date.UTC(y, m - 1, d));
      if (
        date.getUTCFullYear() !== y ||
        date.getUTCMonth() !== m - 1 ||
        date.getUTCDate() !== d
      ) {
        return null;
      }
      return date;
    }

    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
};

export const crearItem = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      res.status(400).json({ errores: ["body invalido"] });
      return;
    }

    const { nombre, descripcion, fecha, esCompletado } = req.body as {
      nombre?: unknown;
      descripcion?: unknown;
      fecha?: unknown;
      esCompletado?: unknown;
    };

    const errores: string[] = [];

    const unknownKeys = Object.keys(req.body).filter(
      (key) => !allowedKeys.includes(key)
    );
    if (unknownKeys.length > 0) {
      errores.push(`campos no permitidos: ${unknownKeys.join(", ")}`);
    }

    if (typeof nombre !== "string" || nombre.trim().length < 2) {
      errores.push("nombre es requerido y debe tener al menos 2 caracteres");
    } else if (nombre.trim().length > 100) {
      errores.push("nombre no debe exceder 100 caracteres");
    }

    if (typeof descripcion !== "string" || descripcion.trim().length < 2) {
      errores.push("descripcion es requerida y debe tener al menos 2 caracteres");
    } else if (descripcion.trim().length > 300) {
      errores.push("descripcion no debe exceder 300 caracteres");
    }

    const fechaParsed = parseFecha(fecha);
    if (!fechaParsed) {
      errores.push("fecha es requerida y debe ser una fecha valida");
    }

    if (esCompletado !== undefined && typeof esCompletado !== "boolean") {
      errores.push("esCompletado debe ser booleano si se envia");
    }

    if (errores.length > 0) {
      res.status(400).json({ errores });
      return;
    }

    const nuevoItem = await Item.create({
      nombre: (nombre as string).trim(),
      descripcion: (descripcion as string).trim(),
      fecha: fechaParsed,
      esCompletado: esCompletado ?? false
    });

    res.status(201).json(nuevoItem);
  } catch (error) {
    console.error("Error al crear item:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

export const verPendientes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const items = await Item.find({ esCompletado: false }).sort({ fecha: 1, createdAt: 1 });
    res.json(items);
  } catch (error) {
    console.error("Error al listar pendientes:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

export const verCompletados = async (_req: Request, res: Response): Promise<void> => {
  try {
    const items = await Item.find({ esCompletado: true }).sort({ fecha: 1, createdAt: 1 });
    res.json(items);
  } catch (error) {
    console.error("Error al listar completados:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

export const completarItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ mensaje: "id invalido" });
      return;
    }

    const item = await Item.findByIdAndUpdate(
      id,
      { esCompletado: true },
      { new: true }
    );

    if (!item) {
      res.status(404).json({ mensaje: "item no encontrado" });
      return;
    }

    res.json(item);
  } catch (error) {
    console.error("Error al completar item:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};
