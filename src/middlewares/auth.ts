import { NextFunction, Request, Response } from "express";
import { eq, and } from "drizzle-orm";

import { getAuthUser } from "../@entities/user/user.service";
import { BadRequestError, UnauthenticatedError } from "../errors";
import { generateAccessToken, verifyJWTToken } from "../helpers/jwt";
import { getTokenPayload } from "../helpers/utils";
import { db } from "../db";
import { User, Sessions } from "../@entities/user/user.model";

export const isUser = async (req: Request, _: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const existingUser = await getAuthUser(authHeader, "user");
  req.user = existingUser;
  next();
};

export const isProfessional = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const existingUser = await getAuthUser(authHeader, "professional");
  req.user = existingUser;
  next();
};

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

export const getNewAccessToken = async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const refreshToken = authHeader && authHeader.split(" ")?.[1];

  if (!refreshToken) {
    throw new UnauthenticatedError("No refresh token found");
  }

  const payload = verifyJWTToken(refreshToken, "refresh");
  if (payload && typeof payload === "object" && "user" in payload) {
    const { user, exp } = payload;
    const userId = user?.id;

    const existingUser = await db
      .select()
      .from(User)
      .innerJoin(Sessions as any, eq(User.id, Sessions.userId))
      .where(
        and(
          eq(User.id, userId),
          eq(User.isDeleted, false),
          eq(Sessions.refreshToken, refreshToken)
        )
      )

      .limit(1);

    if (!existingUser || existingUser.length === 0 || !exp) {
      throw new BadRequestError("Session  expired");
    }

    const hasTokenExpired = Date.now() >= exp * 1000;
    if (hasTokenExpired) {
      throw new BadRequestError("Your session is expired, please login");
    }
    const freshPayload = getTokenPayload(userId);
    const accessToken = generateAccessToken(freshPayload);
    return res.status(200).json({
      success: true,
      message: "Access token created sucessfully",
      data: {
        accessToken,
      },
    });
  } else {
    throw new UnauthenticatedError("Your session is expired, please login");
  }
};
