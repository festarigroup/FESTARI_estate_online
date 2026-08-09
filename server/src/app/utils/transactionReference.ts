import { randomBytes } from "crypto";
import { db } from "#app/db/db.js";
import { payments } from "#app/db/schema/index.js";
import { eq } from "drizzle-orm";

const REF_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateTransactionReference(length = 16): string {
  const bytes = randomBytes(length);
  let result = "";

  for (let i = 0; i < length; i += 1) {
    result += REF_CHARS[bytes[i]! % REF_CHARS.length];
  }

  return result;
}

export async function generateUniqueTransactionReference(
  length = 16,
): Promise<string> {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const reference = generateTransactionReference(length);
    const existing = await db
      .select({ id: payments.id })
      .from(payments)
      .where(eq(payments.reference, reference))
      .limit(1);

    if (existing.length === 0) {
      return reference;
    }
  }

  throw new Error("Failed to generate unique transaction reference");
}
