import { pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", [
  "buyer",
  "estate_manager",
  "hotel_manager",
  "artisan",
  "admin",
]);

export const otpEnum = pgEnum("otp_purpose", ["email_verification", "password_reset"]);

export const moderationStatusEnum = pgEnum("moderation_status", [
  "pending",
  "approved",
  "rejected",
]);

export const listingTypeEnum = pgEnum("listing_type", ["for_sale", "for_rent", "short_stay"]);

export const propertyTypeEnum = pgEnum("property_type", [
  "land",
  "home",
  "apartment",
  "office",
]);

export const paymentTypeEnum = pgEnum("payment_type", [
  "subscription",
  "property",
  "hotel_booking",
  "artisan_hire",
]);

export const paymentStatusEnum = pgEnum("payment_status", ["pending", "success", "failed"]);

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
]);

export const hireStatusEnum = pgEnum("hire_status", [
  "pending",
  "accepted",
  "rejected",
  "completed",
]);

export const postKindEnum = pgEnum("post_kind", ["property", "service", "general", "venue"]);

export const hotelCategoryEnum = pgEnum("hotel_category", [
  "hotel",
  "resort",
  "apartment",
  "event_venue",
  "short_stay",
]);

export const notificationVerbEnum = pgEnum("notification_verb", [
  "like",
  "comment",
  "follow",
  "booking",
  "inquiry",
  "hire_request",
  "message",
  "system",
]);

export const notificationChannelEnum = pgEnum("notification_channel", [
  "in_app",
  "email",
  "sms",
  "whatsapp",
]);

export const notificationFrequencyEnum = pgEnum("notification_frequency", [
  "daily",
  "weekly",
  "monthly",
  "never",
]);
