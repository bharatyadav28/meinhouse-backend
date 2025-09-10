import { pgTable, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { User } from "../user/user.model";
import { integer } from "drizzle-orm/pg-core";

export const Address = pgTable("address", {
  id: varchar("id", { length: 21 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => nanoid(21)),

  userId: varchar("user_id", { length: 21 })
    .notNull()
    .references(() => User.id),

  line1: varchar("line1", { length: 255 }).notNull(),

  line2: varchar("line2", { length: 255 }),

  city: varchar("city", { length: 100 }).notNull(),

  state: varchar("state", { length: 100 }).notNull(),

  country: varchar("country", { length: 100 }).notNull(),

  zipcode: integer("zipcode").notNull(),

  isDefault: varchar("is_default", { length: 5 }).notNull().default("false"),

  latitude: varchar("latitude", { length: 50 }),

  longitude: varchar("longitude", { length: 50 }),
});
