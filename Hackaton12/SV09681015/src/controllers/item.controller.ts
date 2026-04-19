import { Request, Response } from 'express';
import { Item } from '../models/item.model';
import { isValidObjectId } from 'mongoose';

// ─── Crear ítem ────────────────────────────────────────────────────────────────
export const createItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, descripcion, fecha, esCompletado } = req.body;

    // Validación básica
    if (!nombre || !descripcion || !fecha) {
      res.status(400).json({
        success: false,
        message: 'Los campos nombre, descripcion y fecha son obligatorios',
      });
      return;
    }

    const item = new Item({
      nombre,
      descripcion,
      fecha: new Date(fecha),
      esCompletado: esCompletado ?? false,
    });

    const savedItem = await item.save();

    res.status(201).json({
      success: true,
      message: 'Ítem creado exitosamente',
      data: savedItem,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, message: 'Error al crear ítem', error: message });
  }
};

// ─── Ver ítems pendientes ──────────────────────────────────────────────────────
export const getPendingItems = async (_req: Request, res: Response): Promise<void> => {
  try {
    const items = await Item.find({ esCompletado: false }).sort({ fecha: 1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, message: 'Error al obtener pendientes', error: message });
  }
};

// ─── Ver ítems completados ─────────────────────────────────────────────────────
export const getCompletedItems = async (_req: Request, res: Response): Promise<void> => {
  try {
    const items = await Item.find({ esCompletado: true }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, message: 'Error al obtener completados', error: message });
  }
};

// ─── Marcar ítem como completado ──────────────────────────────────────────────
export const completeItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400).json({ success: false, message: 'ID no válido' });
      return;
    }

    const item = await Item.findByIdAndUpdate(
      id,
      { esCompletado: true },
      { new: true, runValidators: true }
    );

    if (!item) {
      res.status(404).json({ success: false, message: 'Ítem no encontrado' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Ítem marcado como completado',
      data: item,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, message: 'Error al completar ítem', error: message });
  }
};

// ─── BONUS: Eliminar ítem ──────────────────────────────────────────────────────
export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400).json({ success: false, message: 'ID no válido' });
      return;
    }

    const item = await Item.findByIdAndDelete(id);

    if (!item) {
      res.status(404).json({ success: false, message: 'Ítem no encontrado' });
      return;
    }

    res.status(200).json({ success: true, message: 'Ítem eliminado exitosamente' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, message: 'Error al eliminar ítem', error: message });
  }
};

// ─── BONUS: Editar ítem ────────────────────────────────────────────────────────
export const updateItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400).json({ success: false, message: 'ID no válido' });
      return;
    }

    const { nombre, descripcion, fecha } = req.body;
    const updateData: Partial<{ nombre: string; descripcion: string; fecha: Date }> = {};

    if (nombre) updateData.nombre = nombre;
    if (descripcion) updateData.descripcion = descripcion;
    if (fecha) updateData.fecha = new Date(fecha);

    const item = await Item.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!item) {
      res.status(404).json({ success: false, message: 'Ítem no encontrado' });
      return;
    }

    res.status(200).json({ success: true, message: 'Ítem actualizado', data: item });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, message: 'Error al actualizar ítem', error: message });
  }
};

// ─── BONUS: Filtrar por fecha ──────────────────────────────────────────────────
export const getItemsByDate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      res.status(400).json({ success: false, message: 'Se requieren los parámetros from y to (YYYY-MM-DD)' });
      return;
    }

    const items = await Item.find({
      fecha: {
        $gte: new Date(from as string),
        $lte: new Date(to as string),
      },
    }).sort({ fecha: 1 });

    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, message: 'Error al filtrar por fecha', error: message });
  }
};
