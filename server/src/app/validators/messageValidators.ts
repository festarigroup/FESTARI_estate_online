import Joi from "joi";

export const startConversationSchema = Joi.object({
  participant_id: Joi.string().uuid().required(),
});

export const sendMessageSchema = Joi.object({
  body: Joi.string().required(),
});
