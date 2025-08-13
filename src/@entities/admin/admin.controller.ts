import { Request, Response } from "express";
import { verifyEmailPass } from "../user/user.service";

export const adminSignin = async (req: Request, res: Response) => {
  const { email, password } = req.cleanBody;

  const { accessToken, refreshToken } = await verifyEmailPass(
    email,
    password,
    "admin"
  );

  return res.status(200).json({
    success: true,
    message: "Admin signed in successfully",
    data: {
      accessToken,
      refreshToken,
    },
  });
};
