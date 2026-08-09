import { db } from "#app/db/db.js";
import { PaymentInsert, PaymentRow } from "#app/types/PaymentTypes.js";
import { paystack } from "#app/utils/paystack.js";
import { paymentTransactions, subscriptionPlans } from "../db/schema";
import { eq } from "drizzle-orm";

class PaymentService {
  async addPlan(row: PaymentInsert) {
    const [created] = await db.insert(subscriptionPlans).values(row).returning();
    return created;
  }

  async getPlans(): Promise<Array<PaymentRow>>{
    const plans = await db.select().from(subscriptionPlans);
    return plans;
  }

  async verifyPayment(reference: string, status: string) {
    const [verified] = await db
      .update(paymentTransactions)
      .set({
        status: status,
        updated_at: new Date(),
      })
      .where(eq(paymentTransactions.reference, reference))
      .returning();
    return verified;
  }
}

const paymentService = new PaymentService();

export default paymentService;
