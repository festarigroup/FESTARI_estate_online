import Joi from "joi";

export const updatePreferencesSchema = Joi.object({
  frequency: Joi.string().valid("daily", "weekly", "monthly", "never"),
  in_app_enabled: Joi.boolean(),
  email_enabled: Joi.boolean(),
  sms_enabled: Joi.boolean(),
  whatsapp_enabled: Joi.boolean(),
  booking_enabled: Joi.boolean(),
  inquiry_enabled: Joi.boolean(),
  hire_request_enabled: Joi.boolean(),
  social_enabled: Joi.boolean(),
  message_enabled: Joi.boolean(),
  system_enabled: Joi.boolean(),
});
