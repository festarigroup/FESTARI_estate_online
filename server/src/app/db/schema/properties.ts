import {
  boolean,
  decimal,
  index,
  integer,
  pgTable,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { listingTypeEnum, moderationStatusEnum, propertyTypeEnum } from "./enums.js";
import { users } from "./users.js";

export const properties = pgTable(
  "properties",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    owner_id: uuid("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    price: decimal("price", { precision: 14, scale: 2 }).notNull(),
    location: text("location").notNull(),
    listing_type: listingTypeEnum("listing_type").notNull(),
    property_type: propertyTypeEnum("property_type").notNull(),
    bedrooms: smallint("bedrooms"),
    bathrooms: smallint("bathrooms"),
    area_sqm: integer("area_sqm"),
    is_featured: boolean("is_featured").notNull().default(false),
    status: moderationStatusEnum("status").notNull().default("pending"),
    views_count: integer("views_count").notNull().default(0),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("properties_owner_idx").on(table.owner_id),
    index("properties_status_idx").on(table.status),
    index("properties_listing_type_idx").on(table.listing_type),
    index("properties_property_type_idx").on(table.property_type),
  ],
);

export const propertyImages = pgTable(
  "property_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    property_id: uuid("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
    image_url: text("image_url").notNull(),
    position: smallint("position").notNull().default(0),
  },
  (table) => [index("property_images_property_idx").on(table.property_id)],
);

export const wishlists = pgTable(
  "wishlists",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    property_id: uuid("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("wishlists_user_property_unique").on(table.user_id, table.property_id)],
);
