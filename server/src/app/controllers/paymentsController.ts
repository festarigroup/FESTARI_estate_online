import paymentService from "#app/services/paymentService.js";
import paymentProcessingService from "#app/services/paymentProcessingService.js";
import paystackSubscriptionService from "#app/services/paystackSubscriptionService.js";
import requestService from "#app/services/requestsService.js";
import transactionService from "#app/services/transactionsService.js";
import userService from "#app/services/usersService.js";
import CustomError from "#app/utils/CustomError.js";
import {
  createPaystackCustomer,
  createPaystackPlan,
  initializePaystackTransaction,
  subscribeToPaystackPlan,
  verifyPaystackPayment,
} from "#app/utils/paystack.js";
import { generateUniqueTransactionReference } from "#app/utils/transactionReference.js";
import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "#app/db/db.js";
import { subscriptionPlans } from "#app/db/schema.js";

export const createPlan = async (req: Request, res: Response) => {
  const body = req.body;
  const response = await createPaystackPlan(body);
  body.amount_saved = body.amountSaved;
  body.plan_code = response.plan_code;
  const plan = await paymentService.addPlan(body);
  return res.status(201).json({
    success: true,
    data: plan,
  });
};

export const getPlans = async (req: Request, res: Response) => {
  const plans = await paymentService.getPlans();
  return res.status(200).json({
    success: true,
    data: plans,
  });
};

export const initTransaction = async (req: Request, res: Response) => {
  let body = req.body;
  const response = await initializePaystackTransaction(body);
  body = { ...body, ...response };
  const transaction = await transactionService.initTransaction(body);
  return res.status(200).json({
    success: true,
    data: transaction,
  });
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const referenceParam = req.params.reference;
    const reference = typeof referenceParam === 'string' ? referenceParam : referenceParam?.[0];
    
    if (!reference) {
      throw new CustomError('Reference is required', 400);
    }
    
    const response = await verifyPaystackPayment(reference);
    const payment = await paymentService.verifyPayment(
      reference,
      response.status,
    );
    return res.status(200).json({
      success: true,
      data: { status: payment?.status ?? "Not found" },
    });
  } catch (error: any) {
    throw new CustomError(error.message || 'Payment verification failed', 400);
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  const response = await createPaystackCustomer(req.body);
  console.log(response)
  return res.status(201).json({ success: true, data: response });
};

export const subscribeToPlan = async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);

  const user = await userService.getUserById(req.user.id);
  if (!user) throw new CustomError("User not found", 404);
  let customerCode = user.payment_provider_customer_id

  if(!customerCode){
    const response = await createPaystackCustomer({
      email: user.email! ?? "",
      first_name: user.firstname! ?? "",
      last_name: user.lastname! ?? ""
    });
    customerCode = response.customerCode
    await userService.updateUser(user.id, { payment_provider_customer_id: customerCode })
  }

  const subscription = await subscribeToPaystackPlan({...req.body, customerCode});
  return res.status(200).json({
    success: true,
    data: subscription,
  });
};

