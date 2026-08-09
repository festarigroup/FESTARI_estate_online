import Joi from "joi";

export const createStorySchema = Joi.object({
  caption: Joi.string().allow("").optional(),
});
