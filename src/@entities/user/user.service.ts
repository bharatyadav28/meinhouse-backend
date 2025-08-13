import { eq } from "drizzle-orm";

import { db } from "../../db";
import { User } from "./user.model";
import { Role } from "../role";
import { CreateUserType } from "../../types/user-types";
import { hashPassword } from "../../helpers/passwordEncrpt";

export const createUser = async (data: CreateUserType, roleName: string) => {
  const [role] = await db.select().from(Role).where(eq(Role.name, roleName));

  const password = data?.password;
  const hashedPassword = await hashPassword(password);
  const modifiedData = { ...data, roleId: role?.id, password: hashedPassword };

  const user = await db.insert(User).values(modifiedData).returning();

  if (!user || user.length === 0) {
    throw new Error("User signup failed");
  }
  return user?.[0];
};
