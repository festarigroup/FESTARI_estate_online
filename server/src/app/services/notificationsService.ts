import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "#app/db/db.js";
import { notifications, userNotificationPreferences } from "#app/db/schema/index.js";
import {
  CreateNotificationDto,
  Notification,
  UpdateNotificationPreferencesDto,
  UserNotificationPreferences,
} from "#app/types/NotificationTypes.js";
import CustomError from "#app/utils/CustomError.js";

class NotificationsService {
  async getPreferences(userId: string): Promise<UserNotificationPreferences | null> {
    const [preferences] = await db
      .select()
      .from(userNotificationPreferences)
      .where(eq(userNotificationPreferences.user_id, userId));
    return preferences ?? null;
  }

  async updatePreferences(
    userId: string,
    data: UpdateNotificationPreferencesDto,
  ): Promise<UserNotificationPreferences> {
    const existing = await this.getPreferences(userId);

    if (existing) {
      const [updated] = await db
        .update(userNotificationPreferences)
        .set({ ...data, updated_at: new Date() })
        .where(eq(userNotificationPreferences.user_id, userId))
        .returning();
      if (!updated) throw new CustomError("Failed to update notification preferences", 500);
      return updated;
    }

    const [created] = await db
      .insert(userNotificationPreferences)
      .values({ user_id: userId, ...data })
      .returning();
    if (!created) throw new CustomError("Failed to create notification preferences", 500);
    return created;
  }

  async notify(data: CreateNotificationDto): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values({
        recipient_id: data.recipientId,
        actor_id: data.actorId ?? null,
        verb: data.verb,
        target_type: data.targetType,
        target_id: data.targetId,
        channel: data.channel ?? "in_app",
        title: data.title,
        body: data.body,
        data: data.data ?? null,
        sent_at: new Date(),
      })
      .returning();

    if (!notification) throw new CustomError("Failed to create notification", 500);
    return notification;
  }

  async getUserNotifications(userId: string, limit = 50, offset = 0): Promise<Notification[]> {
    return db
      .select()
      .from(notifications)
      .where(eq(notifications.recipient_id, userId))
      .orderBy(desc(notifications.created_at))
      .limit(limit)
      .offset(offset);
  }

  async getUnreadCount(userId: string): Promise<number> {
    const [result] = await db
      .select({ count: sql`count(*)` })
      .from(notifications)
      .where(and(eq(notifications.recipient_id, userId), eq(notifications.is_read, false)));
    return Number(result?.count ?? 0);
  }

  async markAsRead(notificationId: string, userId: string): Promise<Notification> {
    const [notification] = await db
      .update(notifications)
      .set({ is_read: true, read_at: new Date() })
      .where(and(eq(notifications.id, notificationId), eq(notifications.recipient_id, userId)))
      .returning();
    if (!notification) throw new CustomError("Notification not found", 404);
    return notification;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await db
      .update(notifications)
      .set({ is_read: true, read_at: new Date() })
      .where(and(eq(notifications.recipient_id, userId), eq(notifications.is_read, false)));
  }

  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    await db
      .delete(notifications)
      .where(and(eq(notifications.id, notificationId), eq(notifications.recipient_id, userId)));
  }

  async clearAllNotifications(userId: string): Promise<void> {
    await db.delete(notifications).where(eq(notifications.recipient_id, userId));
  }
}

const notificationsService = new NotificationsService();
export default notificationsService;
