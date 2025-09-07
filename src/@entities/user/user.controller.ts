import { Request, Response } from "express";

import {
  changePasswordService,
  createUser,
  deleteAccountService,
  getMySessions,
  logoutService,
  saveSession,
  sessionsLogoutService,
  verifyEmailPass,
} from "./user.service";
import { BadRequestError } from "../../errors";

export const signup = async (req: Request, res: Response) => {
  const data = req.cleanBody;

  if (!data.mobile) {
    throw new BadRequestError("Mobile number is required");
  }

  await createUser(data, "user");

  return res.status(201).json({
    success: true,
    message: "User signup successful",
  });
};

export const signinUser = async (req: Request, res: Response) => {
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

export const getUserSessions = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const refreshToken = req.query.refreshToken;
  if (!refreshToken || typeof refreshToken !== "string") {
    throw new BadRequestError("Refresh token is required");
  }

  const sessions = await getMySessions(userId, refreshToken);

  return res.status(200).json({
    success: true,
    message: "User sessions fetched successfully",
    data: { sessions },
  });
};

export const logoutFromOtherDevices = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { refreshToken } = req.body;
  if (!refreshToken || typeof refreshToken !== "string") {
    throw new BadRequestError("Refresh token is required");
  }
  await sessionsLogoutService(userId, refreshToken);

  return res.status(200).json({
    success: true,
    message: "Logged out from other devices successfully",
  });
};

export const deleteUserAccount = async (req: Request, res: Response) => {
  const userId = req.user.id;

  await deleteAccountService(userId);
  return res.status(200).json({
    success: true,
    message: "User account deleted successfully",
  });
};

export const changeUserPassword = async (req: Request, res: Response) => {
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

export const logoutUser = async (req: Request, res: Response) => {
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
