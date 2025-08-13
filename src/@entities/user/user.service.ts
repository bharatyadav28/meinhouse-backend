import { and, eq } from "drizzle-orm";

import { db } from "../../db";
import { User } from "./user.model";
import { Role } from "../role";
import { CreateUserType } from "../../types/user-types";
import { comparePassword, hashPassword } from "../../helpers/passwordEncrpt";
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

export const createUser = async (data: CreateUserType, roleName: string) => {
  const [role] = await db.select().from(Role).where(eq(Role.name, roleName));

  const password = data?.password;
  const hashedPassword = await hashPassword(password);
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
        eq(User.email, email.toLocaleLowerCase()),
        eq(User.isDeleted, false),
        eq(Role.name, role)
      )
    )
    .limit(1);

  if (!existingUser || existingUser.length === 0) {
    throw new Error("User not found");
  }

  const hashedPassword = existingUser[0].password;
  const isPasswordValid = await comparePassword(password, hashedPassword);
  if (!isPasswordValid) {
    throw new BadRequestError("Password is incorrect");
  }

  const { accessToken, refreshToken } = getUserTokens(existingUser[0].id);

  return { accessToken, refreshToken };
};

export const getUserTokens = (userId: string) => {
  const payload = getTokenPayload(userId);
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  return { accessToken, refreshToken };
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
