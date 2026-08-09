import { boolean, index, jsonb, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { notificationChannelEnum, notificationFrequencyEnum, notificationVerbEnum } from "./enums.js";
import { users } from "./users.js";

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    recipient_id: uuid("recipient_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    actor_id: uuid("actor_id").references(() => users.id, { onDelete: "set null" }),
    verb: notificationVerbEnum("verb").notNull(),
    target_type: text("target_type"),
    target_id: uuid("target_id"),
    channel: notificationChannelEnum("channel").notNull().default("in_app"),
    title: varchar("title", { length: 255 }).notNull(),
    body: text("body").notNull(),
    data: jsonb("data"),
    is_read: boolean("is_read").notNull().default(false),
    sent_at: timestamp("sent_at"),
    read_at: timestamp("read_at"),
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("notifications_recipient_idx").on(table.recipient_id),
    index("notifications_is_read_idx").on(table.is_read),
    index("notifications_created_idx").on(table.created_at),
  ],
);

export const userNotificationPreferences = pgTable("user_notification_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  frequency: notificationFrequencyEnum("frequency").notNull().default("weekly"),
  in_app_enabled: boolean("in_app_enabled").notNull().default(true),
  email_enabled: boolean("email_enabled").notNull().default(true),
  sms_enabled: boolean("sms_enabled").notNull().default(false),
  whatsapp_enabled: boolean("whatsapp_enabled").notNull().default(false),
  booking_enabled: boolean("booking_enabled").notNull().default(true),
  inquiry_enabled: boolean("inquiry_enabled").notNull().default(true),
  hire_request_enabled: boolean("hire_request_enabled").notNull().default(true),
  social_enabled: boolean("social_enabled").notNull().default(true),
  message_enabled: boolean("message_enabled").notNull().default(true),
  system_enabled: boolean("system_enabled").notNull().default(true),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});
