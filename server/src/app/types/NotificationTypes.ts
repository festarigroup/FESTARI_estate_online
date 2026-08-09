import { notifications, userNotificationPreferences } from '#app/db/schema.js';

export type NotificationFrequency = typeof userNotificationPreferences.$inferSelect['frequency'];
export type NotificationChannel = typeof notifications.$inferSelect['channel'];
export type NotificationType = typeof notifications.$inferSelect['type'];
export type NotificationStatus = typeof notifications.$inferSelect['status'];

export type UserNotificationPreferences = typeof userNotificationPreferences.$inferSelect;
export type Notification = typeof notifications.$inferSelect;

export interface CreateNotificationDto {
  userId: string;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

export interface UpdateNotificationPreferencesDto {
  frequency?: NotificationFrequency;
  inAppEnabled?: boolean;
  emailEnabled?: boolean;
  smsEnabled?: boolean;
  whatsappEnabled?: boolean;
  walletEnabled?: boolean;
  rewardsEnabled?: boolean;
  subscriptionEnabled?: boolean;
  scheduledPickupsEnabled?: boolean;
  arrivalPickupsEnabled?: boolean;
}
