import { Request, Response } from 'express';
import { Item } from '../models/Item';

// Crear un nuevo item
export const createItem = async (req: Request, res: Response) => {
    try {
        const { nombre, descripcion, fecha, esCompletado } = req.body;

        // Validación básica
        if (!nombre || !descripcion || !fecha) {
            return res.status(400).json({
                success: false,
                message: 'El nombre, descripción y fecha son obligatorios'
            });
        }

        const newItem = new Item({
            nombre,
            descripcion,
            fecha,
            esCompletado: esCompletado || false
        });

        await newItem.save();

        res.status(201).json({
            success: true,
            message: 'Item creado exitosamente',
            data: newItem
        });
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear el item',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};

// Obtener todos los items
export const getAllItems = async (req: Request, res: Response) => {
    try {
        const items = await Item.find().sort({ fecha: -1 });

        res.status(200).json({
            success: true,
            data: items,
            total: items.length
        });
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los items'
        });
    }
};

// Obtener items pendientes (esCompletado = false)
export const getPendingItems = async (req: Request, res: Response) => {
    try {
        const pendingItems = await Item.find({ esCompletado: false }).sort({ fecha: -1 });

        res.status(200).json({
            success: true,
            message: 'Items pendientes',
            data: pendingItems,
            total: pendingItems.length
        });
    } catch (error) {
        console.error('Error fetching pending items:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener items pendientes'
        });
    }
};

// Obtener items completados (esCompletado = true)
export const getCompletedItems = async (req: Request, res: Response) => {
    try {
        const completedItems = await Item.find({ esCompletado: true }).sort({ fecha: -1 });

        res.status(200).json({
            success: true,
            message: 'Items completados',
            data: completedItems,
            total: completedItems.length
        });
    } catch (error) {
        console.error('Error fetching completed items:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener items completados'
        });
    }
};

// Marcar un item como completado
export const completeItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const updatedItem = await Item.findByIdAndUpdate(
            id,
            { esCompletado: true },
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return res.status(404).json({
                success: false,
                message: 'Item no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Item marcado como completado',
            data: updatedItem
        });
    } catch (error) {
        console.error('Error completing item:', error);
        res.status(500).json({
            success: false,
            message: 'Error al marcar el item como completado'
        });
    }
};

// Actualizar un item
export const updateItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, fecha, esCompletado } = req.body;

        const updatedItem = await Item.findByIdAndUpdate(
            id,
            { nombre, descripcion, fecha, esCompletado },
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return res.status(404).json({
                success: false,
                message: 'Item no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Item actualizado exitosamente',
            data: updatedItem
        });
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el item'
        });
    }
};

// Eliminar un item
export const deleteItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedItem = await Item.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({
                success: false,
                message: 'Item no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Item eliminado exitosamente',
            data: deletedItem
        });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el item'
        });
    }
};
