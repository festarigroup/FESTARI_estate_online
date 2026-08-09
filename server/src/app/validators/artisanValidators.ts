import Joi from "joi";

export const createArtisanProfileSchema = Joi.object({
  service_type: Joi.string().required(),
  bio: Joi.string().allow("").optional(),
  location: Joi.string().allow("").optional(),
});

export const updateArtisanProfileSchema = Joi.object({
  service_type: Joi.string().optional(),
  bio: Joi.string().allow("").optional(),
  location: Joi.string().allow("").optional(),
});

export const hireArtisanSchema = Joi.object({
  message: Joi.string().required(),
});

export const createReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().allow("").optional(),
});

export const updateHireRequestStatusSchema = Joi.object({
  status: Joi.string().valid("accepted", "rejected", "completed").required(),
});
