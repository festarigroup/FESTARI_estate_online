/**
 * @swagger
 * tags:
 *   name: Properties
 *   description: Real-estate listings, images, categories, trending, and wishlists
 */

/**
 * @swagger
 * /properties:
 *   get:
 *     summary: List properties
 *     description: Public — only `approved` listings are returned.
 *     tags: [Properties]
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: property_type
 *         schema:
 *           type: string
 *           enum: [land, home, apartment, office]
 *       - in: query
 *         name: listing_type
 *         schema:
 *           type: string
 *           enum: [for_sale, for_rent, short_stay]
 *       - in: query
 *         name: min_price
 *         schema:
 *           type: number
 *       - in: query
 *         name: max_price
 *         schema:
 *           type: number
 *       - in: query
 *         name: bedrooms
 *         schema:
 *           type: integer
 *       - in: query
 *         name: ordering
 *         schema:
 *           type: string
 *           example: -created_at
 *     responses:
 *       200:
 *         description: Paginated property list
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
 *                         $ref: '#/components/schemas/Property'
 *                     metadata:
 *                       type: object
 *   post:
 *     summary: Create a property listing
 *     description: Gated by the caller's subscription `max_properties` limit. Starts `status = pending`.
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, price, location, listing_type, property_type]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               location:
 *                 type: string
 *               listing_type:
 *                 type: string
 *                 enum: [for_sale, for_rent, short_stay]
 *               property_type:
 *                 type: string
 *                 enum: [land, home, apartment, office]
 *               bedrooms:
 *                 type: integer
 *               bathrooms:
 *                 type: integer
 *               area_sqm:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Property created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Property'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Subscription plan property limit reached
 */

/**
 * @swagger
 * /properties/categories:
 *   get:
 *     summary: Category counts for the "Explore by Category" grid
 *     tags: [Properties]
 *     responses:
 *       200:
 *         description: Counts per listing_type
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       label:
 *                         type: string
 *                       count:
 *                         type: integer
 */

/**
 * @swagger
 * /properties/trending:
 *   get:
 *     summary: Trending properties
 *     description: Ranked by `is_featured` then `views_count`.
 *     tags: [Properties]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 2
 *     responses:
 *       200:
 *         description: Trending properties
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
 *                     $ref: '#/components/schemas/Property'
 */

/**
 * @swagger
 * /properties/wishlist:
 *   get:
 *     summary: List the current user's wishlisted properties
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlisted properties
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
 *                     $ref: '#/components/schemas/Property'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /properties/{id}:
 *   get:
 *     summary: Get a property by id
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Property details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Property'
 *       404:
 *         description: Property not found
 *   put:
 *     summary: Update a property
 *     description: Owner or admin only.
 *     tags: [Properties]
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
 *             description: Same fields as create, all optional
 *     responses:
 *       200:
 *         description: Updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not the owner
 *       404:
 *         description: Property not found
 *   delete:
 *     summary: Delete a property
 *     description: Owner or admin only.
 *     tags: [Properties]
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not the owner
 */

/**
 * @swagger
 * /properties/{id}/approve:
 *   put:
 *     summary: Approve a property listing
 *     tags: [Properties]
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
 * /properties/{id}/reject:
 *   put:
 *     summary: Reject a property listing
 *     tags: [Properties]
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
 * /properties/{id}/images:
 *   post:
 *     summary: Upload a property image
 *     description: Gated by the caller's subscription `max_images` limit.
 *     tags: [Properties]
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
 *       403:
 *         description: Image limit reached for the caller's plan
 */

/**
 * @swagger
 * /properties/{id}/images/{imageId}:
 *   delete:
 *     summary: Delete a property image
 *     tags: [Properties]
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
 * /properties/{id}/wishlist:
 *   post:
 *     summary: Add a property to the wishlist
 *     tags: [Properties]
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
 *       201:
 *         description: Added
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Remove a property from the wishlist
 *     tags: [Properties]
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
 *         description: Removed
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Property:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         owner_id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         price:
 *           type: string
 *           description: decimal
 *         location:
 *           type: string
 *         listing_type:
 *           type: string
 *           enum: [for_sale, for_rent, short_stay]
 *         property_type:
 *           type: string
 *           enum: [land, home, apartment, office]
 *         bedrooms:
 *           type: integer
 *           nullable: true
 *         bathrooms:
 *           type: integer
 *           nullable: true
 *         area_sqm:
 *           type: integer
 *           nullable: true
 *         is_featured:
 *           type: boolean
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         views_count:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 */
