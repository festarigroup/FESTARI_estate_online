import { Request, Response } from "express";
import { asyncErrorHandler } from "#app/utils/asyncErrorHandler.js";
import CustomError from "#app/utils/CustomError.js";
import notificationsService from "#app/services/notificationsService.js";
import { requiredRouteParam } from "#app/utils/routeParams.js";

export const getPreferences = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const preferences = await notificationsService.getPreferences(req.user.id);
  return res.status(200).json({ success: true, data: preferences });
});

export const updatePreferences = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const preferences = await notificationsService.updatePreferences(req.user.id, req.body);
  return res.status(200).json({
    success: true,
    data: preferences,
    message: "Preferences updated successfully",
  });
});

export const getNotifications = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = parseInt(req.query.offset as string) || 0;

  const [notifications, unreadCount] = await Promise.all([
    notificationsService.getUserNotifications(req.user.id, limit, offset),
    notificationsService.getUnreadCount(req.user.id),
  ]);

  return res.status(200).json({
    success: true,
    data: { notifications, unreadCount, pagination: { limit, offset, total: notifications.length } },
  });
});

export const getUnreadCount = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const count = await notificationsService.getUnreadCount(req.user.id);
  return res.status(200).json({ success: true, data: { count } });
});

export const markAsRead = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");
  const notification = await notificationsService.markAsRead(id, req.user.id);
  return res.status(200).json({ success: true, data: notification, message: "Notification marked as read" });
});

export const markAllAsRead = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  await notificationsService.markAllAsRead(req.user.id);
  return res.status(200).json({ success: true, message: "All notifications marked as read" });
});

export const deleteNotification = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");
  await notificationsService.deleteNotification(id, req.user.id);
  return res.status(200).json({ success: true, message: "Notification deleted successfully" });
});

export const clearAllNotifications = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  await notificationsService.clearAllNotifications(req.user.id);
  return res.status(200).json({ success: true, message: "All notifications cleared successfully" });
});
