/**
 * @swagger
 * tags:
 *   name: Messaging
 *   description: |
 *     1:1 conversations — every endpoint requires authentication. REST +
 *     client polling only, no real-time/WebSocket delivery.
 */

/**
 * @swagger
 * /messages/conversations:
 *   get:
 *     summary: List conversations
 *     description: Most recently active first.
 *     tags: [Messaging]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Conversations
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
 *                     $ref: '#/components/schemas/Conversation'
 *   post:
 *     summary: Start (or find) a 1:1 conversation
 *     description: Idempotent — returns the existing conversation if one already exists with `participant_id`.
 *     tags: [Messaging]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [participant_id]
 *             properties:
 *               participant_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Existing conversation returned
 *       201:
 *         description: Conversation created
 */

/**
 * @swagger
 * /messages/conversations/{id}:
 *   get:
 *     summary: Get a conversation with its messages
 *     tags: [Messaging]
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
 *         description: Conversation with paginated messages
 *       403:
 *         description: Not a participant
 *       404:
 *         description: Conversation not found
 */

/**
 * @swagger
 * /messages/conversations/{id}/messages:
 *   post:
 *     summary: Send a message
 *     tags: [Messaging]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [body]
 *             properties:
 *               body:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent — notifies the other participant
 */

/**
 * @swagger
 * /messages/unread-count:
 *   get:
 *     summary: Unread message count
 *     description: Polled for the header/sidebar badge.
 *     tags: [Messaging]
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
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Conversation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         participants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PublicUser'
 *         messages:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               sender_id:
 *                 type: string
 *                 format: uuid
 *               body:
 *                 type: string
 *               is_read:
 *                 type: boolean
 *               created_at:
 *                 type: string
 *                 format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */
