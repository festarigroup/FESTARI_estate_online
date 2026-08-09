import { Router } from "express";
import { updatePreferencesSchema } from "#app/validators/notificationValidator.js";
import { validateSchema } from "#app/middlewares/validate.js";
import { protect } from "#app/middlewares/auth.js";
import {
  getPreferences,
  updatePreferences,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} from "#app/controllers/notificationsController.js";

const router = Router();

router.use(protect);

router.get("/preferences", getPreferences);
router.put("/preferences", validateSchema(updatePreferencesSchema), updatePreferences);

router.get("/", getNotifications);
router.get("/unread-count", getUnreadCount);
router.put("/:id/read", markAsRead);
router.put("/read-all", markAllAsRead);
router.delete("/clear-all", clearAllNotifications);
router.delete("/:id", deleteNotification);

export default router;
