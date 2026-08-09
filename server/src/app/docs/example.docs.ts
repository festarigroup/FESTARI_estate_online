/**
 * @swagger
 * /example:
 *   get:
 *     summary: Example endpoint for testing
 *     description: A simple public endpoint that returns a basic example response. Useful for testing API connectivity and health checks.
 *     tags: [Example]
 *     responses:
 *       200:
 *         description: Example response returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: string
 *                   example: "correct"
 *       500:
 *         description: Internal server error
 */
