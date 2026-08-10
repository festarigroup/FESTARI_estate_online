/**
 * @swagger
 * tags:
 *   name: Feed
 *   description: |
 *     Stories, posts, and post interactions (like/comment/share/save). See
 *     docs/home-feed-api-endpoints.md for the frontend-facing spec this
 *     mirrors.
 */

/**
 * @swagger
 * /feed/stories:
 *   get:
 *     summary: List active stories
 *     description: Non-expired (24h TTL) stories, most recent first.
 *     tags: [Feed]
 *     responses:
 *       200:
 *         description: Stories
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
 *                     $ref: '#/components/schemas/Story'
 *   post:
 *     summary: Create a story
 *     tags: [Feed]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [media]
 *             properties:
 *               media:
 *                 type: string
 *                 format: binary
 *                 description: Image or video, up to 20MB
 *               caption:
 *                 type: string
 *     responses:
 *       201:
 *         description: Story created
 */

/**
 * @swagger
 * /feed/stories/{id}:
 *   get:
 *     summary: Get a story
 *     tags: [Feed]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Story details
 *       404:
 *         description: Story not found or expired
 *   delete:
 *     summary: Delete a story
 *     description: Own story only.
 *     tags: [Feed]
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
 * /feed/stories/{id}/view:
 *   post:
 *     summary: Record a story view
 *     description: Deduplicated per viewer.
 *     tags: [Feed]
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
 *         description: View recorded
 */

/**
 * @swagger
 * /feed/posts:
 *   get:
 *     summary: List feed posts
 *     description: |
 *       Public, but personalized (`is_liked`/`is_saved`) when a token is
 *       sent. `property`-kind posts include `linked_property`,
 *       `service`-kind posts include `linked_artisan`, `venue`-kind posts
 *       include `linked_hotel` — all null when the post isn't backed by a
 *       real listing/profile/hotel.
 *     tags: [Feed]
 *     parameters:
 *       - in: query
 *         name: kind
 *         schema:
 *           type: string
 *           enum: [property, service, general, venue]
 *       - in: query
 *         name: current_page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Paginated posts
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
 *                         $ref: '#/components/schemas/Post'
 *                     metadata:
 *                       type: object
 *   post:
 *     summary: Create a post
 *     tags: [Feed]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [body]
 *             properties:
 *               kind:
 *                 type: string
 *                 enum: [property, service, general, venue]
 *                 default: general
 *               body:
 *                 type: string
 *               hashtags:
 *                 type: string
 *                 example: "#NewListing #EastLegon"
 *               linked_property_id:
 *                 type: string
 *                 format: uuid
 *               linked_artisan_id:
 *                 type: string
 *                 format: uuid
 *               linked_hotel_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Post created
 */

/**
 * @swagger
 * /feed/posts/{id}:
 *   get:
 *     summary: Get a post
 *     tags: [Feed]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Post with images and computed counts
 *       404:
 *         description: Post not found
 *   put:
 *     summary: Update a post
 *     description: Own post only.
 *     tags: [Feed]
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
 *               body:
 *                 type: string
 *               hashtags:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Delete a post
 *     description: Own post or admin.
 *     tags: [Feed]
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
 * /feed/posts/{id}/images:
 *   post:
 *     summary: Upload a post image
 *     tags: [Feed]
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
 * /feed/posts/{id}/like:
 *   post:
 *     summary: Like a post
 *     tags: [Feed]
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
 *         description: Liked
 *   delete:
 *     summary: Unlike a post
 *     tags: [Feed]
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
 *         description: Unliked
 */

/**
 * @swagger
 * /feed/posts/{id}/comments:
 *   get:
 *     summary: List a post's comments
 *     tags: [Feed]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: current_page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paginated comments
 *   post:
 *     summary: Add a comment
 *     tags: [Feed]
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
 *         description: Comment added — notifies the post author
 */

/**
 * @swagger
 * /feed/comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     description: Own comment or admin.
 *     tags: [Feed]
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
 * /feed/posts/{id}/share:
 *   post:
 *     summary: Record a share
 *     description: Repeatable — no dedup, unlike like/save.
 *     tags: [Feed]
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
 *         description: Share recorded
 */

/**
 * @swagger
 * /feed/posts/{id}/save:
 *   post:
 *     summary: Save a post
 *     tags: [Feed]
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
 *         description: Saved
 *   delete:
 *     summary: Unsave a post
 *     tags: [Feed]
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
 *         description: Unsaved
 */

/**
 * @swagger
 * /feed/saved:
 *   get:
 *     summary: List the current user's saved posts
 *     tags: [Feed]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Saved posts
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
 *                     $ref: '#/components/schemas/Post'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Story:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         author_id:
 *           type: string
 *           format: uuid
 *         media_url:
 *           type: string
 *         caption:
 *           type: string
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         expires_at:
 *           type: string
 *           format: date-time
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         author_id:
 *           type: string
 *           format: uuid
 *         kind:
 *           type: string
 *           enum: [property, service, general, venue]
 *         body:
 *           type: string
 *         hashtags:
 *           type: string
 *           nullable: true
 *         linked_property_id:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         linked_artisan_id:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         linked_hotel_id:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         likes_count:
 *           type: integer
 *           description: Computed at query time, not a stored column
 *         comments_count:
 *           type: integer
 *         shares_count:
 *           type: integer
 *         is_liked:
 *           type: boolean
 *         is_saved:
 *           type: boolean
 *         images:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               image_url:
 *                 type: string
 *               position:
 *                 type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 */
