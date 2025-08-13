import { Request, Response } from "express";

import { createUser } from "./user.service";

export const signup = async (req: Request, res: Response) => {
  await createUser(req.body, "user");

  return res.status(201).json({
    success: true,
    message: "User signup successful",
  });
};
