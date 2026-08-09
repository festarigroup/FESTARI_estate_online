import paystackSubscriptionService from "#app/services/paystackSubscriptionService.js";
import googlePlayService from "#app/services/googlePlayService.js";
import { asyncErrorHandler } from "#app/utils/asyncErrorHandler.js";
import CustomError from "#app/utils/CustomError.js";
import { Request, Response } from "express";

export const verifyGoogleSubscription = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const { purchaseToken, productId, packageName } = req.body;
  if (!purchaseToken || !productId) {
    throw new CustomError("purchaseToken and productId are required", 400);
  }

  const result = await googlePlayService.verifyGoogleSubscription({
    purchaseToken,
    productId,
    packageName,
    userId: req.user.id,
  });

  return res.status(200).json({ success: true, data: result });
});

export const getMySubscription = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const subscription =
    (await paystackSubscriptionService.getActiveSubscription(req.user.id)) ??
    (await googlePlayService.getActiveSubscription(req.user.id));
  return res.status(200).json({ success: true, data: { subscription } });
});

export const handleGoogleWebhook = asyncErrorHandler(async (_req: Request, res: Response) => {
  return res.status(200).json({ success: true });
});
