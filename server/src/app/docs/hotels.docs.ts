/**
 * @swagger
 * tags:
 *   name: Hotels
 *   description: Hotel listings, images, and bookings
 */

/**
 * @swagger
 * /hotels:
 *   get:
 *     summary: List hotels
 *     tags: [Hotels]
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated hotel list
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
 *                         $ref: '#/components/schemas/Hotel'
 *   post:
 *     summary: Create a hotel listing
 *     description: Gated by the caller's subscription `max_hotels` limit. Starts `status = pending`.
 *     tags: [Hotels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, location, price_per_night]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               amenities:
 *                 type: object
 *               price_per_night:
 *                 type: number
 *     responses:
 *       201:
 *         description: Hotel created
 *       403:
 *         description: Subscription plan hotel limit reached
 */

/**
 * @swagger
 * /hotels/bookings/me:
 *   get:
 *     summary: List the current user's bookings
 *     tags: [Hotels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bookings made by the current user
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
 *                     $ref: '#/components/schemas/HotelBooking'
 */

/**
 * @swagger
 * /hotels/bookings/{id}:
 *   get:
 *     summary: Get a booking
 *     description: Booker, hotel owner, or admin.
 *     tags: [Hotels]
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
 *         description: Booking details
 *       403:
 *         description: Not the booker, hotel owner, or admin
 *       404:
 *         description: Booking not found
 *   put:
 *     summary: Update a booking's status
 *     description: Hotel owner or admin.
 *     tags: [Hotels]
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
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled, completed]
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Cancel a booking
 *     description: Booker or admin.
 *     tags: [Hotels]
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
 *         description: Cancelled
 */

/**
 * @swagger
 * /hotels/{id}:
 *   get:
 *     summary: Get a hotel by id
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Hotel details
 *       404:
 *         description: Hotel not found
 *   put:
 *     summary: Update a hotel
 *     description: Owner or admin.
 *     tags: [Hotels]
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
 *     summary: Delete a hotel
 *     description: Owner or admin.
 *     tags: [Hotels]
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
 * /hotels/{id}/approve:
 *   put:
 *     summary: Approve a hotel listing
 *     tags: [Hotels]
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
 * /hotels/{id}/reject:
 *   put:
 *     summary: Reject a hotel listing
 *     tags: [Hotels]
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
 * /hotels/{id}/images:
 *   post:
 *     summary: Upload a hotel image
 *     tags: [Hotels]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               position:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Image uploaded
 */

/**
 * @swagger
 * /hotels/{id}/images/{imageId}:
 *   delete:
 *     summary: Delete a hotel image
 *     tags: [Hotels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: imageId
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
 * /hotels/{hotelId}/bookings:
 *   get:
 *     summary: List a hotel's bookings
 *     description: Hotel owner or admin.
 *     tags: [Hotels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Bookings for this hotel
 *   post:
 *     summary: Create a booking
 *     description: Total price is computed server-side from nights × the hotel's `price_per_night` — never sent by the client.
 *     tags: [Hotels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hotelId
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
 *             required: [check_in, check_out]
 *             properties:
 *               check_in:
 *                 type: string
 *                 format: date
 *               check_out:
 *                 type: string
 *                 format: date
 *               guests:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       201:
 *         description: Booking created — notifies the hotel owner
 *       400:
 *         description: check_out must be after check_in
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Hotel:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         owner_id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         location:
 *           type: string
 *         amenities:
 *           type: object
 *           nullable: true
 *         price_per_night:
 *           type: string
 *           description: decimal
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         created_at:
 *           type: string
 *           format: date-time
 *     HotelBooking:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         hotel_id:
 *           type: string
 *           format: uuid
 *         user_id:
 *           type: string
 *           format: uuid
 *         check_in:
 *           type: string
 *           format: date
 *         check_out:
 *           type: string
 *           format: date
 *         guests:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *         total_price:
 *           type: string
 *           description: decimal, computed server-side
 *         created_at:
 *           type: string
 *           format: date-time
 */
