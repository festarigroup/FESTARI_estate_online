import { db } from "#app/db/db.js";
import { subscriptionPlans, subscriptions } from "#app/db/schema/index.js";
import { PlanInsert } from "#app/types/PaymentTypes.js";
import { and, desc, eq, gt, or, isNull } from "drizzle-orm";

class SubscriptionsService {
  async getActivePlans() {
    return db.select().from(subscriptionPlans).where(eq(subscriptionPlans.is_active, true));
  }

  async getPlanById(id: string) {
    const [plan] = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, id));
    return plan ?? null;
  }

  async getPlanByCode(planCode: string) {
    const [plan] = await db
      .select()
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.plan_code, planCode));
    return plan ?? null;
  }

  async createPlan(row: PlanInsert) {
    const [created] = await db.insert(subscriptionPlans).values(row).returning();
    return created;
  }

  async createPendingSubscription(userId: string, planId: string) {
    const [created] = await db
      .insert(subscriptions)
      .values({ user_id: userId, plan_id: planId, status: "pending" })
      .returning();
    return created;
  }

  async activateSubscription(
    subscriptionId: string,
    updates: { subscription_code?: string; paystack_customer_code?: string; expires_at: Date },
  ) {
    const [updated] = await db
      .update(subscriptions)
      .set({
        ...updates,
        status: "active",
        started_at: new Date(),
        auto_renewing: true,
        updated_at: new Date(),
      })
      .where(eq(subscriptions.id, subscriptionId))
      .returning();
    return updated;
  }

  async getActiveSubscriptionForUser(userId: string) {
    const [sub] = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.user_id, userId),
          eq(subscriptions.status, "active"),
          or(isNull(subscriptions.expires_at), gt(subscriptions.expires_at, new Date())),
        ),
      )
      .orderBy(desc(subscriptions.created_at))
      .limit(1);
    return sub ?? null;
  }

  async getActivePlanForUser(userId: string) {
    const sub = await this.getActiveSubscriptionForUser(userId);
    if (!sub) return null;
    return this.getPlanById(sub.plan_id);
  }

  async listForUser(userId: string) {
    return db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.user_id, userId))
      .orderBy(desc(subscriptions.created_at));
  }

  async cancelActiveSubscription(userId: string) {
    const active = await this.getActiveSubscriptionForUser(userId);
    if (!active) return null;
    const [updated] = await db
      .update(subscriptions)
      .set({ status: "cancelled", auto_renewing: false, updated_at: new Date() })
      .where(eq(subscriptions.id, active.id))
      .returning();
    return updated;
  }

  async getById(id: string) {
    const [sub] = await db.select().from(subscriptions).where(eq(subscriptions.id, id));
    return sub ?? null;
  }

  async getBySubscriptionCode(subscriptionCode: string) {
    const [sub] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.subscription_code, subscriptionCode));
    return sub ?? null;
  }

  async updateStatus(subscriptionId: string, status: string) {
    await db
      .update(subscriptions)
      .set({ status, updated_at: new Date() })
      .where(eq(subscriptions.id, subscriptionId));
  }
}

const subscriptionsService = new SubscriptionsService();
export default subscriptionsService;
