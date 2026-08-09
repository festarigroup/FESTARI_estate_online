/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: |
 *     In-app notifications and delivery preferences. One unified table backs
 *     every notification kind — likes, comments, follows, bookings,
 *     inquiries, hire requests, messages, and system notices — distinguished
 *     by `verb` and a decoupled `target_type`/`target_id` pair.
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: List notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Notifications list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     notifications:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           actor_id:
 *                             type: string
 *                             format: uuid
 *                             nullable: true
 *                           verb:
 *                             type: string
 *                             enum: [like, comment, follow, booking, inquiry, hire_request, message, system]
 *                           target_type:
 *                             type: string
 *                             nullable: true
 *                             example: post
 *                           target_id:
 *                             type: string
 *                             format: uuid
 *                             nullable: true
 *                           title:
 *                             type: string
 *                           body:
 *                             type: string
 *                           is_read:
 *                             type: boolean
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                     unreadCount:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /notifications/unread-count:
 *   get:
 *     summary: Get unread notification count
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /notifications/{id}/read:
 *   put:
 *     summary: Mark one notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Notification marked read
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notification not found
 */

/**
 * @swagger
 * /notifications/read-all:
 *   put:
 *     summary: Mark every notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked read
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Notification deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notification not found
 */

/**
 * @swagger
 * /notifications/clear-all:
 *   delete:
 *     summary: Delete every notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications cleared
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /notifications/preferences:
 *   get:
 *     summary: Get notification preferences
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Preferences for the current user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificationPreferences'
 *       401:
 *         description: Unauthorized
 *   put:
 *     summary: Update notification preferences
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotificationPreferences'
 *     responses:
 *       200:
 *         description: Preferences updated
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     NotificationPreferences:
 *       type: object
 *       properties:
 *         frequency:
 *           type: string
 *           enum: [daily, weekly, monthly, never]
 *         in_app_enabled:
 *           type: boolean
 *         email_enabled:
 *           type: boolean
 *         sms_enabled:
 *           type: boolean
 *         whatsapp_enabled:
 *           type: boolean
 *         booking_enabled:
 *           type: boolean
 *         inquiry_enabled:
 *           type: boolean
 *         hire_request_enabled:
 *           type: boolean
 *         social_enabled:
 *           type: boolean
 *         message_enabled:
 *           type: boolean
 *         system_enabled:
 *           type: boolean
 */
