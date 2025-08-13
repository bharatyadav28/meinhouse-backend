import { pgTable, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { min_timestamps } from "../../helpers/columns";

export const Role = pgTable("roles", {
  id: varchar("id", { length: 21 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => nanoid(21)),

  name: varchar("name", { length: 50 }),

  ...min_timestamps,
});
