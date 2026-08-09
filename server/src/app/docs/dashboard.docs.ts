/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Admin-only analytics and moderation queue — every endpoint requires the admin role
 */

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Platform statistics
 *     description: User/property/hotel/artisan counts, active subscriptions, revenue by payment type.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Platform stats
 *       403:
 *         description: Admin only
 */

/**
 * @swagger
 * /dashboard/recent-activity:
 *   get:
 *     summary: Recent platform activity
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent activity feed
 *       403:
 *         description: Admin only
 */

/**
 * @swagger
 * /dashboard/pending-approvals:
 *   get:
 *     summary: Items pending moderation
 *     description: Properties, hotels, and artisan profiles with `status = pending`.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending items
 *       403:
 *         description: Admin only
 */