export const initiateMobileMoneyPayment = async (req: Request, res: Response) => {
  try {
    const {
      amount,
      email,
      phone,
      provider = 'mtn',
      requestId,
      clientInitiated = false,
      payment_method = 'mobile_money',
    } = req.body;
    
    if (!amount || amount <= 0) {
      throw new CustomError('Invalid amount', 400);
    }

    const user = await userService.getUserById(req.user!.id);
    if (!user) throw new CustomError('User not found', 404);

    const cleanPhone = phone?.replace(/\s/g, '') ?? '';
    if (payment_method === 'mobile_money') {
      if (!cleanPhone.match(/^0[0-9]{9}$/)) {
        throw new CustomError('Invalid phone number format', 400);
      }
    }

    let requestData = null;
    if (requestId) {
      requestData = await requestService.getRequestById(requestId);
      if (!requestData) {
        throw new CustomError('Request not found', 404);
      }
    }

    if (clientInitiated) {
      const reference = await generateUniqueTransactionReference();
      const transactionData = {
        user_id: user.id,
        request_id: requestId,
        amount: amount,
        reference,
        status: 'pending',
        payment_method,
        provider_name: provider,
        phone: cleanPhone || null,
        metadata: {
          requestId,
          phone: cleanPhone,
          provider,
          customer_id: user.id,
          customer_email: user.email,
          customer_name: `${user.firstname || ''} ${user.lastname || ''}`.trim(),
        },
      };

      const transaction = await transactionService.initTransaction(transactionData);

      return res.status(200).json({
        success: true,
        data: {
          reference,
          amount,
          status: 'pending',
          transaction_id: transaction?.id,
          transaction_reference: transaction?.reference,
          message: 'Payment reserved. Complete checkout in the app.',
          transaction,
        },
      });
    }

    const response = await initializePaystackTransaction({
      email: email || user.email,
      amount: amount * 100,
      currency: 'GHS',
      channels: ['mobile_money'],
      mobile_money: {
        phone: cleanPhone,
        provider: provider
      },
      metadata: {
        customer_id: user.id,
        request_id: requestId,
        phone: cleanPhone,
        provider: provider,
        customer_email: user.email,
        customer_name: `${user.firstname || ''} ${user.lastname || ''}`.trim()
      }
    });

    const transactionData = {
      user_id: user.id,
      request_id: requestId,
      amount: amount,
      reference: response.reference,
      status: 'pending',
      payment_method: 'mobile_money',
      provider_name: provider,
      phone: cleanPhone,
      access_code: response.access_code,
      authorization_url: response.authorization_url,
      metadata: {
        requestId,
        phone: cleanPhone,
        provider,
        paystack_reference: response.reference,
        paystack_access_code: response.access_code
      }
    };

    const transaction = await transactionService.initTransaction(transactionData);

    return res.status(200).json({
      success: true,
      data: {
        reference: response.reference,
        access_code: response.access_code,
        status: 'pending',
        transaction_id: transaction?.id,
        transaction_reference: transaction?.reference,
        message: 'Payment initiated. Please check your phone for the payment prompt.',
        transaction
      }
    });
  } catch (error: any) {
    console.error('Payment initiation error:', error);
    throw new CustomError(error.message || 'Payment initiation failed', 400);
  }
};

export const getTransactionDetails = async (req: Request, res: Response) => {
  try {
    const { referenceParam } = req.params;
    const reference = typeof referenceParam === 'string' ? referenceParam : referenceParam?.[0];
    
    const transaction = await transactionService.getTransactionByReference(reference ?? "");
    if (!transaction) {
      throw new CustomError('Transaction not found', 404);
    }

    // Verify ownership
    if (transaction.user_id !== req.user?.id) {
      throw new CustomError('Unauthorized', 403);
    }

    return res.status(200).json({
      success: true,
      data: {
        reference: transaction.reference,
        amount: transaction.amount,
        status: transaction.status,
        payment_method: transaction.payment_method,
        phone: transaction.phone,
        provider: transaction.provider_name,
        created_at: transaction.created_at,
        paid_at: transaction.paid_at,
        metadata: transaction.metadata
      }
    });
  } catch (error: any) {
    throw new CustomError(error.message || 'Failed to get transaction details', 400);
  }
};

