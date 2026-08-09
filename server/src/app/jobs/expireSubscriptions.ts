import cron from "node-cron";
import { db } from "#app/db/db.js";
import { subscriptions } from "#app/db/schema/index.js";
import { and, eq, lt } from "drizzle-orm";

async function expireSubscriptions() {
  await db
    .update(subscriptions)
    .set({ status: "expired", updated_at: new Date() })
    .where(and(eq(subscriptions.status, "active"), lt(subscriptions.expires_at, new Date())));
}

cron.schedule("0 * * * *", () => {
  expireSubscriptions().catch((error) => {
    console.error("Failed to expire subscriptions", error);
  });
});
