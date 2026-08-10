import Joi from "joi";

const POST_KINDS = ["property", "service", "general", "venue"];

export const createPostSchema = Joi.object({
  kind: Joi.string().valid(...POST_KINDS).default("general"),
  body: Joi.string().required(),
  hashtags: Joi.string().allow("").optional(),
  linked_property_id: Joi.string().uuid().optional(),
  linked_artisan_id: Joi.string().uuid().optional(),
  linked_hotel_id: Joi.string().uuid().optional(),
});

export const updatePostSchema = Joi.object({
  body: Joi.string().optional(),
  hashtags: Joi.string().allow("").optional(),
});

export const addCommentSchema = Joi.object({
  body: Joi.string().required(),
});
