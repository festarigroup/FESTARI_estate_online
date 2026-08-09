import Joi from "joi";

export const createPropertyInquirySchema = Joi.object({
  property_id: Joi.string().uuid().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().allow("").optional(),
  message: Joi.string().required(),
});

export const createArtisanInquirySchema = Joi.object({
  artisan_id: Joi.string().uuid().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().allow("").optional(),
  message: Joi.string().required(),
});
