import { and, desc, eq, ne, sql } from "drizzle-orm";
import { Request } from "express";

import { db } from "../../db";
import { Sessions, User } from "./user.model";
import { Role } from "../role";
import { CreateUserType } from "../../types/user-types";
import { comparePassword, getHashPassword } from "../../helpers/passwordEncrpt";
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "../../errors";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyJWTToken,
} from "../../helpers/jwt";
import { getTokenPayload } from "../../helpers/utils";
import useragent from "useragent";
import id from "zod/v4/locales/id.js";

export const createUser = async (data: CreateUserType, roleName: string) => {
  const [role] = await db.select().from(Role).where(eq(Role.name, roleName));

  const password = data?.password;
  const hashedPassword = await getHashPassword(password);
  const modifiedData = {
    ...data,
    email: data.email.toLocaleLowerCase(),
    roleId: role?.id,
    password: hashedPassword,
  };

  const user = await db.insert(User).values(modifiedData).returning();

  if (!user || user.length === 0) {
    throw new Error("User signup failed");
  }
  return user?.[0];
};

export const verifyEmailPass = async (
  email: string,
  password: string,
  role: string
) => {
  const existingUser = await db
    .select({
      id: User.id,
      email: User.email,
      password: User.password,
      roleId: User.roleId,
    })
    .from(User)
    .innerJoin(Role as any, eq(User.roleId, Role.id))
    .where(
      and(
        eq(User.email, email.toLocaleLowerCase().trim()),
        eq(User.isDeleted, false),
        eq(Role.name, role)
      )
    )
    .limit(1);

  if (!existingUser || existingUser.length === 0) {
    throw new Error("User not found");
  }

  const hashedPassword = existingUser[0].password;
  const isPasswordValid = await comparePassword(
    password.trim(),
    hashedPassword
  );
  if (!isPasswordValid) {
    throw new BadRequestError("Password is incorrect");
  }

  const { accessToken, refreshToken } = getUserTokens(existingUser[0].id);

  return { accessToken, refreshToken, user: existingUser[0] };
};

export const getUserTokens = (userId: string) => {
  const payload = getTokenPayload(userId);
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  return { accessToken, refreshToken };
};

export const saveSession = async (
  req: Request,
  userId: string,
  refreshToken: string
) => {
  const agent = useragent.parse(req.headers["user-agent"]);
  const os = agent.os.toString();
  const browser = agent.toAgent();
  const ipAddress =
    (Array.isArray(req.headers["x-forwarded-for"])
      ? req.headers["x-forwarded-for"][0]
      : req.headers["x-forwarded-for"]) ||
    req.ip ||
    req.connection?.remoteAddress ||
    "";

  const session = await db.insert(Sessions).values({
    userId,
    refreshToken,
    os,
    browser,
    ipAddress,
  });
  return session;
};

export const getAuthUser = async (
  authHeader?: string,
  role?: any,
  tokenType?: string
) => {
  const userRole = role ? role : "user";
  const accessToken = authHeader && authHeader.split(" ")?.[1];
  if (!accessToken) {
    throw new UnauthenticatedError("Access token missing");
  }

  const payload = verifyJWTToken(accessToken, tokenType);

  if (payload && typeof payload === "object" && "user" in payload) {
    const userId = payload.user.id;

    const existingUser = await db
      .select({
        id: User.id,
        role: Role.name,
      })
      .from(User)
      .innerJoin(Role as any, eq(User.roleId, Role.id))
      .where(
        and(
          eq(User.id, userId),
          eq(User.isDeleted, false),
          eq(Role.name, userRole)
        )
      )
      .limit(1);

    if (!existingUser || existingUser.length === 0) {
      throw new NotFoundError("User doesn't exist");
    }

    return existingUser?.[0];
  } else {
    throw new UnauthenticatedError("Invalid access token");
  }
};

export const getMySessions = async (userId: string, refreshToken: string) => {
  const sessions = await db
    .select({
      id: Sessions.id,
      os: Sessions.os,
      browser: Sessions.browser,
      ipAddress: Sessions.ipAddress,
      createdAt: Sessions.createdAt,
      isCurrentDevice: sql`(CASE
                             WHEN ${Sessions.refreshToken} = ${refreshToken} 
                             THEN True
                             ELSE False
                            END
                              )`,
    })
    .from(Sessions)
    .where(eq(Sessions.userId, userId))
    .orderBy(desc(Sessions.createdAt));

  return sessions;
};

export const sessionsLogoutService = async (
  userId: string,
  refreshToken: string
) => {
  await db
    .delete(Sessions)
    .where(
      and(eq(Sessions.userId, userId), ne(Sessions.refreshToken, refreshToken))
    );
};
