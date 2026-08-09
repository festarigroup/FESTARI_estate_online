import {
  registerUser,
  refreshToken,
  verifyOtp,
  resendOtp,
  googleLogin,
  getWelcomeContext,
} from "#app/controllers/authController.js";
import { protect } from "#app/middlewares/auth.js";
import { otpRateLimiter } from "#app/middlewares/rateLimiter.js";
import { validateSchema } from "#app/middlewares/validate.js";
import { registerSchema, refreshSchema, verifyOtpSchema, resendOtpSchema, googleAuthSchema } from "#app/validators/authValidators.js";
import { Router } from "express";

const router = Router();
router.post("/register", validateSchema(registerSchema), registerUser);
router.post("/google", validateSchema(googleAuthSchema), googleLogin);
router.post("/verify-otp", validateSchema(verifyOtpSchema), verifyOtp);
router.get("/welcome-context", protect, getWelcomeContext);
// router.post("/verify-otp", validateSchema(verifyOtpSchema), otpRateLimiter,verifyOtp);
router.post("/resend-otp", validateSchema(resendOtpSchema), resendOtp);
router.post("/refresh-token", validateSchema(refreshSchema), refreshToken);

export default router;