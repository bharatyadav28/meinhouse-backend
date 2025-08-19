import { pgTable, varchar, text } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { createInsertSchema } from "drizzle-zod";

import { timestamps } from "../../helpers/columns";

export const CompServicesReq = pgTable("comp_services_req", {
  id: varchar("id", { length: 21 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => nanoid(21)),

  ...timestamps,
});

export const createCompServicesReqSchema = createInsertSchema(
  CompServicesReq
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  isDeleted: true,
});
