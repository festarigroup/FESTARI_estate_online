import { Router } from "express";
import { protect, restrictTo } from "#app/middlewares/auth.js";
import { validateSchema } from "#app/middlewares/validate.js";
import { createPlanSchema, subscribeSchema } from "#app/validators/paymentValidators.js";
import {
  createPlan,
  getPlans,
  subscribeToPlan,
  getMySubscription,
  cancelSubscription,
  getSubscriptionHistory,
} from "#app/controllers/subscriptionsController.js";

const router = Router();

router.get("/plans", getPlans);
router.post("/plans", protect, restrictTo("admin"), validateSchema(createPlanSchema), createPlan);

router.use(protect);
router.post("/subscribe", validateSchema(subscribeSchema), subscribeToPlan);
router.get("/my-subscription", getMySubscription);
router.put("/cancel", cancelSubscription);
router.get("/history", getSubscriptionHistory);

export default router;
