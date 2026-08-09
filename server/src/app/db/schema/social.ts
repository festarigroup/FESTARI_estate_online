import { sql } from "drizzle-orm";
import { check, index, pgTable, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const follows = pgTable(
  "follows",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    follower_id: uuid("follower_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    following_id: uuid("following_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("follows_follower_following_unique").on(table.follower_id, table.following_id),
    index("follows_following_idx").on(table.following_id),
    check("follows_no_self_follow", sql`${table.follower_id} <> ${table.following_id}`),
  ],
);
