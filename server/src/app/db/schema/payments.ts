import { decimal, index, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { paymentStatusEnum, paymentTypeEnum } from "./enums.js";
import { users } from "./users.js";

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id),
    payment_type: paymentTypeEnum("payment_type").notNull(),
    target_id: uuid("target_id"),
    amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
    currency: text("currency").notNull().default("GHS"),
    reference: text("reference").notNull().unique(),
    provider: text("provider").notNull().default("paystack"),
    status: paymentStatusEnum("status").notNull().default("pending"),
    access_code: text("access_code"),
    authorization_url: text("authorization_url"),
    metadata: jsonb("metadata"),
    paid_at: timestamp("paid_at"),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("payments_user_idx").on(table.user_id),
    index("payments_status_idx").on(table.status),
    index("payments_target_idx").on(table.target_id),
  ],
);

export const paystackWebhookEvents = pgTable(
  "paystack_webhook_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    event_id: text("event_id").notNull().unique(),
    event_type: text("event_type").notNull(),
    reference: text("reference"),
    processed_at: timestamp("processed_at").defaultNow().notNull(),
  },
  (table) => [index("paystack_webhook_reference_idx").on(table.reference)],
);
