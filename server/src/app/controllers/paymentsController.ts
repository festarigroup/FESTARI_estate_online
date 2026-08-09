import paymentsService from "#app/services/paymentsService.js";
import paymentProcessingService from "#app/services/paymentProcessingService.js";
import userService from "#app/services/usersService.js";
import { asyncErrorHandler } from "#app/utils/asyncErrorHandler.js";
import CustomError from "#app/utils/CustomError.js";
import { initializePaystackTransaction, verifyPaystackPayment } from "#app/utils/paystack.js";
import { generateUniqueTransactionReference } from "#app/utils/transactionReference.js";
import { parsePaginationParams, validatePaginationParams } from "#app/utils/pagination.js";
import { requiredRouteParam } from "#app/utils/routeParams.js";
import crypto from "crypto";
import { Request, Response } from "express";

export const initiatePayment = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);

  const { payment_type, target_id, amount, metadata } = req.body;
  const user = await userService.getUserById(req.user.id);
  if (!user?.email) throw new CustomError("A verified email is required to make a payment", 400);

  const reference = await generateUniqueTransactionReference();

  const paystackResponse = await initializePaystackTransaction({
    email: user.email,
    amount: Math.round(Number(amount) * 100),
    currency: "GHS",
    metadata: { ...metadata, payment_type, target_id, user_id: user.id },
  });

  const payment = await paymentsService.create({
    user_id: user.id,
    payment_type,
    target_id: target_id ?? null,
    amount,
    reference,
    access_code: paystackResponse.access_code,
    authorization_url: paystackResponse.authorization_url,
    metadata: metadata ?? null,
  });

  return res.status(200).json({
    success: true,
    data: {
      reference,
      access_code: paystackResponse.access_code,
      authorization_url: paystackResponse.authorization_url,
      payment,
    },
  });
});

export const verifyPayment = asyncErrorHandler(async (req: Request, res: Response) => {
  const reference = requiredRouteParam(req.params.reference, "reference");

  const verification = await verifyPaystackPayment(reference);
  if (verification.status === "success") {
    await paymentProcessingService.processSuccessfulPayment(reference, verification);
  } else if (verification.status === "failed") {
    await paymentsService.updateByReference(reference, { status: "failed" });
  }

  const payment = await paymentsService.getByReference(reference);
  return res.status(200).json({
    success: true,
    data: { status: payment?.status ?? "not_found", payment },
  });
});

export const getPayments = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const { limit, current_page, offset } = parsePaginationParams(req.query);
  const items = await paymentsService.listForUser(req.user.id, limit, offset);
  const { current_page: validatedPage } = validatePaginationParams(current_page, limit, items.length);

  return res.status(200).json({
    success: true,
    data: { items, metadata: { current_page: validatedPage, limit } },
  });
});

export const getPayment = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");
  const payment = await paymentsService.getById(id);
  if (!payment) throw new CustomError("Payment not found", 404);
  if (payment.user_id !== req.user.id && !req.user.roles.includes("admin")) {
    throw new CustomError("Forbidden", 403);
  }
  return res.status(200).json({ success: true, data: { payment } });
});

export const handlePaystackWebhook = asyncErrorHandler(async (req: Request, res: Response) => {
  const signature = req.headers["x-paystack-signature"];
  const hash = crypto
    .createHmac("sha512", process.env.PAYMENT_SECRET_KEY ?? "")
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== signature) {
    throw new CustomError("Invalid signature", 401);
  }

  const event = req.body;

  if (event.id) {
    const isNew = await paymentProcessingService.recordWebhookEvent(
      String(event.id),
      event.event,
      event.data?.reference,
    );
    if (!isNew) {
      return res.status(200).json({ status: "duplicate" });
    }
  }

  if (event.event === "charge.success") {
    const { reference } = event.data;
    const verification = await verifyPaystackPayment(reference);
    if (verification.status === "success") {
      await paymentProcessingService.processSuccessfulPayment(reference, verification);
    }
  }

  return res.status(200).json({ status: "success" });
});
