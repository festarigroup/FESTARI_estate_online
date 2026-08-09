import { payments, subscriptionPlans } from "#app/db/schema/index.js";

export type PlanInsert = typeof subscriptionPlans.$inferInsert;
export type PlanRow = typeof subscriptionPlans.$inferSelect;

export type PaymentInsert = typeof payments.$inferInsert;
export type PaymentRow = typeof payments.$inferSelect;
