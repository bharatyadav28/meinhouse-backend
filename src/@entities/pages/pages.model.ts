import { pgTable, varchar, text, pgEnum } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { createInsertSchema } from "drizzle-zod";
import { min_timestamps } from "../../helpers/columns";

export const pagesStatusEnum = pgEnum("pages_status", ["active", "inactive"]);

export const Pages = pgTable("pages", {
  id: varchar("id", { length: 21 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => nanoid(21)),

  title: varchar("title").notNull(),

  content: text("content").notNull(),

  status: pagesStatusEnum("status").default("active"),

  ...min_timestamps,
});

export const createPagesSchema = createInsertSchema(Pages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updatePagesSchema = createInsertSchema(Pages).omit({
  id: true,
  title: true,
  createdAt: true,
  updatedAt: true,
});
