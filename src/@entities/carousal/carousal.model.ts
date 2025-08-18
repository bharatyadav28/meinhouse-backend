import { pgTable, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { min_timestamps } from "../../helpers/columns";

export const Carousal = pgTable("carousal", {
  id: varchar("id", { length: 21 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => nanoid(21)),
  type: varchar("type").notNull(),

  image_path: varchar("image_path").notNull(),

  ...min_timestamps,
});
