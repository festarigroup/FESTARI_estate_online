import Joi from "joi";

export const createPlanSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.object().required(),
  interval: Joi.string().required(),
  amount: Joi.number().required(),
  amountSaved: Joi.number().optional(),
});

export const initializeTransactionSchema = Joi.object({
  email: Joi.string().required(),
  amount: Joi.number().required(),
  metadata: Joi.object().optional(),
  channels: Joi.array().items(Joi.string()).optional(),
  currency: Joi.string().optional(),
});

export const subscribeSchema = Joi.object({
  planCode: Joi.string().required(),
  authorization: Joi.string().optional(),
});

export const subscriptionInitiateSchema = Joi.object({
  planCode: Joi.string().required(),
});

export const subscriptionActivateSchema = Joi.object({
  reference: Joi.string().required(),
  planCode: Joi.string().required(),
});