import Joi from "joi";
import { SELF_ASSIGNABLE_ROLES } from "#app/validators/authValidators.js";

export const setRoleSchema = Joi.object({
  role: Joi.string().valid(...SELF_ASSIGNABLE_ROLES).required(),
});
