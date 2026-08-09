import {
  registerUser,
  loginUser,
  refreshToken,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  googleLogin,
  logoutUser,
} from "#app/controllers/authController.js";
import { protect } from "#app/middlewares/auth.js";
import { validateSchema } from "#app/middlewares/validate.js";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  verifyOtpSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  googleAuthSchema,
} from "#app/validators/authValidators.js";
import { Router } from "express";

const router = Router();
router.post("/register", validateSchema(registerSchema), registerUser);
router.post("/login", validateSchema(loginSchema), loginUser);
router.post("/google", validateSchema(googleAuthSchema), googleLogin);
router.post("/verify-otp", validateSchema(verifyOtpSchema), verifyOtp);
router.post("/resend-otp", validateSchema(resendOtpSchema), resendOtp);
router.post("/forgot-password", validateSchema(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validateSchema(resetPasswordSchema), resetPassword);
router.post("/refresh-token", validateSchema(refreshSchema), refreshToken);
router.post("/logout", protect, logoutUser);

export default router;
