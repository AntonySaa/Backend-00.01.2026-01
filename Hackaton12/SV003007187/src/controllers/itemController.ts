import { Request, Response } from 'express';
import Item from '../models/Item';

export const createItem = async (req: Request, res: Response) => {
  try {
    const { nombre, descripcion, fecha, esCompletado } = req.body;
    
    if (!nombre || !descripcion) {
      return res.status(400).json({ 
        error: 'El nombre y descripción son obligatorios' 
      });
    }

    const newItem = new Item({
      nombre,
      descripcion,
      fecha: fecha || new Date(),
      esCompletado: esCompletado || false
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    const err = error as Error;
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getPendingItems = async (req: Request, res: Response) => {
  try {
    const items = await Item.find({ esCompletado: false });
    res.json(items);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const getCompletedItems = async (req: Request, res: Response) => {
  try {
    const items = await Item.find({ esCompletado: true });
    res.json(items);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const completeItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { esCompletado: true },
      { new: true }
    );
    
    if (!updatedItem) {
      return res.status(404).json({ error: 'Ítem no encontrado' });
    }
    
    res.json(updatedItem);
  } catch (error) {
    const err = error as Error;
    console.error('Error en completeItem:', err.message);
    res.status(500).json({ error: err.message });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedItem = await Item.findByIdAndDelete(id);
    
    if (!deletedItem) {
      return res.status(404).json({ error: 'Ítem no encontrado' });
    }
    
    res.json({ message: 'Ítem eliminado correctamente', item: deletedItem });
  } catch (error) {
    const err = error as Error;
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};