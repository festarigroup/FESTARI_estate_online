/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: |
 *     Paystack payments. One generic table/flow serves every payable action
 *     on the platform (subscriptions, property purchases, hotel bookings,
 *     artisan hires), discriminated by `payment_type` — there is no wallet
 *     or stored balance anywhere in this backend.
 */

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: List the current user's payments
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment history
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
 *                     $ref: '#/components/schemas/Payment'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /payments/initiate:
 *   post:
 *     summary: Initiate a payment
 *     description: Creates a pending payment record and returns a Paystack authorization URL to redirect the user to.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [payment_type, amount]
 *             properties:
 *               payment_type:
 *                 type: string
 *                 enum: [subscription, property, hotel_booking, artisan_hire]
 *               target_id:
 *                 type: string
 *                 format: uuid
 *                 description: id of the subscription/property/booking/hire request this payment is for
 *               amount:
 *                 type: number
 *                 example: 5000
 *               metadata:
 *                 type: object
 *     responses:
 *       200:
 *         description: Payment initiated
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
 *                     reference:
 *                       type: string
 *                     authorization_url:
 *                       type: string
 *                       example: https://checkout.paystack.com/xxx
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /payments/verify/{reference}:
 *   get:
 *     summary: Verify a payment
 *     description: Verifies with Paystack and, on success, activates the associated subscription/booking/hire.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Payment'
 *       404:
 *         description: Payment not found
 */

/**
 * @swagger
 * /payments/{id}:
 *   get:
 *     summary: Get a payment by id
 *     tags: [Payments]
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
 *         description: Payment details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Payment'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 */

/**
 * @swagger
 * /payments/webhook:
 *   post:
 *     summary: Paystack webhook
 *     description: |
 *       Receives Paystack `charge.success`/`charge.failed` events. Verified by
 *       `X-Paystack-Signature`, not a bearer token. Deduplicated by event id
 *       (`paystack_webhook_events`) so a redelivered webhook is a no-op.
 *     tags: [Payments]
 *     parameters:
 *       - in: header
 *         name: X-Paystack-Signature
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Paystack event payload
 *     responses:
 *       200:
 *         description: Webhook processed (always 200 so Paystack doesn't retry)
 *       400:
 *         description: Invalid signature
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         user_id:
 *           type: string
 *           format: uuid
 *         payment_type:
 *           type: string
 *           enum: [subscription, property, hotel_booking, artisan_hire]
 *         target_id:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         amount:
 *           type: string
 *           description: decimal, e.g. "5000.00"
 *         reference:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, success, failed]
 *         provider:
 *           type: string
 *           example: paystack
 *         paid_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 */
