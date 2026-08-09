import { Request, Response } from 'express';
import { asyncErrorHandler } from '../utils/asyncErrorHandler';
import CustomError from '#app/utils/CustomError.js';
import { notificationSettingsService } from '#app/services/notificationSettingsService.js';

export class NotificationController {
  getPreferences = asyncErrorHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new CustomError('Unauthorized', 401);

    const preferences = await notificationSettingsService.getPreferences(userId);
    return res.status(200).json({
      success: true,
      data: preferences,
    });
  });

  updatePreferences = asyncErrorHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new CustomError('Unauthorized', 401);

    const preferences = await notificationSettingsService.updatePreferences(userId, req.body);
    return res.status(200).json({
      success: true,
      data: preferences,
      message: 'Preferences updated successfully',
    });
  });

  getNotifications = asyncErrorHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new CustomError('Unauthorized', 401);

    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const notifications = await notificationSettingsService.getUserNotifications(
      userId,
      limit,
      offset
    );

    const unreadCount = await notificationSettingsService.getUnreadCount(userId);

    return res.status(200).json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          limit,
          offset,
          total: notifications.length,
        },
      },
    });
  });

  getUnreadCount = asyncErrorHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new CustomError('Unauthorized', 401);

    const count = await notificationSettingsService.getUnreadCount(userId);
    return res.status(200).json({
      success: true,
      data: { unreadCount: count },
    });
  });

  markAsRead = asyncErrorHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new CustomError('Unauthorized', 401);

    const notificationId = req.params.id as string;
    if (!notificationId) throw new CustomError('Notification ID is required', 400);

    const notification = await notificationSettingsService.markAsRead(notificationId, userId);
    return res.status(200).json({
      success: true,
      data: notification,
      message: 'Notification marked as read',
    });
  });

  markAllAsRead = asyncErrorHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new CustomError('Unauthorized', 401);

    await notificationSettingsService.markAllAsRead(userId);
    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  });

  deleteNotification = asyncErrorHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new CustomError('Unauthorized', 401);

    const notificationId = req.params.id as string;
    if (!notificationId) throw new CustomError('Notification ID is required', 400);

    await notificationSettingsService.deleteNotification(notificationId, userId);
    return res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
    });
  });

  clearAllNotifications = asyncErrorHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new CustomError('Unauthorized', 401);

    await notificationSettingsService.clearAllNotifications(userId);
    return res.status(200).json({
      success: true,
      message: 'All notifications cleared successfully',
    });
  });
}