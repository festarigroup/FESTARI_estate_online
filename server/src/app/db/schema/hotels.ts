import {
  date,
  decimal,
  index,
  integer,
  jsonb,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { bookingStatusEnum, moderationStatusEnum } from "./enums.js";
import { users } from "./users.js";

export const hotels = pgTable(
  "hotels",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    owner_id: uuid("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    location: text("location").notNull(),
    amenities: jsonb("amenities"),
    price_per_night: decimal("price_per_night", { precision: 12, scale: 2 }).notNull(),
    status: moderationStatusEnum("status").notNull().default("pending"),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("hotels_owner_idx").on(table.owner_id),
    index("hotels_status_idx").on(table.status),
  ],
);

export const hotelImages = pgTable(
  "hotel_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    hotel_id: uuid("hotel_id")
      .notNull()
      .references(() => hotels.id, { onDelete: "cascade" }),
    image_url: text("image_url").notNull(),
    position: smallint("position").notNull().default(0),
  },
  (table) => [index("hotel_images_hotel_idx").on(table.hotel_id)],
);

export const hotelBookings = pgTable(
  "hotel_bookings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    hotel_id: uuid("hotel_id")
      .notNull()
      .references(() => hotels.id),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id),
    check_in: date("check_in").notNull(),
    check_out: date("check_out").notNull(),
    guests: integer("guests").notNull().default(1),
    status: bookingStatusEnum("status").notNull().default("pending"),
    total_price: decimal("total_price", { precision: 12, scale: 2 }).notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("hotel_bookings_hotel_idx").on(table.hotel_id),
    index("hotel_bookings_user_idx").on(table.user_id),
    index("hotel_bookings_status_idx").on(table.status),
  ],
);
