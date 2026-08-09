import { userRoles, users } from "#app/db/schema.js";

export type UserInsert = typeof users.$inferInsert;
export type UserRow = typeof users.$inferSelect;
export type UserWithRoles = typeof users.$inferSelect & {
  roles: Array<typeof userRoles.$inferSelect.role>;
};

export interface UserEntity {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password_hash: string;
  role: string;
}

export interface UserCreateDto {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  passwordConfirm?: string;
  role?: string;
  is_active?: boolean;
}
