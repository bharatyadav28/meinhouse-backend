import { pgTable, varchar, text, check } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

import { min_timestamps } from "../../helpers/columns";

export const Query = pgTable(
  "query",
  {
    id: varchar("id", { length: 21 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => nanoid(21)),

    name: varchar("name").notNull(),

    email: varchar("email").notNull(),

    message: text("message").notNull(),

    ...min_timestamps,
  },
  (table) => [
    check(
      "valid_email",
      sql`${table.email} ~* '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$'`
    ),
  ]
);

export const createQuerySchema = createInsertSchema(Query).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
