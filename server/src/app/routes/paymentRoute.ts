import {
  createCustomer,
  createPlan,
  getPlans,
  initTransaction,
  subscribeToPlan,
  verifyPayment,
  initiateMobileMoneyPayment,
  checkPaymentStatus,
  handlePaystackWebhook,
  getTransactionDetails,
  initiateSubscriptionPayment,
  activateSubscription,
} from "#app/controllers/paymentsController.js";
import { protect } from "#app/middlewares/auth.js";
import { validateSchema } from "#app/middlewares/validate.js";
import {
  createPlanSchema,
  initializeTransactionSchema,
  subscribeSchema,
  subscriptionInitiateSchema,
  subscriptionActivateSchema,
} from "#app/validators/paymentValidators.js";
import { Router } from "express";

const router = Router();

router.post("/webhook", handlePaystackWebhook);
router.post("/customer", createCustomer);

router
  .route("/plans")
  .post(validateSchema(createPlanSchema), createPlan)
  .get(getPlans);

router.use(protect);

router.post("/mobile-money/initiate", initiateMobileMoneyPayment);
router.post("/subscriptions/initiate", validateSchema(subscriptionInitiateSchema), initiateSubscriptionPayment);
router.post("/subscriptions/activate", validateSchema(subscriptionActivateSchema), activateSubscription);
router.get("/status/:reference", checkPaymentStatus);
router.post("/initialize", validateSchema(initializeTransactionSchema), initTransaction);
router.get("/verify/:reference", verifyPayment);
router.post("/subscribe", validateSchema(subscribeSchema), subscribeToPlan);
router.get("/transaction/:reference", getTransactionDetails);

export default router;
