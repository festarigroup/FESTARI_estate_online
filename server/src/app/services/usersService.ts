import { db } from "#app/db/db.js";
import { userRoles, users } from "#app/db/schema/index.js";
import { Transaction } from "#app/types/DbTransactionType.js";
import { UserInsert, UserRow, UserWithRoles } from "#app/types/UserTypes.js";
import { eq, getTableColumns, sql } from "drizzle-orm";

class UserService {
  async getUsers(limit: number, offset: number): Promise<UserRow[]> {
    return db.select().from(users).limit(limit).offset(offset);
  }

  async countUsers(): Promise<number> {
    const [result] = await db.select({ count: sql`count(*)` }).from(users);
    return Number(result?.count ?? 0);
  }

  async getUserById(id: string): Promise<UserWithRoles | null> {
    const results = await db
      .select({
        ...getTableColumns(users),
        role: userRoles.role,
      })
      .from(users)
      // left join: a Google-created account can exist with zero roles until
      // the client forces a "choose your role" step, and an inner join here
      // would make such a user invisible to lookups — including `protect`,
      // which loads the user by id on every authenticated request.
      .leftJoin(userRoles, eq(userRoles.user_id, users.id))
      .where(eq(users.id, id));
    return mapUserWithRoles(results) ?? null;
  }

  async getUserByEmail(email: string): Promise<UserWithRoles | null> {
    const results = await db
      .select({
        ...getTableColumns(users),
        role: userRoles.role,
      })
      .from(users)
      .leftJoin(userRoles, eq(userRoles.user_id, users.id))
      .where(eq(users.email, email.toLowerCase()));
    return mapUserWithRoles(results) ?? null;
  }

  async getUserByGoogleId(googleId: string): Promise<UserWithRoles | null> {
    const results = await db
      .select({
        ...getTableColumns(users),
        role: userRoles.role,
      })
      .from(users)
      .leftJoin(userRoles, eq(userRoles.user_id, users.id))
      .where(eq(users.googleId, googleId.toLowerCase()));
    return mapUserWithRoles(results) ?? null;
  }

  async getUserByPhone(phone: string): Promise<UserWithRoles | null> {
    const results = await db
      .select({
        ...getTableColumns(users),
        role: userRoles.role,
      })
      .from(users)
      .leftJoin(userRoles, eq(userRoles.user_id, users.id))
      .where(eq(users.phone, phone));
    return mapUserWithRoles(results) ?? null;
  }

  async createUser(row: UserInsert): Promise<UserRow> {
    const [created] = await db.insert(users).values(row).returning();
    if (!created) throw new Error("Failed to create user");
    return created;
  }

  async createUserTx(tx: Transaction, row: UserInsert): Promise<UserRow> {
    const [created] = await tx.insert(users).values(row).returning();
    if (!created) throw new Error("Failed to create user");
    return created;
  }

  async updateUser(
    id: string,
    updates: Partial<UserInsert>,
  ): Promise<UserRow | undefined> {
    const result = await db
      .update(users)
      .set({ ...updates, updated_at: new Date() } as Partial<UserInsert>)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async updateUserTx(
    tx: Transaction,
    id: string,
    updates: Partial<UserInsert>,
  ): Promise<UserRow | undefined> {
    const result = await tx
      .update(users)
      .set({ ...updates, updated_at: new Date() } as Partial<UserInsert>)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }
}

function mapUserWithRoles(
  rows: Array<
    typeof users.$inferSelect & {
      role: typeof userRoles.$inferSelect.role | null;
    }
  >,
): UserWithRoles | null {
  if (rows.length === 0) return null;
  const first = rows[0]!;
  const { role, ...user } = first;
  const roles = rows
    .map((r) => r.role)
    .filter((r): r is typeof userRoles.$inferSelect.role => r !== null);
  return { ...user, roles };
}

const userService = new UserService();
export default userService;
