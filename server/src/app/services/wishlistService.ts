import { db } from "#app/db/db.js";
import { properties, wishlists } from "#app/db/schema/index.js";
import { and, desc, eq, getTableColumns } from "drizzle-orm";

class WishlistService {
  async isWishlisted(userId: string, propertyId: string) {
    const [row] = await db
      .select()
      .from(wishlists)
      .where(and(eq(wishlists.user_id, userId), eq(wishlists.property_id, propertyId)));
    return Boolean(row);
  }

  async add(userId: string, propertyId: string) {
    const [created] = await db
      .insert(wishlists)
      .values({ user_id: userId, property_id: propertyId })
      .onConflictDoNothing()
      .returning();
    return created ?? null;
  }

  async remove(userId: string, propertyId: string) {
    await db
      .delete(wishlists)
      .where(and(eq(wishlists.user_id, userId), eq(wishlists.property_id, propertyId)));
  }

  async listForUser(userId: string) {
    return db
      .select({ ...getTableColumns(properties), wishlisted_at: wishlists.created_at })
      .from(wishlists)
      .innerJoin(properties, eq(properties.id, wishlists.property_id))
      .where(eq(wishlists.user_id, userId))
      .orderBy(desc(wishlists.created_at));
  }
}

const wishlistService = new WishlistService();
export default wishlistService;
