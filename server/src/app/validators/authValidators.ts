import Joi from "joi";

export const googleAuthSchema = Joi.object({
  idToken: Joi.string().required().messages({
    "string.empty": "idToken is required",
    "any.required": "idToken is required",
  }),
  role: Joi.string().valid("customer", "driver").required(),
});

export const registerSchema = Joi.object({
  authKey: Joi.string().required(),
  authValue: Joi.string().required(),
  role: Joi.string().required(),
  find: Joi.boolean().optional(),
});

export const verifyOtpSchema = Joi.object({
  authKey: Joi.string().required(),
  authValue: Joi.string().required(),
  otp: Joi.string().required(),
  purpose: Joi.string().required(),
});

export const resendOtpSchema = Joi.object({
  authKey: Joi.string().required(),
  authValue: Joi.string().required(),
  purpose: Joi.string().required(),
});

export const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
