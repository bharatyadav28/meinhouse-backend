import { pgTable, varchar, check, pgEnum } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { createInsertSchema } from "drizzle-zod";
import { sql } from "drizzle-orm";

import { timestamps } from "../../helpers/columns";
import { CompServices } from "../comp_services/comp_services.model";
import { text } from "drizzle-orm/pg-core";

export const compServiceStatusEnum = pgEnum("comp_service_status ", [
  "pending",
  "contacted",
  "completed",
  "cancelled",
]);

export const CompServicesReq = pgTable(
  "comp_services_req",
  {
    id: varchar("id", { length: 21 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => nanoid(21)),

    comp_service_id: varchar("comp_service_id", {
      length: 21,
    })
      .references(() => CompServices.id)
      .notNull(),

    name: varchar("name", { length: 50 }).notNull(),

    email: varchar("email", { length: 255 }).notNull(),

    mobile: varchar("mobile", { length: 15 }),

    address: text("address").notNull(),

    notes: text("notes"),

    status: compServiceStatusEnum("status").default("pending"),

    ...timestamps,
  },
  (table) => [
    check(
      "valid_email",
      sql`${table.email} ~* '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$'`
    ),
  ]
);

export const createCompServicesReqSchema = createInsertSchema(
  CompServicesReq
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  isDeleted: true,
});
