import subscriptionsService from "#app/services/subscriptionsService.js";
import paymentsService from "#app/services/paymentsService.js";
import userService from "#app/services/usersService.js";
import { createPaystackPlan, initializePaystackTransaction } from "#app/utils/paystack.js";
import { generateUniqueTransactionReference } from "#app/utils/transactionReference.js";
import { asyncErrorHandler } from "#app/utils/asyncErrorHandler.js";
import CustomError from "#app/utils/CustomError.js";
import { Request, Response } from "express";

export const createPlan = asyncErrorHandler(async (req: Request, res: Response) => {
  const body = req.body;
  const paystackPlan = await createPaystackPlan(body);
  const plan = await subscriptionsService.createPlan({
    ...body,
    amount_saved: body.amountSaved,
    plan_code: paystackPlan.plan_code,
  });
  return res.status(201).json({ success: true, data: plan });
});

export const getPlans = asyncErrorHandler(async (_req: Request, res: Response) => {
  const plans = await subscriptionsService.getActivePlans();
  return res.status(200).json({ success: true, data: plans });
});

export const subscribeToPlan = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const { planCode } = req.body;

  const plan = await subscriptionsService.getPlanByCode(planCode);
  if (!plan) throw new CustomError("Subscription plan not found", 404);

  const user = await userService.getUserById(req.user.id);
  if (!user?.email) throw new CustomError("A verified email is required to subscribe", 400);

  const subscription = await subscriptionsService.createPendingSubscription(user.id, plan.id);
  const reference = await generateUniqueTransactionReference();

  const paystackResponse = await initializePaystackTransaction({
    email: user.email,
    amount: Math.round(Number(plan.amount) * 100),
    currency: "GHS",
    metadata: { payment_type: "subscription", target_id: subscription!.id, plan_code: planCode },
  });

  await paymentsService.create({
    user_id: user.id,
    payment_type: "subscription",
    target_id: subscription!.id,
    amount: plan.amount,
    reference,
    access_code: paystackResponse.access_code,
    authorization_url: paystackResponse.authorization_url,
  });

  return res.status(200).json({
    success: true,
    data: {
      subscription,
      reference,
      access_code: paystackResponse.access_code,
      authorization_url: paystackResponse.authorization_url,
    },
  });
});

export const getMySubscription = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const subscription = await subscriptionsService.getActiveSubscriptionForUser(req.user.id);
  return res.status(200).json({ success: true, data: { subscription } });
});

export const cancelSubscription = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const cancelled = await subscriptionsService.cancelActiveSubscription(req.user.id);
  if (!cancelled) throw new CustomError("No active subscription to cancel", 404);
  return res.status(200).json({ success: true, data: { subscription: cancelled } });
});

export const getSubscriptionHistory = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const history = await subscriptionsService.listForUser(req.user.id);
  return res.status(200).json({ success: true, data: { items: history } });
});
