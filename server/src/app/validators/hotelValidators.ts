import Joi from "joi";

const HOTEL_CATEGORIES = ["hotel", "resort", "apartment", "event_venue", "short_stay"];

export const createHotelSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow("").optional(),
  location: Joi.string().required(),
  amenities: Joi.object().optional(),
  price_per_night: Joi.number().positive().required(),
  category: Joi.string().valid(...HOTEL_CATEGORIES).default("hotel"),
  rooms: Joi.number().integer().min(0).optional(),
});

export const updateHotelSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().allow("").optional(),
  location: Joi.string().optional(),
  amenities: Joi.object().optional(),
  price_per_night: Joi.number().positive().optional(),
  category: Joi.string().valid(...HOTEL_CATEGORIES).optional(),
  rooms: Joi.number().integer().min(0).optional(),
});

export const createBookingSchema = Joi.object({
  check_in: Joi.date().iso().required(),
  check_out: Joi.date().iso().greater(Joi.ref("check_in")).required(),
  guests: Joi.number().integer().min(1).default(1),
});

export const createHotelReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().allow("").optional(),
});
