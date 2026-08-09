import { notifications, userNotificationPreferences } from "#app/db/schema/index.js";

export type NotificationFrequency = typeof userNotificationPreferences.$inferSelect["frequency"];
export type NotificationChannel = typeof notifications.$inferSelect["channel"];
export type NotificationVerb = typeof notifications.$inferSelect["verb"];

export type UserNotificationPreferences = typeof userNotificationPreferences.$inferSelect;
export type Notification = typeof notifications.$inferSelect;

export interface CreateNotificationDto {
  recipientId: string;
  actorId?: string | null;
  verb: NotificationVerb;
  targetType?: string;
  targetId?: string;
  channel?: NotificationChannel;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

export interface UpdateNotificationPreferencesDto {
  frequency?: NotificationFrequency;
  in_app_enabled?: boolean;
  email_enabled?: boolean;
  sms_enabled?: boolean;
  whatsapp_enabled?: boolean;
  booking_enabled?: boolean;
  inquiry_enabled?: boolean;
  hire_request_enabled?: boolean;
  social_enabled?: boolean;
  message_enabled?: boolean;
  system_enabled?: boolean;
}
