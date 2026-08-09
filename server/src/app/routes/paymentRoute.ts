import {
  initiatePayment,
  verifyPayment,
  getPayments,
  getPayment,
  handlePaystackWebhook,
} from "#app/controllers/paymentsController.js";
import { protect } from "#app/middlewares/auth.js";
import { validateSchema } from "#app/middlewares/validate.js";
import { initiatePaymentSchema } from "#app/validators/paymentValidators.js";
import { Router } from "express";

const router = Router();

router.post("/webhook", handlePaystackWebhook);

router.use(protect);

router.get("/", getPayments);
router.post("/initiate", validateSchema(initiatePaymentSchema), initiatePayment);
router.get("/verify/:reference", verifyPayment);
router.get("/:id", getPayment);

export default router;
