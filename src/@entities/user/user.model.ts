import { pgTable, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { createInsertSchema } from "drizzle-zod";

export const UserModel = pgTable("user", {
  id: varchar("id", { length: 21 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => nanoid(21)),
});

export const createUserSchema = createInsertSchema(UserModel).omit({
  id: true,
});
