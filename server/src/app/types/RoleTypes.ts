import { userRoles } from "#app/db/schema/index.js";

export type RoleInsert = typeof userRoles.$inferInsert;
export type RoleRow = typeof userRoles.$inferSelect;
