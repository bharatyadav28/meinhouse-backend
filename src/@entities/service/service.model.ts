import { boolean } from "drizzle-orm/pg-core";
import { integer } from "drizzle-orm/pg-core";
import { pgTable, varchar, text } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { pgEnum } from "drizzle-orm/pg-core";
import { z } from "zod";

import { min_timestamps } from "../../helpers/columns";

export const serviceStatusEnum = pgEnum("service_status", [
  "active",
  "inactive",
  "draft",
]);

export const Services = pgTable("services", {
  id: varchar("id", { length: 21 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => nanoid(21)),

  name: varchar("name", { length: 100 }).notNull(),

  iconPath: varchar("icon_path", { length: 255 }).notNull(),

  imagePath: varchar("image_path", { length: 255 }).notNull(),

  minHoursRequired: integer("min_hours_required").notNull(),

  price: integer("price").notNull(),

  additionalHourPrice: integer("additional_hour_price").notNull(),

  introTitle: varchar("intro_title", { length: 255 }),

  introduction: text("introduction"),

  whyChooseUs: text("why_choose_us"),

  description: text("description"),

  metaTitle: varchar("meta_title", { length: 255 }),

  metaDescription: text("meta_description"),

  status: serviceStatusEnum("status").default("active").notNull(),

  is_license_required: boolean("is_license_required").default(false).notNull(),

  slug: varchar("slug", { length: 150 }).notNull(),

  ...min_timestamps,
});

export const createServiceSchema = z.object({
  name: z.string().trim().min(1).max(100),
  iconPath: z.string().trim().min(1).max(255),
  imagePath: z.string().trim().min(1).max(255),
  minHoursRequired: z.number().int().min(1),
  price: z.number().int().min(0),
  additionalHourPrice: z.number().int().min(0),
  introTitle: z.string().trim().max(255).optional(),
  introduction: z.string().trim().optional(),
  whyChooseUs: z.string().trim().optional(),
  description: z.string().trim().optional(),
  metaTitle: z.string().trim().max(255).optional(),
  metaDescription: z.string().trim().optional(),
  status: z.enum(["active", "inactive", "draft"]).default("active"),
  is_license_required: z.boolean().default(false),
  slug: z.string().trim().min(1).max(150),
});

export const updateServiceSchema = createServiceSchema.partial();
