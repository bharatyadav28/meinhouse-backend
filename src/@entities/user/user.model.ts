import { pgTable, varchar, boolean, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import z from "zod";

import { Role } from "../role/role.model";
import { timestamps } from "../../helpers/columns";
import { timestamp } from "drizzle-orm/pg-core";

export const User = pgTable(
  "user",
  {
    id: varchar("id", { length: 21 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => nanoid(21)),

    name: varchar("name", { length: 255 }),

    email: varchar("email", { length: 255 }).notNull().unique(),

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

export const Sessions = pgTable("sessions", {
  id: varchar("id", { length: 21 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => nanoid(21)),

  userId: varchar("user_id", { length: 21 })
    .notNull()
    .references(() => User.id),

  refreshToken: varchar("refresh_token", { length: 512 }).notNull(),

  os: varchar("os", { length: 100 }),

  browser: varchar("browser", { length: 100 }),

  ipAddress: varchar("ip_address", { length: 45 }),

  createdAt: timestamp("created_at").defaultNow(),
});

export const createUserSchema = z.object({
  name: z.string().max(255).trim().optional(),
  email: z.string().max(255).trim().email(),
  mobile: z.string().max(15).trim().optional(),
  avatar: z.string().max(255).trim().optional(),
  password: z.string().max(255).trim(),
});
