import Joi from "joi";
import { roleEnum } from "#app/db/schema/enums.js";

export const ROLES = roleEnum.enumValues;
// "admin" is granted out-of-band (DB/ops), never through a public,
// self-service endpoint — register, Google sign-in, and the "set my
// role" endpoint all validate against this narrower list instead.
export const SELF_ASSIGNABLE_ROLES = ROLES.filter((role) => role !== "admin");

export const registerSchema = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  roles: Joi.array().items(Joi.string().valid(...SELF_ASSIGNABLE_ROLES)).min(1).required(),
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
  // Optional: a Google sign-in/sign-up no longer has to carry a role up
  // front. New accounts are created role-less; the client forces a
  // separate "choose your role" step afterwards (POST /users/me/role)
  // before treating the account as fully onboarded.
  role: Joi.string().valid(...SELF_ASSIGNABLE_ROLES).optional(),
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
