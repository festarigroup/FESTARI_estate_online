/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: |
 *     Paystack-billed subscription plans that also carry feature-gating
 *     limits (max_properties, max_hotels, max_images, max_videos,
 *     can_feature_properties). No Google Play billing — Paystack only.
 */

/**
 * @swagger
 * /subscriptions/plans:
 *   get:
 *     summary: List subscription plans
 *     tags: [Subscriptions]
 *     responses:
 *       200:
 *         description: Available plans
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SubscriptionPlan'
 *   post:
 *     summary: Create a subscription plan
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, interval, amount]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: object
 *                 description: Free-form JSON describing plan features
 *               interval:
 *                 type: string
 *                 enum: [monthly, yearly]
 *               amount:
 *                 type: number
 *               amountSaved:
 *                 type: number
 *               max_properties:
 *                 type: integer
 *               max_hotels:
 *                 type: integer
 *               max_images:
 *                 type: integer
 *               max_videos:
 *                 type: integer
 *               can_feature_properties:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Plan created
 *       403:
 *         description: Admin only
 */

/**
 * @swagger
 * /subscriptions/subscribe:
 *   post:
 *     summary: Subscribe to a plan
 *     description: Creates a pending subscription and a matching Paystack payment.
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [planCode]
 *             properties:
 *               planCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subscription initiated
 *       404:
 *         description: Unknown plan code
 */

/**
 * @swagger
 * /subscriptions/my-subscription:
 *   get:
 *     summary: Get the current user's active subscription
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active subscription, or null if none
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/UserSubscription'
 */

/**
 * @swagger
 * /subscriptions/cancel:
 *   put:
 *     summary: Cancel the current subscription
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cancelled
 *       404:
 *         description: No active subscription
 */

/**
 * @swagger
 * /subscriptions/history:
 *   get:
 *     summary: Subscription history
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Past subscriptions
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SubscriptionPlan:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: object
 *         interval:
 *           type: string
 *           enum: [monthly, yearly]
 *         amount:
 *           type: string
 *           description: decimal
 *         plan_code:
 *           type: string
 *         max_properties:
 *           type: integer
 *           nullable: true
 *         max_hotels:
 *           type: integer
 *           nullable: true
 *         max_images:
 *           type: integer
 *           nullable: true
 *         max_videos:
 *           type: integer
 *           nullable: true
 *         can_feature_properties:
 *           type: boolean
 *     UserSubscription:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         user_id:
 *           type: string
 *           format: uuid
 *         plan_code:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, active, cancelled, expired]
 *         started_at:
 *           type: string
 *           format: date-time
 *         expires_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 */
