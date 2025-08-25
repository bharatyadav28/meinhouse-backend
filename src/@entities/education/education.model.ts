import { pgTable, varchar, text, json } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { min_timestamps } from "../../helpers/columns";
import { createInsertSchema } from "drizzle-zod";

export const Education = pgTable("education", {
  id: varchar("id", { length: 21 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => nanoid(21)),

  title: varchar("title", { length: 255 }).notNull(),

  heading: text("heading").notNull(),

  onlineCourseNames: json("online_course_names").$type<string[]>(),

  partnershipTitle: varchar("partnership_title", { length: 255 }),

  description: text("description"),

  services: json("services").$type<string[]>(),

  mobile: varchar("mobile", { length: 20 }),

  email: varchar("email", { length: 255 }),

  ...min_timestamps,
});

export const createEducationSchema = createInsertSchema(Education).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
