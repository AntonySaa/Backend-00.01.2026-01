import type { NextFunction, Response, Request } from "express";
import type { IMetrics } from "../interface/IMetrics.ts";
import Message from "../models/Message.ts";
import type { IMessage } from "../interface/IMessage.ts";

export const metrics: IMetrics = {
  startTime: Date.now(),
  totalRequests: 0,
  byMethod: {},
  byStatus: {},
  byRoute: {},
  responseTimes: [],
};

export const getMessagesFrom = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const me = req.userId;
    const { from } = req.query;

    if (typeof from !== "string") {
      return res.status(400).json({ error: "Invalid 'from'" });
    }

    type FilterQuery<T> = {
      [P in keyof T]?: T[P] | { [key: string]: any };
    } & { $or?: Array<FilterQuery<T>> };

    const messages = await Message.find({
      $or: [
        { from: me, to: from },
        { from: from, to: me },
      ],
    } as FilterQuery<IMessage>).sort({ timestamp: 1 });

    res.status(200).json({ status: "ok", data: messages });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const me = req.userId?.toString();

    const msg = await Message.findById(id);
    if (!msg) return res.status(404).json({ error: "Mensaje no encontrado" });
    if (msg.from !== me)
      return res.status(403).json({ error: "No autorizado" });

    await Message.findByIdAndDelete(id);
    res.status(200).json({ status: "ok", message: "Mensaje eliminado" });
  } catch (error) {
    next(error);
  }
};

export const deleteHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const me = req.userId?.toString();
    const { with: withUser } = req.query;

    if (typeof withUser !== "string") {
      return res.status(400).json({ error: "Falta parámetro 'with'" });
    }

    type FilterQuery<T> = {
      [P in keyof T]?: T[P] | { [key: string]: any };
    } & { $or?: Array<FilterQuery<T>> };

    await Message.deleteMany({
      $or: [
        { from: me, to: withUser },
        { from: withUser, to: me },
      ],
    } as FilterQuery<IMessage>);

    res.status(200).json({ status: "ok", message: "Historial borrado" });
  } catch (error) {
    next(error);
  }
};

export const editMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const me = req.userId?.toString();
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Texto inválido" });
    }

    const msg = await Message.findById(id);
    if (!msg) return res.status(404).json({ error: "Mensaje no encontrado" });
    if (msg.from !== me)
      return res.status(403).json({ error: "No autorizado" });

    msg.text = text;
    msg.edited = true;
    await msg.save();

    res.status(200).json({ status: "ok", data: msg });
  } catch (error) {
    next(error);
  }
};
