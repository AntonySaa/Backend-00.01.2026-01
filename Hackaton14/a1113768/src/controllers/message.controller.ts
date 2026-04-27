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
