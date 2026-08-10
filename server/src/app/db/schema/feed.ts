import {
  index,
  pgTable,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { postKindEnum } from "./enums.js";
import { artisanProfiles } from "./artisans.js";
import { hotels } from "./hotels.js";
import { properties } from "./properties.js";
import { users } from "./users.js";

export const stories = pgTable(
  "stories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    author_id: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    media_url: text("media_url").notNull(),
    caption: varchar("caption", { length: 255 }),
    created_at: timestamp("created_at").defaultNow().notNull(),
    expires_at: timestamp("expires_at").notNull(),
  },
  (table) => [
    index("stories_author_idx").on(table.author_id),
    index("stories_expires_idx").on(table.expires_at),
  ],
);

export const storyViews = pgTable(
  "story_views",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    story_id: uuid("story_id")
      .notNull()
      .references(() => stories.id, { onDelete: "cascade" }),
    viewer_id: uuid("viewer_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    viewed_at: timestamp("viewed_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("story_views_story_viewer_unique").on(table.story_id, table.viewer_id)],
);

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    author_id: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    kind: postKindEnum("kind").notNull().default("general"),
    body: text("body").notNull(),
    hashtags: text("hashtags"),
    linked_property_id: uuid("linked_property_id").references(() => properties.id, {
      onDelete: "set null",
    }),
    linked_artisan_id: uuid("linked_artisan_id").references(() => artisanProfiles.id, {
      onDelete: "set null",
    }),
    linked_hotel_id: uuid("linked_hotel_id").references(() => hotels.id, {
      onDelete: "set null",
    }),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("posts_author_idx").on(table.author_id),
    index("posts_kind_idx").on(table.kind),
    index("posts_created_idx").on(table.created_at),
  ],
);

export const postImages = pgTable(
  "post_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    post_id: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    image_url: text("image_url").notNull(),
    position: smallint("position").notNull().default(0),
  },
  (table) => [index("post_images_post_idx").on(table.post_id)],
);

export const postLikes = pgTable(
  "post_likes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    post_id: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("post_likes_post_user_unique").on(table.post_id, table.user_id)],
);

export const postComments = pgTable(
  "post_comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    post_id: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    author_id: uuid("author_id")
      .notNull()
      .references(() => users.id),
    body: text("body").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("post_comments_post_idx").on(table.post_id)],
);

export const postShares = pgTable(
  "post_shares",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    post_id: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id),
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("post_shares_post_idx").on(table.post_id)],
);

export const savedPosts = pgTable(
  "saved_posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    post_id: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("saved_posts_post_user_unique").on(table.post_id, table.user_id)],
);
