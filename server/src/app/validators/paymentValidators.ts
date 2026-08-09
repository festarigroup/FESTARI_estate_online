import Joi from "joi";

export const createPlanSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.object().required(),
  interval: Joi.string().valid("monthly", "yearly").required(),
  amount: Joi.number().required(),
  amountSaved: Joi.number().optional(),
  max_properties: Joi.number().integer().min(0).optional(),
  max_hotels: Joi.number().integer().min(0).optional(),
  max_images: Joi.number().integer().min(0).optional(),
  max_videos: Joi.number().integer().min(0).optional(),
  can_feature_properties: Joi.boolean().optional(),
});

export const initiatePaymentSchema = Joi.object({
  payment_type: Joi.string().valid("subscription", "property", "hotel_booking", "artisan_hire").required(),
  target_id: Joi.string().uuid().optional(),
  amount: Joi.number().positive().required(),
  metadata: Joi.object().optional(),
});

export const subscribeSchema = Joi.object({
  planCode: Joi.string().required(),
});