export const checkPaymentStatus = async (req: Request, res: Response) => {
  try {
    const reference = req.params.reference as string;
    
    if (!reference) {
      throw new CustomError('Reference is required', 400);
    }

    const transaction = await transactionService.getTransactionByReference(reference);
    
    if (!transaction) {
      throw new CustomError('Transaction not found', 404);
    }

    if (transaction.status === 'pending') {
      try {
        const verification = await verifyPaystackPayment(reference);
        
        if (verification.status === 'success') {
          await paymentProcessingService.processSuccessfulPayment(reference, verification);

          return res.status(200).json({
            success: true,
            data: {
              status: 'success',
              reference: transaction.reference,
              amount: transaction.amount
            }
          });
        } else if (verification.status === 'failed') {
          await transactionService.updateTransaction(reference, {
            status: 'failed',
            paystack_data: verification
          });

          return res.status(200).json({
            success: true,
            data: {
              status: 'failed',
              reference: transaction.reference,
              amount: transaction.amount
            }
          });
        }
      } catch (error) {
        console.error('Paystack verification error:', error);
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        status: transaction.status,
        reference: transaction.reference,
        amount: transaction.amount
      }
    });
  } catch (error: any) {
    console.error('Status check error:', error);
    throw new CustomError(error.message || 'Failed to check payment status', 400);
  }
};

export const initiateSubscriptionPayment = async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const { planCode } = req.body;
  if (!planCode) throw new CustomError("planCode is required", 400);

  const [plan] = await db
    .select()
    .from(subscriptionPlans)
    .where(eq(subscriptionPlans.plan_code, planCode))
    .limit(1);

  if (!plan) throw new CustomError("Subscription plan not found", 404);

  const user = await userService.getUserById(req.user.id);
  if (!user) throw new CustomError("User not found", 404);
  if (!user.email) throw new CustomError("A verified email is required for subscription", 400);

  const amount = Number(plan.amount);
  const reference = await generateUniqueTransactionReference();

  const transaction = await transactionService.initTransaction({
    user_id: user.id,
    amount: amount.toFixed(2),
    reference,
    status: "pending",
    payment_method: "card",
    metadata: {
      purpose: "subscription",
      plan_code: planCode,
      customer_id: user.id,
      customer_email: user.email,
    },
  });

  return res.status(200).json({
    success: true,
    data: {
      reference,
      amount,
      email: user.email,
      plan_code: planCode,
      transaction_id: transaction?.id,
    },
  });
};

export const activateSubscription = async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const { reference, planCode } = req.body;
  if (!reference || !planCode) {
    throw new CustomError("reference and planCode are required", 400);
  }

  const result = await paystackSubscriptionService.activatePaystackSubscription({
    userId: req.user.id,
    reference,
    planCode,
  });

  await transactionService.updateTransactionStatus(reference, "success");

  return res.status(200).json({
    success: true,
    data: result,
  });
};

export const handlePaystackWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-paystack-signature'];
    const crypto = require('crypto');
    const hash = crypto
      .createHmac('sha512', process.env.PAYMENT_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');
    
    if (hash !== signature) {
      throw new CustomError('Invalid signature', 401);
    }

    const event = req.body;

    if (event.id) {
      const isNew = await paymentProcessingService.recordWebhookEvent(
        String(event.id),
        event.event,
        event.data?.reference,
      );
      if (!isNew) {
        return res.status(200).json({ status: 'duplicate' });
      }
    }
    
    if (event.event === 'charge.success') {
      const data = event.data;
      const { reference } = data;
      
      const verification = await verifyPaystackPayment(reference);
      
      if (verification.status === 'success') {
        await paymentProcessingService.processSuccessfulPayment(reference, verification);
      }
    }

    if (event.event === 'subscription.create') {
      await paystackSubscriptionService.updateSubscriptionFromWebhook({
        subscriptionCode: event.data?.subscription_code,
        status: 'active',
      });
    }

    if (event.event === 'subscription.disable' || event.event === 'subscription.not_renew') {
      await paystackSubscriptionService.updateSubscriptionFromWebhook({
        subscriptionCode: event.data?.subscription_code,
        status: 'cancelled',
      });
    }

    if (event.event === 'invoice.payment_failed') {
      await paystackSubscriptionService.updateSubscriptionFromWebhook({
        subscriptionCode: event.data?.subscription?.subscription_code,
        status: 'past_due',
      });
    }

    return res.status(200).json({ status: 'success' });
  } catch (error: any) {
    console.error('Webhook error:', error);
    // Always return 200 to Paystack
    return res.status(200).json({ status: 'received' });
  }
};