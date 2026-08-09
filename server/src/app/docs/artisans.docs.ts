/**
 * @swagger
 * tags:
 *   name: Artisans
 *   description: Artisan profiles, hire requests, and reviews
 */

/**
 * @swagger
 * /artisans:
 *   get:
 *     summary: List artisans
 *     tags: [Artisans]
 *     parameters:
 *       - in: query
 *         name: service_type
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated artisan list
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
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ArtisanProfile'
 *   post:
 *     summary: Create the caller's artisan profile
 *     description: One profile per account — `artisan_profiles.id` is the owning user's id. Starts `status = pending`.
 *     tags: [Artisans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [service_type]
 *             properties:
 *               service_type:
 *                 type: string
 *                 example: plumbing
 *               bio:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Profile created
 *       409:
 *         description: Profile already exists for this account
 */

/**
 * @swagger
 * /artisans/top:
 *   get:
 *     summary: Top artisans by rating
 *     description: Ordered by `-average_rating`, computed from `artisan_reviews` at query time.
 *     tags: [Artisans]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 4
 *     responses:
 *       200:
 *         description: Top-rated artisans
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
 *                     $ref: '#/components/schemas/ArtisanProfile'
 */

/**
 * @swagger
 * /artisans/hire-requests/me:
 *   get:
 *     summary: List hire requests the caller has sent
 *     tags: [Artisans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hire requests sent by the current user
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
 *                     $ref: '#/components/schemas/ArtisanHireRequest'
 */

/**
 * @swagger
 * /artisans/{id}:
 *   get:
 *     summary: Get an artisan profile
 *     description: Includes computed `average_rating`, `review_count`, and the review list.
 *     tags: [Artisans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Artisan profile
 *       404:
 *         description: Profile not found
 *   put:
 *     summary: Update an artisan profile
 *     description: Owner or admin.
 *     tags: [Artisans]
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
 *         description: Updated
 *   delete:
 *     summary: Delete an artisan profile
 *     description: Owner or admin.
 *     tags: [Artisans]
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
 */

/**
 * @swagger
 * /artisans/{id}/approve:
 *   put:
 *     summary: Approve an artisan profile
 *     tags: [Artisans]
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
 *         description: Approved
 *       403:
 *         description: Admin only
 */

/**
 * @swagger
 * /artisans/{id}/reject:
 *   put:
 *     summary: Reject an artisan profile
 *     tags: [Artisans]
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
 *         description: Rejected
 *       403:
 *         description: Admin only
 */

/**
 * @swagger
 * /artisans/{id}/hire:
 *   post:
 *     summary: Send a hire request
 *     description: |
 *       Free request — no payment is collected here. Notifies the artisan.
 *       Payment, if any, is a follow-up action after the artisan accepts
 *       (via `POST /payments/initiate` with `payment_type: artisan_hire`).
 *     tags: [Artisans]
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
 *             required: [message]
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Hire request sent
 *       404:
 *         description: Artisan not found
 */

/**
 * @swagger
 * /artisans/{id}/hire-requests:
 *   get:
 *     summary: List hire requests received by an artisan
 *     description: Artisan or admin.
 *     tags: [Artisans]
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
 *         description: Hire requests for this artisan
 */

/**
 * @swagger
 * /artisans/hire-requests/{id}:
 *   put:
 *     summary: Update a hire request's status
 *     description: Artisan or admin.
 *     tags: [Artisans]
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
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [accepted, rejected, completed]
 *     responses:
 *       200:
 *         description: Updated
 */

/**
 * @swagger
 * /artisans/{id}/reviews:
 *   post:
 *     summary: Leave a review
 *     tags: [Artisans]
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
 *             required: [rating]
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ArtisanProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Same as the owning user's id
 *         service_type:
 *           type: string
 *         bio:
 *           type: string
 *           nullable: true
 *         location:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         average_rating:
 *           type: number
 *           nullable: true
 *         review_count:
 *           type: integer
 *     ArtisanHireRequest:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         artisan_id:
 *           type: string
 *           format: uuid
 *         requester_id:
 *           type: string
 *           format: uuid
 *         message:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, accepted, rejected, completed]
 *         created_at:
 *           type: string
 *           format: date-time
 */
