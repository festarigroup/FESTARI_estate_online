import crypto from "crypto";
import bcrypt from "bcrypt";
import CustomError from "#app/utils/CustomError.js";

const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET;
if (!ENCRYPTION_SECRET) {
  throw new CustomError("ENCRYPTION_SECRET must be set", 500);
}
const KEY = crypto.createHash("sha256").update(ENCRYPTION_SECRET).digest();
const IV_LENGTH = 12;

export function encryptText(clearText: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-gcm", KEY, iv);
  const encrypted = Buffer.concat([cipher.update(clearText, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decryptText(cipherText: string): string {
  try {
    const buffer = Buffer.from(cipherText, "base64");
    const iv = buffer.slice(0, IV_LENGTH);
    const tag = buffer.slice(IV_LENGTH, IV_LENGTH + 16);
    const encrypted = buffer.slice(IV_LENGTH + 16);

    const decipher = crypto.createDecipheriv("aes-256-gcm", KEY, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
  } catch (err) {
    throw new CustomError("Unable to decrypt secure value", 500);
  }
}

export async function hashPassword(value: string) : Promise<string> {
  const secret = process.env.PASSWORD_SECRET || "default_secret";
  return await bcrypt.hash(value + secret, 6);
}

export async function comparePassword(rawData: string, hashedData: string) : Promise<boolean> {
  const secret = process.env.PASSWORD_SECRET || "default_secret";
  return bcrypt.compare(rawData + secret, hashedData);
}

export function sanitizeAnswer(answer: string) {
  return answer
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " "); 
}

export function hashAnswer(answer: string) {
  const normalized = sanitizeAnswer(answer);
  return crypto
    .createHmac("sha256", ENCRYPTION_SECRET)
    .update(normalized)
    .digest("hex");
}