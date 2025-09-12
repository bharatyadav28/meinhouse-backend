import { pgTable, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { User } from "../user/user.model";
import { integer, pgEnum } from "drizzle-orm/pg-core";
import z from "zod";
import { line } from "drizzle-orm/pg-core";
import { boolean } from "drizzle-orm/pg-core";
export const addressTypeEnum = pgEnum("address_type", [
  "home",
  "work",
  "other",
]);

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

  isDefault: boolean("is_default").notNull().default(false),

  latitude: varchar("latitude", { length: 50 }),

  longitude: varchar("longitude", { length: 50 }),

  type: addressTypeEnum("type").default("home"),
});

export const createAddressSchema = z.object({
  line1: z.string().max(255),
  line2: z.string().max(255).optional(),
  city: z.string().max(100),
  state: z.string().max(100),
  country: z.string().max(100),
  zipcode: z.number().int().positive(),
  isDefault: z.boolean().optional(),
  latitude: z.string().max(50).optional(),
  longitude: z.string().max(50).optional(),
  type: z.enum(["home", "work", "other"]).optional(),
});
