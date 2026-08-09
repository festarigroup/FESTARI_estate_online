import Joi from "joi";

const LISTING_TYPES = ["for_sale", "for_rent", "short_stay"];
const PROPERTY_TYPES = ["land", "home", "apartment", "office"];

export const createPropertySchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow("").optional(),
  price: Joi.number().positive().required(),
  location: Joi.string().required(),
  listing_type: Joi.string().valid(...LISTING_TYPES).required(),
  property_type: Joi.string().valid(...PROPERTY_TYPES).required(),
  bedrooms: Joi.number().integer().min(0).optional(),
  bathrooms: Joi.number().integer().min(0).optional(),
  area_sqm: Joi.number().integer().min(0).optional(),
});

export const updatePropertySchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().allow("").optional(),
  price: Joi.number().positive().optional(),
  location: Joi.string().optional(),
  listing_type: Joi.string().valid(...LISTING_TYPES).optional(),
  property_type: Joi.string().valid(...PROPERTY_TYPES).optional(),
  bedrooms: Joi.number().integer().min(0).optional(),
  bathrooms: Joi.number().integer().min(0).optional(),
  area_sqm: Joi.number().integer().min(0).optional(),
});
