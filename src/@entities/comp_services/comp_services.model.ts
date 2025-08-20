import { pgTable, varchar, text } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { timestamps } from "../../helpers/columns";

export const CompServices = pgTable("comp_services", {
  id: varchar("id", { length: 21 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => nanoid(21)),

  picPath: varchar("pic_path").notNull(),

  name: varchar("name", { length: 100 }).notNull(),

  description: text("description"),

  ...timestamps,
});
