import { boolean, decimal, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const subscriptionPlans = pgTable("subscription_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: jsonb("description"),
  interval: text("interval").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  amount_saved: integer("amount_saved"),
  plan_code: text("plan_code"),
  max_properties: integer("max_properties").notNull().default(0),
  max_hotels: integer("max_hotels").notNull().default(0),
  max_images: integer("max_images").notNull().default(5),
  max_videos: integer("max_videos").notNull().default(0),
  can_feature_properties: boolean("can_feature_properties").notNull().default(false),
  is_active: boolean("is_active").notNull().default(true),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  plan_id: uuid("plan_id")
    .notNull()
    .references(() => subscriptionPlans.id),
  plan_code: text("plan_code"),
  subscription_code: text("subscription_code"),
  paystack_customer_code: text("paystack_customer_code"),
  status: text("status").notNull().default("pending"),
  expires_at: timestamp("expires_at"),
  auto_renewing: boolean("auto_renewing").default(false),
  started_at: timestamp("started_at"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});
