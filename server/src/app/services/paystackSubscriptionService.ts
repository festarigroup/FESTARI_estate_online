import { db } from "#app/db/db.js";
import { customers, subscriptions, subscriptionPlans } from "#app/db/schema.js";
import CustomError from "#app/utils/CustomError.js";
import {
  createPaystackCustomer,
  subscribeToPaystackPlan,
  verifyPaystackPayment,
} from "#app/utils/paystack.js";
import userService from "#app/services/usersService.js";
import { eq, and, desc } from "drizzle-orm";

const activatePaystackSubscription = async (payload: {
  userId: string;
  reference: string;
  planCode: string;
}) => {
  const verification = await verifyPaystackPayment(payload.reference);
  if (verification.status !== "success") {
    throw new CustomError("Payment was not successful", 400);
  }

  const authorizationCode = verification.authorization?.authorization_code;
  if (!authorizationCode) {
    throw new CustomError("No payment authorization found for subscription", 400);
  }

  const user = await userService.getUserById(payload.userId);
  if (!user) throw new CustomError("User not found", 404);

  let customerCode = user.payment_provider_customer_id;
  if (!customerCode) {
    const customerPayload: {
      email: string;
      first_name?: string;
      last_name?: string;
      phone?: string;
    } = {
      email: user.email ?? verification.customer?.email ?? "",
      first_name: user.firstname ?? "",
      last_name: user.lastname ?? "",
    };
    if (user.phone) {
      customerPayload.phone = user.phone;
    }

    const customer = await createPaystackCustomer(customerPayload);
    customerCode = customer.customer_code;
    await userService.updateUser(user.id, {
      payment_provider_customer_id: customerCode,
    });
  }

  if (!customerCode) {
    throw new CustomError("Unable to resolve Paystack customer", 500);
  }

  const paystackSub = await subscribeToPaystackPlan({
    customerCode,
    planCode: payload.planCode,
    authorization: authorizationCode,
  });

  const [plan] = await db
    .select()
    .from(subscriptionPlans)
    .where(eq(subscriptionPlans.plan_code, payload.planCode))
    .limit(1);

  const expiresAt = paystackSub.next_payment_date
    ? new Date(paystackSub.next_payment_date)
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const [sub] = await db
    .insert(subscriptions)
    .values({
      user_id: payload.userId,
      platform: "paystack",
      plan_code: payload.planCode,
      subscription_code: paystackSub.subscription_code ?? paystackSub.code,
      paystack_customer_code: customerCode,
      product_id: plan?.name ?? payload.planCode,
      status: paystackSub.status ?? "active",
      expires_at: expiresAt,
      auto_renewing: true,
      started_at: new Date(),
      updated_at: new Date(),
    })
    .returning();

  await db
    .update(customers)
    .set({ is_premium: true })
    .where(eq(customers.id, payload.userId));

  return { subscription: sub, isActive: true };
};

const getActiveSubscription = async (userId: string) => {
  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(
      and(eq(subscriptions.user_id, userId), eq(subscriptions.status, "active")),
    )
    .orderBy(desc(subscriptions.updated_at))
    .limit(1);

  if (!sub) return null;

  const isActive = sub.expires_at ? sub.expires_at.getTime() > Date.now() : sub.status === "active";
  return { ...sub, isActive };
};

const updateSubscriptionFromWebhook = async (payload: {
  subscriptionCode?: string;
  status: string;
  userId?: string;
}) => {
  if (!payload.subscriptionCode) return;

  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.subscription_code, payload.subscriptionCode))
    .limit(1);

  if (!sub) return;

  await db
    .update(subscriptions)
    .set({ status: payload.status, updated_at: new Date() })
    .where(eq(subscriptions.id, sub.id));

  const isPremium = payload.status === "active";
  await db
    .update(customers)
    .set({ is_premium: isPremium })
    .where(eq(customers.id, sub.user_id));
};

export default {
  activatePaystackSubscription,
  getActiveSubscription,
  updateSubscriptionFromWebhook,
};
