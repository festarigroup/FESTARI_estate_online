/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Registration, login, OTP verification, and token refresh
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new account
 *     description: |
 *       Creates an unverified account and emails a 6-digit OTP for verification.
 *       Login is blocked until the account is verified via `/auth/verify-otp`.
 *       A user can hold multiple roles at once — `roles` is an array, not a single value.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstname, lastname, email, password, roles]
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [buyer, estate_manager, hotel_manager, artisan, admin]
 *             example:
 *               firstname: "Ama"
 *               lastname: "Serwaa"
 *               email: "ama@example.com"
 *               password: "correct-horse-battery-staple"
 *               roles: ["buyer"]
 *     responses:
 *       201:
 *         description: Account created, OTP sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       409:
 *         description: An account with this email already exists
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Signed in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokenResponse'
 *       401:
 *         description: Invalid email or password
 *       403:
 *         description: Email not yet verified
 */

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Sign in (or register) with Google
 *     description: |
 *       Verifies a Google ID token server-side. First-time sign-in creates a
 *       pre-verified account with no role yet. `role` is optional; if
 *       omitted, new accounts are created role-less and the returned
 *       `user.roles` will be an empty array — the client should treat that
 *       as "force the user through role selection" (POST /users/me/role)
 *       before sending them anywhere but that screen. If `role` is passed
 *       and the account doesn't already have it, it's added. Not
 *       Supabase-based — the token is verified directly against Google via
 *       `google-auth-library`.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idToken]
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Google ID token from the client-side sign-in flow
 *               role:
 *                 type: string
 *                 enum: [buyer, estate_manager, hotel_manager, artisan]
 *                 description: Optional. Omit to defer role selection to a later step.
 *     responses:
 *       200:
 *         description: Signed in (existing account)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokenResponse'
 *       201:
 *         description: Account created and signed in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokenResponse'
 *       401:
 *         description: Invalid Google token
 */

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify an OTP
 *     description: Used for both email verification and password reset, distinguished by `purpose`.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp, purpose]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: string
 *                 example: "482913"
 *               purpose:
 *                 type: string
 *                 enum: [email_verification, password_reset]
 *     responses:
 *       200:
 *         description: OTP verified
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
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid, expired, or already-used OTP
 *       429:
 *         description: Too many failed attempts — request a new OTP
 */

/**
 * @swagger
 * /auth/resend-otp:
 *   post:
 *     summary: Resend an OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, purpose]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               purpose:
 *                 type: string
 *                 enum: [email_verification, password_reset]
 *     responses:
 *       200:
 *         description: OTP sent
 *       400:
 *         description: No account found for this email
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password-reset OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Reset code sent
 *       400:
 *         description: No account found for this email
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password with an OTP
 *     description: Revokes every existing session (refresh token) for the account on success.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp, newPassword]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Password reset — all sessions revoked, sign in again
 *       400:
 *         description: Invalid or expired OTP
 */

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Exchange a refresh token for a new access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token
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
 *       401:
 *         description: Refresh token invalid or expired
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out
 *     description: Revokes one session (if `sessionId` is given) or every session for the account.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Logged out
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *           nullable: true
 *         profile_picture:
 *           type: string
 *           nullable: true
 *         is_active:
 *           type: boolean
 *         verified:
 *           type: boolean
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *     AuthTokenResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             accessToken:
 *               type: string
 *             refreshToken:
 *               type: string
 *             sessionId:
 *               type: string
 *               format: uuid
 *             user:
 *               $ref: '#/components/schemas/User'
 */
