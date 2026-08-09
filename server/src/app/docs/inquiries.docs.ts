/**
 * @swagger
 * tags:
 *   name: Inquiries
 *   description: Contact forms for property and artisan interest, mounted under /common
 */

/**
 * @swagger
 * /common/property-inquiries:
 *   post:
 *     summary: Send a property inquiry
 *     description: No account required — `user_id` is attached automatically when the caller is signed in. Notifies the property owner.
 *     tags: [Inquiries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [property_id, name, email, message]
 *             properties:
 *               property_id:
 *                 type: string
 *                 format: uuid
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Inquiry sent
 *       404:
 *         description: Property not found
 *   get:
 *     summary: List property inquiries
 *     description: Property owner or admin.
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: property_id
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Inquiries
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
 *                     $ref: '#/components/schemas/PropertyInquiry'
 */

/**
 * @swagger
 * /common/property-inquiries/{id}:
 *   get:
 *     summary: Get a property inquiry
 *     tags: [Inquiries]
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
 *         description: Inquiry details
 *   delete:
 *     summary: Delete a property inquiry
 *     tags: [Inquiries]
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
 *         description: Deleted
 *       403:
 *         description: Admin only
 */

/**
 * @swagger
 * /common/property-inquiries/{id}/mark-read:
 *   put:
 *     summary: Mark a property inquiry as read
 *     tags: [Inquiries]
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
 *         description: Marked read
 */

/**
 * @swagger
 * /common/artisan-inquiries:
 *   post:
 *     summary: Send an artisan inquiry
 *     description: No account required. Notifies the artisan.
 *     tags: [Inquiries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [artisan_id, name, email, message]
 *             properties:
 *               artisan_id:
 *                 type: string
 *                 format: uuid
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Inquiry sent
 *   get:
 *     summary: List artisan inquiries
 *     description: Artisan or admin.
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: artisan_id
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Inquiries
 */

/**
 * @swagger
 * /common/artisan-inquiries/{id}:
 *   get:
 *     summary: Get an artisan inquiry
 *     tags: [Inquiries]
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
 *         description: Inquiry details
 *   delete:
 *     summary: Delete an artisan inquiry
 *     tags: [Inquiries]
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
 *         description: Deleted
 *       403:
 *         description: Admin only
 */

/**
 * @swagger
 * /common/artisan-inquiries/{id}/mark-read:
 *   put:
 *     summary: Mark an artisan inquiry as read
 *     tags: [Inquiries]
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
 *         description: Marked read
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PropertyInquiry:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         property_id:
 *           type: string
 *           format: uuid
 *         user_id:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *           nullable: true
 *         message:
 *           type: string
 *         is_read:
 *           type: boolean
 *         created_at:
 *           type: string
 *           format: date-time
 */
