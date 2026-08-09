import { Router } from "express";
import { protect } from "#app/middlewares/auth.js";
import {
  verifyGoogleSubscription,
  getMySubscription,
  handleGoogleWebhook,
} from "#app/controllers/subscriptionsController.js";

const router = Router();

router.post("/google/webhook", handleGoogleWebhook);

router.use(protect);
router.post("/google/verify", verifyGoogleSubscription);
router.get("/me", getMySubscription);

export default router;
