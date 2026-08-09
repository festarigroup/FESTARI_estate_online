import { sql } from "drizzle-orm";
import { check, index, pgTable, smallint, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { hireStatusEnum, moderationStatusEnum } from "./enums.js";
import { users } from "./users.js";

export const artisanProfiles = pgTable(
  "artisan_profiles",
  {
    id: uuid("id")
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),
    service_type: text("service_type").notNull(),
    bio: text("bio"),
    location: text("location"),
    status: moderationStatusEnum("status").notNull().default("pending"),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("artisan_profiles_status_idx").on(table.status)],
);

export const artisanHireRequests = pgTable(
  "artisan_hire_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    artisan_id: uuid("artisan_id")
      .notNull()
      .references(() => artisanProfiles.id),
    requester_id: uuid("requester_id")
      .notNull()
      .references(() => users.id),
    message: text("message").notNull(),
    status: hireStatusEnum("status").notNull().default("pending"),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("artisan_hire_requests_artisan_idx").on(table.artisan_id),
    index("artisan_hire_requests_requester_idx").on(table.requester_id),
  ],
);

export const artisanReviews = pgTable(
  "artisan_reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    artisan_id: uuid("artisan_id")
      .notNull()
      .references(() => artisanProfiles.id, { onDelete: "cascade" }),
    reviewer_id: uuid("reviewer_id")
      .notNull()
      .references(() => users.id),
    rating: smallint("rating").notNull(),
    comment: text("comment"),
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("artisan_reviews_artisan_idx").on(table.artisan_id),
    check("artisan_reviews_rating_range", sql`${table.rating} >= 1 AND ${table.rating} <= 5`),
  ],
);
