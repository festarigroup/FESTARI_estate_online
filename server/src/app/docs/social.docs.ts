/**
 * @swagger
 * tags:
 *   name: Social
 *   description: Follow graph — every endpoint requires authentication
 */

/**
 * @swagger
 * /social/suggestions:
 *   get:
 *     summary: '"Who to follow" suggestions'
 *     description: People the current user doesn't already follow.
 *     tags: [Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *     responses:
 *       200:
 *         description: Suggested users
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
 *                     $ref: '#/components/schemas/PublicUser'
 */

/**
 * @swagger
 * /social/follow/{userId}:
 *   post:
 *     summary: Follow a user
 *     tags: [Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       201:
 *         description: Now following — notifies the followed user
 *       400:
 *         description: Cannot follow yourself
 *   delete:
 *     summary: Unfollow a user
 *     tags: [Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Unfollowed
 */

/**
 * @swagger
 * /social/following:
 *   get:
 *     summary: Who the current user follows
 *     tags: [Social]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Following list
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
 *                     $ref: '#/components/schemas/PublicUser'
 */

/**
 * @swagger
 * /social/followers:
 *   get:
 *     summary: Who follows the current user
 *     tags: [Social]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Followers list
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
 *                     $ref: '#/components/schemas/PublicUser'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PublicUser:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         firstname:
 *           type: string
 *           nullable: true
 *         lastname:
 *           type: string
 *           nullable: true
 *         profile_picture:
 *           type: string
 *           nullable: true
 */
