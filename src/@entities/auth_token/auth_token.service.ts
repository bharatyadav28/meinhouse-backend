import { eq, and, gt } from "drizzle-orm";

import { BadRequestError } from "../../errors";
import { verifyJWTToken } from "../../helpers/jwt";
import { db } from "../../db";
import { AuthToken } from "./auth_token.model";

export const getTokenReference = async (token: string, type: string) => {
  if (!token) {
    throw new BadRequestError("Token is required");
  }

  const tokenType = type || "password_reset";

  // Verify JWT token
  const payload = verifyJWTToken(token as string, tokenType) as any;

  const userId = payload?.user?.id;

  if (!payload || payload.type !== tokenType || !userId) {
    throw new BadRequestError("Invalid or expired reset token");
  }

  // Check if token exists in database and hasn't been manually expired
  const tokenReference = await db
    .select()
    .from(AuthToken)
    .where(
      and(
        eq(AuthToken.userId, userId),
        eq(AuthToken.type, "password_reset"),
        eq(AuthToken.hasExpired, false)
      )
    )
    .limit(1);

  if (!tokenReference || tokenReference.length === 0) {
    throw new BadRequestError(" Token has been invalidated");
  }

  return tokenReference[0];
};
