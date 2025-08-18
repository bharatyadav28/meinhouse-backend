import { Request, Response } from "express";

import { verifyEmailPass } from "../user/user.service";
import { s3Uploadv4 } from "../../helpers/s3";
import { BadRequestError } from "../../errors";
import { cdnURL } from "../../helpers/utils";

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

export const uploadFile = async (req: Request, res: Response) => {
  const { folder } = req.body;
  if (!req.file) {
    throw new BadRequestError("Please upload an file");
  }

  const uploadResult = await s3Uploadv4(req.file, folder);

  // Generate image URL
  const result = `${cdnURL}/${uploadResult.Key}`;

  return res.status(200).json({
    success: true,
    message: "File uploaded successfully",
    data: { url: result },
  });
};
