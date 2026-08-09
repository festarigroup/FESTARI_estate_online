import { Router } from 'express';
import { updatePreferencesSchema } from '#app/validators/notificationValidator.js';
import { validateSchema } from '#app/middlewares/validate.js';
import { protect } from '#app/middlewares/auth.js';
import { NotificationController } from '#app/controllers/notificationsController.js';

const router = Router();
const notificationController = new NotificationController();

router.use(protect);

router.get('/preferences', notificationController.getPreferences);
router.put('/preferences', validateSchema(updatePreferencesSchema), notificationController.updatePreferences);

router.get('/', notificationController.getNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.put('/:id/read', notificationController.markAsRead);
router.put('/read-all', notificationController.markAllAsRead);
router.delete('/:id', notificationController.deleteNotification);
router.delete('/clear-all', notificationController.clearAllNotifications);

export default router;