import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { otpEnum, roleEnum } from "./enums.js";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    firstname: text("firstname"),
    lastname: text("lastname"),
    email: text("email"),
    phone: text("phone"),
    password_hash: text("password_hash"),
    profile_picture: text("profile_picture"),
    is_active: boolean("is_active").notNull().default(true),
    verified: boolean("verified").notNull().default(false),
    terms_accepted_at: timestamp("terms_accepted_at"),
    googleId: varchar("google_id", { length: 255 }).unique(),
    payment_provider_customer_id: text("payment_provider_customer_id"),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("users_email_unique").on(table.email).where(sql`${table.email} IS NOT NULL`),
    uniqueIndex("users_phone_unique").on(table.phone).where(sql`${table.phone} IS NOT NULL`),
  ],
);

export const userRoles = pgTable(
  "user_roles",
  {
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: roleEnum("role").notNull(),
  },
  (table) => [primaryKey({ columns: [table.user_id, table.role] })],
);

export const userOtps = pgTable(
  "user_otps",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    otp_hash: text("otp_hash").notNull(),
    purpose: otpEnum("purpose").notNull(),
    attempt_count: integer("attempt_count").notNull().default(0),
    expires_at: timestamp("expires_at").notNull(),
    locked_at: timestamp("locked_at"),
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("user_otps_user_idx").on(table.user_id)],
);

export const refreshTokens = pgTable(
  "refresh_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token_hash: text("token_hash").notNull(),
    expires_at: timestamp("expires_at").notNull(),
    revoked_at: timestamp("revoked_at"),
    device_name: text("device_name"),
    platform: text("platform"),
    ip_address: text("ip_address"),
    user_agent: text("user_agent"),
    last_active_at: timestamp("last_active_at").defaultNow().notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("refresh_tokens_user_idx").on(table.user_id)],
);
