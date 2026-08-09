import { db } from "#app/db/db.js";
import { user_otps } from "#app/db/schema.js";
import { Transaction } from "#app/types/DbTransactionType.js";
import { and, desc, eq, isNull, lt, sql } from "drizzle-orm";

type OtpInsert = typeof user_otps.$inferInsert;

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

  async getLatestOtp(
    userId: string,
    purpose: "login" | "password_reset" | "email_verification" | "payment",
  ) {
    return db.query.user_otps.findFirst({
      where: and(eq(user_otps.user_id, userId), eq(user_otps.purpose, purpose)),
      orderBy: [desc(user_otps.created_at)],
    });
  }

  async getLatestOtpTx(
    tx: any,
    userId: string,
    purpose: "login" | "password_reset" | "email_verification" | "payment",
  ) {
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

  async incrementAttemptsTx(tx: any, id: string) {
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

  async lockOtpTx(tx: any, id: string) {
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

  async deleteOtpTx(tx: any, id: string) {
    await tx.delete(user_otps).where(eq(user_otps.id, id));
  }

  async deleteExpiredOtps() {
    await db.delete(user_otps).where(lt(user_otps.expires_at, new Date()));
  }
}

const otpService = new OtpService();
export default otpService;
