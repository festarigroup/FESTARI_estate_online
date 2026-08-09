import Joi from "joi";

export const updatePreferencesSchema = Joi.object({
  frequency: Joi.string().valid('daily', 'weekly', 'monthly', 'never'),
  inAppEnabled: Joi.boolean(),
  emailEnabled: Joi.boolean(),
  smsEnabled: Joi.boolean(),
  whatsappEnabled: Joi.boolean(),
  walletEnabled: Joi.boolean(),
  rewardsEnabled: Joi.boolean(),
  subscriptionEnabled: Joi.boolean(),
  scheduledPickupsEnabled: Joi.boolean(),
  arrivalPickupsEnabled: Joi.boolean(),
});