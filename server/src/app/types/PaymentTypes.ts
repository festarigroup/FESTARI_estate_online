import { subscriptionPlans } from "#app/db/schema.js";

export type PaymentInsert = typeof subscriptionPlans.$inferInsert
export type PaymentRow = typeof subscriptionPlans.$inferSelect