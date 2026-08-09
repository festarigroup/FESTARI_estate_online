import { db } from "#app/db/db.js";
import { properties, propertyImages } from "#app/db/schema/index.js";
import { PropertyImageInsert, PropertyInsert } from "#app/types/PropertyTypes.js";
import { and, asc, desc, eq, gte, lte, sql } from "drizzle-orm";

type PropertyFilters = {
  location?: string | undefined;
  property_type?: string | undefined;
  listing_type?: string | undefined;
  min_price?: number | undefined;
  max_price?: number | undefined;
  bedrooms?: number | undefined;
  ordering?: string | undefined;
};

class PropertiesService {
  async list(filters: PropertyFilters, limit: number, offset: number) {
    const conditions = [eq(properties.status, "approved")];
    if (filters.location) conditions.push(sql`${properties.location} ILIKE ${"%" + filters.location + "%"}`);
    if (filters.property_type) conditions.push(eq(properties.property_type, filters.property_type as any));
    if (filters.listing_type) conditions.push(eq(properties.listing_type, filters.listing_type as any));
    if (filters.min_price !== undefined) conditions.push(gte(properties.price, String(filters.min_price)));
    if (filters.max_price !== undefined) conditions.push(lte(properties.price, String(filters.max_price)));
    if (filters.bedrooms !== undefined) conditions.push(eq(properties.bedrooms, filters.bedrooms));

    const where = and(...conditions);
    const orderColumn = filters.ordering === "created_at" ? asc(properties.created_at) : desc(properties.created_at);

    const [items, countRows] = await Promise.all([
      db.select().from(properties).where(where).orderBy(orderColumn).limit(limit).offset(offset),
      db.select({ count: sql<number>`count(*)::int` }).from(properties).where(where),
    ]);

    return { items, total: countRows[0]?.count ?? 0 };
  }

  async getById(id: string) {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property ?? null;
  }

  async countByOwner(ownerId: string) {
    const [result] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(properties)
      .where(eq(properties.owner_id, ownerId));
    return result?.count ?? 0;
  }

  async create(row: PropertyInsert) {
    const [created] = await db.insert(properties).values(row).returning();
    return created;
  }

  async update(id: string, updates: Partial<PropertyInsert>) {
    const [updated] = await db
      .update(properties)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(properties.id, id))
      .returning();
    return updated;
  }

  async delete(id: string) {
    await db.delete(properties).where(eq(properties.id, id));
  }

  async incrementViews(id: string) {
    await db
      .update(properties)
      .set({ views_count: sql`${properties.views_count} + 1` })
      .where(eq(properties.id, id));
  }

  async setStatus(id: string, status: "approved" | "rejected") {
    return this.update(id, { status });
  }

  async getTrending(limit: number) {
    return db
      .select()
      .from(properties)
      .where(eq(properties.status, "approved"))
      .orderBy(desc(properties.is_featured), desc(properties.views_count))
      .limit(limit);
  }

  async getCategoryCounts() {
    const rows = await db
      .select({ listing_type: properties.listing_type, count: sql<number>`count(*)::int` })
      .from(properties)
      .where(eq(properties.status, "approved"))
      .groupBy(properties.listing_type);

    return rows.map((row) => ({ id: row.listing_type, label: row.listing_type, count: row.count }));
  }

  async addImage(row: PropertyImageInsert) {
    const [created] = await db.insert(propertyImages).values(row).returning();
    return created;
  }

  async getImages(propertyId: string) {
    return db
      .select()
      .from(propertyImages)
      .where(eq(propertyImages.property_id, propertyId))
      .orderBy(asc(propertyImages.position));
  }

  async getImageById(id: string) {
    const [image] = await db.select().from(propertyImages).where(eq(propertyImages.id, id));
    return image ?? null;
  }

  async deleteImage(id: string) {
    await db.delete(propertyImages).where(eq(propertyImages.id, id));
  }
}

const propertiesService = new PropertiesService();
export default propertiesService;
