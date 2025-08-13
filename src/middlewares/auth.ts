import { NextFunction, Request, Response } from "express";
import { getAuthUser } from "../@entities/user/user.service";

export const isAdmin = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const existingUser = await getAuthUser(authHeader, "admin");
  req.user = existingUser;
  next();
};
