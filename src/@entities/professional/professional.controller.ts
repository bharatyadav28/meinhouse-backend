import { Request, Response } from "express";
import { BadRequestError } from "../../errors";
import {
  changePasswordService,
  createUser,
  deleteAccountService,
  logoutService,
  saveSession,
  verifyEmailPass,
} from "../user/user.service";
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

export const deleteProfessionalAccount = async (
  req: Request,
  res: Response
) => {
  const userId = req.user.id;

  await deleteAccountService(userId);
  return res.status(200).json({
    success: true,
    message: "User account deleted successfully",
  });
};

export const changeProfessionalPassword = async (
  req: Request,
  res: Response
) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword.trim() || !newPassword.trim()) {
    throw new BadRequestError("Both current and new passwords are required");
  }

  await changePasswordService(
    userId,
    currentPassword.trim(),
    newPassword.trim()
  );

  return res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
};

export const logoutProfessional = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { refreshToken } = req.body;
  if (!refreshToken || typeof refreshToken !== "string") {
    throw new BadRequestError("Refresh token is required");
  }

  await logoutService(userId, refreshToken);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
