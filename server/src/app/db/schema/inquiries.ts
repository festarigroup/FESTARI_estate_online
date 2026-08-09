import { boolean, index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { artisanProfiles } from "./artisans.js";
import { properties } from "./properties.js";
import { users } from "./users.js";

export const propertyInquiries = pgTable(
  "property_inquiries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    property_id: uuid("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
    user_id: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    message: text("message").notNull(),
    is_read: boolean("is_read").notNull().default(false),
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("property_inquiries_property_idx").on(table.property_id)],
);

export const artisanInquiries = pgTable(
  "artisan_inquiries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    artisan_id: uuid("artisan_id")
      .notNull()
      .references(() => artisanProfiles.id, { onDelete: "cascade" }),
    user_id: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    message: text("message").notNull(),
    is_read: boolean("is_read").notNull().default(false),
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("artisan_inquiries_artisan_idx").on(table.artisan_id)],
);
