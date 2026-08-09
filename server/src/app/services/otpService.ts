import { db } from "#app/db/db.js";
import { userOtps as user_otps } from "#app/db/schema/index.js";
import { Transaction } from "#app/types/DbTransactionType.js";
import { and, desc, eq, lt, sql } from "drizzle-orm";

type OtpInsert = typeof user_otps.$inferInsert;
type OtpPurpose = "email_verification" | "password_reset";

class OtpService {
  async createOtp(row: OtpInsert) {
    return db.transaction(async (tx) => {
      const now = new Date();

      // remove expired OTPs
      await tx
        .delete(user_otps)
        .where(
          and(
            eq(user_otps.user_id, row.user_id),
            eq(user_otps.purpose, row.purpose),
            lt(user_otps.expires_at, now),
          ),
        );
      

      // invalidate any existing active OTP
      await tx
        .delete(user_otps)
        .where(
          and(
            eq(user_otps.user_id, row.user_id),
            eq(user_otps.purpose, row.purpose),
          ),
        );


      const [otp] = await tx.insert(user_otps).values(row).returning();
      return otp;
    });
  }

  async createOtpTx(tx: Transaction, row: OtpInsert) {
    const now = new Date();
    await tx
      .delete(user_otps)
      .where(
        and(
          eq(user_otps.user_id, row.user_id),
          eq(user_otps.purpose, row.purpose),
          lt(user_otps.expires_at, now),
        ),
      );
    await tx
      .delete(user_otps)
      .where(
        and(
          eq(user_otps.user_id, row.user_id),
          eq(user_otps.purpose, row.purpose),
        ),
      );
      
    const [otp] = await tx.insert(user_otps).values(row).returning();
    return otp;
  }

  async getLatestOtp(userId: string, purpose: OtpPurpose) {
    const [otp] = await db
      .select()
      .from(user_otps)
      .where(and(eq(user_otps.user_id, userId), eq(user_otps.purpose, purpose)))
      .orderBy(desc(user_otps.created_at))
      .limit(1);
    return otp ?? null;
  }

  async getLatestOtpTx(tx: Transaction, userId: string, purpose: OtpPurpose) {
    const [otp] = await tx
      .select()
      .from(user_otps)
      .where(and(eq(user_otps.user_id, userId), eq(user_otps.purpose, purpose)))
      .orderBy(desc(user_otps.created_at))
      .limit(1);

    return otp ?? null;
  }

  async incrementAttempts(id: string) {
    await db
      .update(user_otps)
      .set({
        attempt_count: sql`${user_otps.attempt_count} + 1`,
      })
      .where(eq(user_otps.id, id));
  }

  async incrementAttemptsTx(tx: Transaction, id: string) {
    await tx
      .update(user_otps)
      .set({
        attempt_count: sql`${user_otps.attempt_count} + 1`,
      })
      .where(eq(user_otps.id, id));
  }

  async lockOtp(id: string) {
    await db
      .update(user_otps)
      .set({
        locked_at: new Date(),
      })
      .where(eq(user_otps.id, id));
  }

  async lockOtpTx(tx: Transaction, id: string) {
    await tx
      .update(user_otps)
      .set({
        locked_at: new Date(),
      })
      .where(eq(user_otps.id, id));
  }

  async deleteOtp(id: string) {
    await db.delete(user_otps).where(eq(user_otps.id, id));
  }

  async deleteOtpTx(tx: Transaction, id: string) {
    await tx.delete(user_otps).where(eq(user_otps.id, id));
  }

  async deleteExpiredOtps() {
    await db.delete(user_otps).where(lt(user_otps.expires_at, new Date()));
  }
}

const otpService = new OtpService();
export default otpService;
