import { pgTable, varchar, boolean, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { nanoid } from "nanoid";

import { createInsertSchema } from "drizzle-zod";
import { Role } from "../role/role.model";
import { timestamps } from "../../helpers/columns";

export const User = pgTable(
  "user",
  {
    id: varchar("id", { length: 21 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => nanoid(21)),

    name: varchar("name", { length: 255 }),

    email: varchar("email", { length: 255 }).notNull(),

    isEmailVerified: boolean("is_email_verified").notNull().default(false),

    mobile: varchar("mobile", { length: 15 }),

    isMobileVerified: boolean("is_mobile_verified").notNull().default(false),

    avatar: varchar("avatar", { length: 255 }),

    password: varchar("password", { length: 255 }).notNull(),

    roleId: varchar("role_id", { length: 21 })
      .notNull()
      .references(() => Role.id),

    ...timestamps,
  },
  (table) => [
    check(
      "valid_email",
      sql`${table.email} ~* '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$'`
    ),
  ]
);

export const createUserSchema = createInsertSchema(User).omit({
  id: true,
  roleId: true,
  isEmailVerified: true,
  isMobileVerified: true,
  deletedAt: true,
  isDeleted: true,
});
