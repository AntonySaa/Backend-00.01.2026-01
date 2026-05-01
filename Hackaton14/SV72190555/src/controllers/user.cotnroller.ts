import type { Response, Request, NextFunction } from "express";
import User from "../models/User.ts";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const myUser = req.userId;
    const allUsers = await User.find({ _id: { $ne: myUser } });
    // Return array directly for easy frontend consumption
    return res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
};
