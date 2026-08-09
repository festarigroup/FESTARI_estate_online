/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with email or phone and send OTP for verification
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - authKey
 *               - authValue
 *               - role
 *             properties:
 *               authKey:
 *                 type: string
 *                 enum: [email, phone]
 *                 description: Authentication key type
 *               authValue:
 *                 type: string
 *                 description: Email address or phone number
 *               role:
 *                 type: string
 *                 enum: [driver, customer]
 *                 description: User role
 *             example:
 *               authKey: "phone"
 *               authValue: "+233509895421"
 *               role: "customer"
 *     responses:
 *       201:
 *         description: User registered successfully, OTP sent
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
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         email:
 *                           type: string
 *                         phone:
 *                           type: string
 *                         role:
 *                           type: string
 *                           enum: [customer, admin, driver]
 *                         is_active:
 *                           type: boolean
 *                         verified:
 *                           type: boolean
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP and complete login/registration
 *     description: Verify the OTP sent to user's email or phone and generate access/refresh tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - authKey
 *               - authValue
 *               - otp
 *               - purpose
 *             properties:
 *               authKey:
 *                 type: string
 *                 enum: [email, phone]
 *               authValue:
 *                 type: string
 *               otp:
 *                 type: string
 *                 description: 4-digit OTP code
 *               purpose:
 *                 type: string
 *                 enum: [login, password_reset, email_verification, payment]
 *             example:
 *               authKey: "phone"
 *               authValue: "+233509895421"
 *               otp: "7859"
 *               purpose: "login"
 *     responses:
 *       200:
 *         description: OTP verified successfully
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
 *                     accessToken:
 *                       type: string
 *                       description: JWT access token
 *                     refreshToken:
 *                       type: string
 *                       description: JWT refresh token
 *                     user:
 *                       type: object
 *       400:
 *         description: Invalid credentials or OTP
 *       429:
 *         description: Too many failed attempts
 */

/**
 * @swagger
 * /auth/welcome-context:
 *   get:
 *     summary: Get welcome context from prior sessions
 *     description: |
 *       Returns whether this is the user's first login and details about their
 *       previous sign-in contact (email, phone, or Google) from prior sessions.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: authKey
 *         required: true
 *         schema:
 *           type: string
 *           enum: [email, phone, google]
 *       - in: query
 *         name: authValue
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact used for the current login
 *       - in: query
 *         name: sessionId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Current session ID to exclude from prior session lookup
 *     responses:
 *       200:
 *         description: Welcome context
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
 *                     isFirstLogin:
 *                       type: boolean
 *                     previousLogin:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         authKey:
 *                           type: string
 *                         authValue:
 *                           type: string
 *                     matchesCurrentLogin:
 *                       type: boolean
 *       400:
 *         description: Missing authKey or authValue
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /auth/resend-otp:
 *   post:
 *     summary: Resend OTP to user
 *     description: Request a new OTP code to be sent via SMS or email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - authKey
 *               - authValue
 *               - purpose
 *             properties:
 *               authKey:
 *                 type: string
 *                 enum: [email, phone]
 *               authValue:
 *                 type: string
 *               purpose:
 *                 type: string
 *                 enum: [login, password_reset, email_verification, payment]
 *             example:
 *               authKey: "phone"
 *               authValue: "+233509895421"
 *               purpose: "login"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     description: Generate a new access token using a valid refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Valid JWT refresh token
 *             example:
 *               refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: New access token generated
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
 *                     accessToken:
 *                       type: string
 *       400:
 *         description: Invalid refresh token
 */
