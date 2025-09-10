import { Request, Response } from "express";
import { BadRequestError } from "../../errors";
import { createUser, saveSession, verifyEmailPass } from "../user/user.service";
import { saveAddress } from "../address";

export const signupProfessional = async (req: Request, res: Response) => {
  const data = req.cleanBody;

  if (!data.mobile) {
    throw new BadRequestError("Mobile number is required");
  }

  const user = await createUser(data, "user");
  if (user.id) {
    await saveAddress(user.id, data.address);
  }

  return res.status(201).json({
    success: true,
    message: "User signup successful",
  });
};

export const signinProfessional = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { accessToken, refreshToken, user } = await verifyEmailPass(
    email,
    password,
    "user"
  );

  if (refreshToken) await saveSession(req, user.id, refreshToken);

  return res.status(200).json({
    success: true,
    message: "User signin successful",
    data: {
      accessToken,
      refreshToken,
    },
  });
};
