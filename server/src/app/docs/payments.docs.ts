/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Paystack payment operations
 */

/**
 * @swagger
 * /payments/plans:
 *   post:
 *     summary: Create a Paystack subscription plan
 *     description: Creates a new subscription plan on Paystack and saves it to the database.
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - interval
 *               - amount
 *             properties:
 *               name:
 *                 type: string
 *                 example: Premium Plan
 *                 description: Plan name
 *               description:
 *                 type: object
 *                 description: Flexible JSON object describing the plan features
 *                 example:
 *                   features:
 *                     - Access to premium content
 *                     - Priority support
 *                     - No ads
 *               interval:
 *                 type: string
 *                 enum: [daily, weekly, monthly, annually]
 *                 example: monthly
 *                 description: Billing interval
 *               amount:
 *                 type: number
 *                 example: 100
 *                 description: Plan amount in base units
 *               amountSaved:
 *                 type: number
 *                 example: 20
 *                 description: Optional amount saved compared to standard pricing
 *     responses:
 *       201:
 *         description: Plan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /payments/plans:
 *   get:
 *     summary: Get all subscription plans
 *     description: Retrieves all available subscription plans from the database.
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Plans retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /payments/initialize:
 *   post:
 *     summary: Initialize a Paystack transaction
 *     description: Creates a payment initialization request and returns Paystack authorization URL.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - amount
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *                 description: Customer email address
 *               amount:
 *                 type: number
 *                 example: 5000
 *                 description: Transaction amount in base units
 *               metadata:
 *                 type: object
 *                 description: Optional metadata as JSON string
 *                 example:
 *                   user_id: 1234
 *                   reason: subscription_payment
 *               currency:
 *                 type: string
 *                 example: GHS
 *                 description: Currency to use, e.g GHS, USD, NGN
 *               channels:
*                  type: array
*                  items:
*                      type: string
*                  example:
*                      - card
*                      - bank
*                      - apple_pay
*                      - ussd
*                      - qr
*                      - mobile_money
*                      - bank_transfer
*                      - eft
*                      - capitec_pay
*                      - payattitude
*                  description: Transaction channels allowed for payment
 *     responses:
 *       200:
 *         description: Transaction initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     authorization_url:
 *                       type: string
 *                       example: https://checkout.paystack.com/xxx
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /payments/verify/{reference}:
 *   get:
 *     summary: Verify Paystack payment
 *     description: Verifies a payment transaction using the Paystack reference.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *         example: ref_xxxxxxxx
 *         description: Paystack transaction reference
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /payments/subscribe:
 *   post:
 *     summary: Subscribe customer to a Paystack plan
 *     description: Subscribes a customer to an existing subscription plan on Paystack.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planCode
 *             properties:
 *               planCode:
 *                 type: string
 *                 example: PLN_xxxxxxxx
 *                 description: Paystack plan code
 *               authorization:
 *                 type: string
 *                 example: AUTH_xxxxxxxx
 *                 description: Optional authorization code for subscription
 *     responses:
 *       200:
 *         description: Subscription created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /payments/mobile-money/initiate:
 *   post:
 *     summary: Initiate MoMo payment for a pickup
 *     description: |
 *       Starts a Paystack mobile-money charge for a pickup request.
 *       On webhook success the request is marked **paid** and a ledger entry is created.
 *       The mobile app polls `GET /payments/status/{reference}` until success.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - phone
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 20
 *                 description: Amount in GHS
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *                 example: "0241234567"
 *               provider:
 *                 type: string
 *                 enum: [mtn, telecel, airtel]
 *                 default: mtn
 *               requestId:
 *                 type: string
 *                 format: uuid
 *                 description: Pickup request being paid for
 *               clientInitiated:
 *                 type: boolean
 *                 default: false
 *                 description: When true, reserves a pending transaction for in-app Paystack WebView checkout without server-side MoMo charge
 *               payment_method:
 *                 type: string
 *                 enum: [mobile_money, card]
 *                 default: mobile_money
 *     responses:
 *       200:
 *         description: Payment initiated — customer receives MoMo prompt
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Request not found
 */

/**
 * @swagger
 * /payments/status/{reference}:
 *   get:
 *     summary: Poll payment status
 *     description: |
 *       Returns pending, success, or failed for a Paystack reference.
 *       Verifies with Paystack when still pending and processes wallet credit or request payment.
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
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       enum: [pending, success, failed]
 *                     reference:
 *                       type: string
 *                     amount:
 *                       type: number
 *       404:
 *         description: Transaction not found
 */

/**
 * @swagger
 * /payments/webhook:
 *   post:
 *     summary: Paystack webhook
 *     description: |
 *       Receives Paystack charge and subscription events. Idempotent — duplicate events are ignored.
 *       Handles wallet deposits, pickup payments, and subscription lifecycle
 *       (`subscription.create`, `subscription.disable`, `invoice.payment_failed`).
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Paystack event payload
 *     responses:
 *       200:
 *         description: Webhook processed
 *       400:
 *         description: Invalid signature or payload
 */

/**
 * @swagger
 * /payments/wallet/pay:
 *   post:
 *     summary: Pay for pickup with Zubba wallet
 *     description: Debits wallet balance and marks the request as **paid**.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - requestId
 *             properties:
 *               requestId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Payment successful
 *       400:
 *         description: Insufficient balance
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Request not found
 */

/**
 * @swagger
 * /payments/cash/confirm:
 *   post:
 *     summary: Confirm cash payment
 *     description: Marks a pickup request as **paid** with payment_method cash.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - requestId
 *             properties:
 *               requestId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Cash payment recorded
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Request not found
 */

/**
 * @swagger
 * /payments/transaction/{reference}:
 *   get:
 *     summary: Get transaction details
 *     description: Returns stored transaction record for the authenticated user.
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
 *         description: Transaction details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 */

/**
 * @swagger
 * /payments/subscriptions/initiate:
 *   post:
 *     summary: Initiate Paystack subscription checkout
 *     description: Creates a pending payment transaction and returns a Paystack reference for in-app checkout.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planCode
 *             properties:
 *               planCode:
 *                 type: string
 *               channel:
 *                 type: string
 *     responses:
 *       200:
 *         description: Checkout reference created
 *       400:
 *         description: Validation error or unknown plan
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /payments/subscriptions/activate:
 *   post:
 *     summary: Activate Paystack subscription after payment
 *     description: Verifies payment, creates Paystack subscription, and sets is_premium on the customer.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reference
 *               - planCode
 *             properties:
 *               reference:
 *                 type: string
 *               planCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subscription activated
 *       400:
 *         description: Payment not verified or invalid plan
 *       401:
 *         description: Unauthorized
 */