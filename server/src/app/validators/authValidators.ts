import Joi from "joi";

const ROLES = ["buyer", "estate_manager", "hotel_manager", "artisan", "admin"];

export const registerSchema = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  roles: Joi.array().items(Joi.string().valid(...ROLES)).min(1).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const googleAuthSchema = Joi.object({
  idToken: Joi.string().required().messages({
    "string.empty": "idToken is required",
    "any.required": "idToken is required",
  }),
  role: Joi.string().valid(...ROLES).required(),
});

export const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().required(),
  purpose: Joi.string().valid("email_verification", "password_reset").required(),
});

export const resendOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  purpose: Joi.string().valid("email_verification", "password_reset").required(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

export const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
