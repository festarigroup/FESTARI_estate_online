import { db } from "#app/db/db.js";
import { userRoles } from "#app/db/schema/index.js";
import { Transaction } from "#app/types/DbTransactionType.js";
import { RoleRow } from "#app/types/RoleTypes.js";
import { and, eq } from "drizzle-orm";

class RolesService {
  async createRoleTx(tx: Transaction, row: RoleRow) {
    const [created] = await tx.insert(userRoles).values(row).returning();
    if (!created) throw new Error("Failed to create role");
    return created;
  }

  /** Idempotent — relies on the (user_id, role) primary key to no-op if the user already has this role. */
  async addRole(userId: string, role: RoleRow["role"]) {
    await db.insert(userRoles).values({ user_id: userId, role }).onConflictDoNothing();
  }

  async hasRoleTx(
    tx: Transaction,
    params: { user_id: string; role: string },
  ): Promise<boolean> {
    const result = await tx
      .select()
      .from(userRoles)
      .where(
        and(eq(userRoles.user_id, params.user_id), eq(userRoles.role, params.role as any)),
      )
      .limit(1);

    return result.length > 0;
  }
}

const rolesService = new RolesService();
export default rolesService;
