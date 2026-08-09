import { db } from "#app/db/db.js";
import { payments } from "#app/db/schema/index.js";
import { PaymentInsert } from "#app/types/PaymentTypes.js";
import { desc, eq } from "drizzle-orm";

class PaymentsService {
  async create(row: PaymentInsert) {
    const [created] = await db.insert(payments).values(row).returning();
    return created;
  }

  async getByReference(reference: string) {
    const [payment] = await db.select().from(payments).where(eq(payments.reference, reference));
    return payment ?? null;
  }

  async getById(id: string) {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment ?? null;
  }

  async updateByReference(reference: string, updates: Partial<PaymentInsert>) {
    const [updated] = await db
      .update(payments)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(payments.reference, reference))
      .returning();
    return updated;
  }

  async listForUser(userId: string, limit: number, offset: number) {
    return db
      .select()
      .from(payments)
      .where(eq(payments.user_id, userId))
      .orderBy(desc(payments.created_at))
      .limit(limit)
      .offset(offset);
  }
}

const paymentsService = new PaymentsService();
export default paymentsService;
