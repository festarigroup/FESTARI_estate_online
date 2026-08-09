import Joi from "joi";

export const createHotelSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow("").optional(),
  location: Joi.string().required(),
  amenities: Joi.object().optional(),
  price_per_night: Joi.number().positive().required(),
});

export const updateHotelSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().allow("").optional(),
  location: Joi.string().optional(),
  amenities: Joi.object().optional(),
  price_per_night: Joi.number().positive().optional(),
});

export const createBookingSchema = Joi.object({
  check_in: Joi.date().iso().required(),
  check_out: Joi.date().iso().greater(Joi.ref("check_in")).required(),
  guests: Joi.number().integer().min(1).default(1),
});
