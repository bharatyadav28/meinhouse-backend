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
import { getTokenPayload, getURLPath } from "../../helpers/utils";
import useragent from "useragent";
import { s3Uploadv4 } from "../../helpers/s3";

export const createUser = async (data: CreateUserType, roleName: string) => {
  const [role] = await db.select().from(Role).where(eq(Role.name, roleName));
  if (!role) {
    throw new NotFoundError("Role not found");
  }

  const existingUser = await db
    .select()
    .from(User)
    .where(
      and(
        eq(User.email, data.email.toLocaleLowerCase().trim()),
        eq(User.isDeleted, false)
      )
    )
    .limit(1);

  if (existingUser && existingUser.length > 0) {
    throw new BadRequestError("Email already in use");
  }

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
      throw new UnauthenticatedError("User doesn't exist");
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

export const logoutService = async (userId: string, refreshToken: string) => {
  const deletedSession = await db
    .delete(Sessions)
    .where(
      and(eq(Sessions.userId, userId), eq(Sessions.refreshToken, refreshToken))
    )
    .returning();

  if (!deletedSession || deletedSession.length === 0) {
    throw new Error("Logout failed");
  }
};

export const deleteAccountService = async (userId: string) => {
  const now = new Date();
  const deletedAccount = await db
    .update(User)
    .set({ isDeleted: true, deletedAt: now, updatedAt: now })
    .where(eq(User.id, userId))
    .returning();

  if (!deletedAccount || deletedAccount.length === 0) {
    throw new Error("Account deletion failed");
  }
};

export const changePasswordService = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const existingUser = await db
    .select({ password: User.password })
    .from(User)
    .where(and(eq(User.id, userId), eq(User.isDeleted, false)))
    .limit(1);

  if (!existingUser || existingUser.length === 0) {
    throw new NotFoundError("User not found");
  }

  const hashedPassword = existingUser[0]?.password;
  const isPasswordValid = await comparePassword(
    currentPassword,
    hashedPassword
  );
  if (!isPasswordValid) {
    throw new BadRequestError("Current Password is incorrect");
  }

  const newHashedPassword = await getHashPassword(newPassword);

  const updatedUser = await db
    .update(User)
    .set({ password: newHashedPassword, updatedAt: new Date() })
    .where(eq(User.id, userId))
    .returning();

  if (!updatedUser || updatedUser.length === 0) {
    throw new Error("Password update failed");
  }
};

export const updateProfileService = async (
  userId: string,
  profileData: { name: string; email: string; mobile: string }
) => {
  const { name, email, mobile } = profileData;
  if (!name || !email || !mobile) {
    throw new BadRequestError("Name, email and mobile are required");
  }

  const existingUserPromise = await db
    .select()
    .from(User)
    .where(and(eq(User.id, userId), eq(User.isDeleted, false)))
    .limit(1);

  const existingEmailPromise = await db
    .select()
    .from(User)
    .where(
      and(
        eq(User.email, profileData.email.toLocaleLowerCase().trim()),
        eq(User.isDeleted, false)
      )
    )
    .limit(1);

  const [existingUser, existingEmail] = await Promise.all([
    existingUserPromise,
    existingEmailPromise,
  ]);

  if (!existingUser || existingUser.length === 0) {
    throw new NotFoundError("User not found");
  }

  if (
    existingEmail &&
    existingEmail.length > 0 &&
    existingEmail[0].id !== userId
  ) {
    throw new BadRequestError("Email already in use");
  }

  const updatedUser = await db
    .update(User)
    .set({
      name: profileData.name.trim(),
      email: profileData.email.toLocaleLowerCase().trim(),
      mobile: profileData.mobile.trim(),
      updatedAt: new Date(),
    })
    .where(eq(User.id, userId))
    .returning();

  if (!updatedUser || updatedUser.length === 0) {
    throw new Error("Profile update failed");
  }

  return updatedUser?.[0];
};

export const getProfileService = async (userId: string) => {
  const existingUser = await db
    .select({
      id: User.id,
      name: User.name,
      email: User.email,
      mobile: User.mobile,
      avatar: User.avatar,
    })
    .from(User)
    .where(and(eq(User.id, userId), eq(User.isDeleted, false)));

  if (!existingUser || existingUser.length === 0) {
    throw new NotFoundError("User not found");
  }

  return existingUser?.[0];
};

export const updateAvatarService = async (
  userId: string,
  file: Express.Multer.File | undefined
) => {
  if (!file) {
    throw new BadRequestError("Please upload an avatar image");
  }
  const uploadResult = await s3Uploadv4(file, "avatars");

  const updatedUser = await db
    .update(User)
    .set({ avatar: getURLPath(uploadResult.Key), updatedAt: new Date() })
    .where(eq(User.id, userId))
    .returning();

  if (!updatedUser || updatedUser.length === 0) {
    throw new Error("Avatar update failed");
  }

  return updatedUser?.[0];
};
