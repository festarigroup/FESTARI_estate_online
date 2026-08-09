import { db } from "#app/db/db.js";
import { refreshTokens } from "#app/db/schema/index.js";
import { hashPassword } from "#app/utils/crypto.js";
import { and, desc, eq, isNull } from "drizzle-orm";

type SessionMeta = {
  deviceName?: string;
  platform?: string;
  ipAddress?: string | undefined;
  userAgent?: string | undefined;
};

const createSession = async (userId: string, refreshToken: string, meta: SessionMeta = {}) => {
  const tokenHash = await hashPassword(refreshToken);
  const [session] = await db
    .insert(refreshTokens)
    .values({
      user_id: userId,
      token_hash: tokenHash,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      device_name: meta.deviceName ?? null,
      platform: meta.platform ?? null,
      ip_address: meta.ipAddress ?? null,
      user_agent: meta.userAgent ?? null,
      last_active_at: new Date(),
    })
    .returning();
  return session;
};

const listSessions = async (userId: string) => {
  return db
    .select({
      id: refreshTokens.id,
      device_name: refreshTokens.device_name,
      platform: refreshTokens.platform,
      ip_address: refreshTokens.ip_address,
      last_active_at: refreshTokens.last_active_at,
      created_at: refreshTokens.created_at,
      revoked_at: refreshTokens.revoked_at,
    })
    .from(refreshTokens)
    .where(and(eq(refreshTokens.user_id, userId), isNull(refreshTokens.revoked_at)))
    .orderBy(desc(refreshTokens.last_active_at));
};

const revokeSession = async (userId: string, sessionId: string) => {
  await db
    .update(refreshTokens)
    .set({ revoked_at: new Date() })
    .where(and(eq(refreshTokens.id, sessionId), eq(refreshTokens.user_id, userId)));
};

const revokeAllSessions = async (userId: string) => {
  await db
    .update(refreshTokens)
    .set({ revoked_at: new Date() })
    .where(and(eq(refreshTokens.user_id, userId), isNull(refreshTokens.revoked_at)));
};

export default {
  createSession,
  listSessions,
  revokeSession,
  revokeAllSessions,
};
