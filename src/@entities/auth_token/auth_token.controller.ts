import { Request, Response } from "express";
import { eq, and, gt } from "drizzle-orm";

import { db } from "../../db";
import { AuthToken } from "./auth_token.model";
import { User } from "../user/user.model";
import { generateTemporaryToken, verifyJWTToken } from "../../helpers/jwt";
import { BadRequestError, NotFoundError } from "../../errors";
import { getHashPassword } from "../../helpers/passwordEncrpt";
import { getTokenReference } from "./auth_token.service";
import sendEmail from "../../helpers/sendEmail";
import { getResetPasswordHTML } from "../../helpers/getEmailHTML";
import { Role } from "../role/role.model";

export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;

  // Find user by email
  const user = await db
    .select({
      id: User.id,
      email: User.email,
      role: Role.name,
    })
    .from(User)
    .where(and(eq(User.email, email), eq(User.isDeleted, false)))
    .leftJoin(Role as any, eq(User.roleId, Role.id))
    .limit(1);

  if (!user || user.length === 0) {
    throw new NotFoundError("User not found");
  }

  // Mark existing password reset tokens as expired
  await db
    .update(AuthToken)
    .set({ hasExpired: true, expiredAt: new Date() })
    .where(
      and(
        eq(AuthToken.userId, user[0].id),
        eq(AuthToken.type, "password_reset"),
        eq(AuthToken.hasExpired, false)
      )
    );

  const payload = {
    user: { id: user[0].id },
    type: "password_reset",
  };

  const resetToken = generateTemporaryToken(payload);

  if (!resetToken) {
    throw new Error("Failed to generate reset token");
  }

  await db.insert(AuthToken).values({
    userId: user[0].id,
    token: resetToken,
    type: "password_reset",
  });

  // Send email with reset link
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  await sendEmail({
    to: user[0].email,
    subject: "Password Reset",
    html: getResetPasswordHTML(user[0].email, resetToken, user[0].role),
  });

  return res.status(200).json({
    success: true,
    message: "If email exists, password reset link has been sent",
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    throw new BadRequestError("Token and new password are required");
  }

  const tokenReference = await getTokenReference(token, "password_reset");

  const hashedPassword = await getHashPassword(newPassword);

  // Update user password
  await db
    .update(User)
    .set({
      password: hashedPassword,
      updatedAt: new Date(),
    })
    .where(eq(User.id, tokenReference.userId));

  // Expire the token reference
  await db
    .update(AuthToken)
    .set({
      hasExpired: true,
      updatedAt: new Date(),
    })
    .where(eq(AuthToken.id, tokenReference.id));

  return res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
};

export const validateResetToken = async (req: Request, res: Response) => {
  const { token } = req.body;
  await getTokenReference(token, "password_reset");

  return res.status(200).json({
    success: true,
    message: "Token is valid",
  });
};
