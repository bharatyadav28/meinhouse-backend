import { pgTable, varchar, text } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { min_timestamps } from "../../helpers/columns";
import { User } from "../user/user.model";
import { boolean } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";

export const AuthToken = pgTable("auth_token", {
  id: varchar("id", { length: 21 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => nanoid(21)),

  userId: varchar("user_id", { length: 21 })
    .notNull()
    .references(() => User.id),

  token: text("token").notNull(),

  type: varchar("type", { length: 20 }).notNull().default("password_reset"),

  hasExpired: boolean("has_expired").default(false),

  expiredAt: timestamp("expired_at"),

  ...min_timestamps,
});
