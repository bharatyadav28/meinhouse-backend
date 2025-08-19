import { pgTable, varchar, text } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { createInsertSchema } from "drizzle-zod";

import { min_timestamps } from "../../helpers/columns";

export const Article = pgTable("article", {
  id: varchar("id", { length: 21 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => nanoid(21)),

  pic_path: varchar("pic_path"),

  author: varchar("author", { length: 100 }).notNull(),

  title: varchar("title", { length: 255 }).notNull(),

  description: text("description").notNull(),

  content: text("content").notNull(),

  ...min_timestamps,
});

export const createArticleSchema = createInsertSchema(Article).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
