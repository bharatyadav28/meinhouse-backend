import { pgTable, varchar, decimal } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { min_timestamps } from "../../helpers/columns";
import { createInsertSchema } from "drizzle-zod";

export const ClientReview = pgTable("client_reviews", {
  id: varchar("id", { length: 21 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => nanoid(21)),

  rating: decimal("rating", { precision: 2, scale: 1 }).default("0.0"),

  review: varchar("review", { length: 1000 }),

  name: varchar("name", { length: 50 }).notNull(),

  company: varchar("company", { length: 100 }),

  country: varchar("country", { length: 100 }),

  ...min_timestamps,
});

export const createReviewSchema = createInsertSchema(ClientReview).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
