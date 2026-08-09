import { userRoles, users } from "#app/db/schema/index.js";

export type UserInsert = typeof users.$inferInsert;
export type UserRow = typeof users.$inferSelect;
export type UserWithRoles = typeof users.$inferSelect & {
  roles: Array<typeof userRoles.$inferSelect.role>;
};

export interface UserRegisterDto {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  roles: Array<typeof userRoles.$inferSelect.role>;
}
