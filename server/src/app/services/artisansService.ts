import { db } from "#app/db/db.js";
import { artisanHireRequests, artisanProfiles, artisanReviews } from "#app/db/schema/index.js";
import {
  ArtisanHireRequestInsert,
  ArtisanProfileInsert,
  ArtisanReviewInsert,
} from "#app/types/ArtisanTypes.js";
import { and, avg, count, desc, eq, getTableColumns, sql } from "drizzle-orm";

class ArtisansService {
  async list(serviceType: string | undefined, limit: number, offset: number) {
    const where = serviceType
      ? and(eq(artisanProfiles.status, "approved"), eq(artisanProfiles.service_type, serviceType))
      : eq(artisanProfiles.status, "approved");

    const [items, [{ value }]] = await Promise.all([
      db.select().from(artisanProfiles).where(where).orderBy(desc(artisanProfiles.created_at)).limit(limit).offset(offset),
      db.select({ value: sql<number>`count(*)::int` }).from(artisanProfiles).where(where),
    ]);
    return { items, total: value };
  }

  async getById(id: string) {
    const [profile] = await db.select().from(artisanProfiles).where(eq(artisanProfiles.id, id));
    return profile ?? null;
  }

  async create(row: ArtisanProfileInsert) {
    const [created] = await db.insert(artisanProfiles).values(row).returning();
    return created;
  }

  async update(id: string, updates: Partial<ArtisanProfileInsert>) {
    const [updated] = await db
      .update(artisanProfiles)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(artisanProfiles.id, id))
      .returning();
    return updated;
  }

  async delete(id: string) {
    await db.delete(artisanProfiles).where(eq(artisanProfiles.id, id));
  }

  async setStatus(id: string, status: "approved" | "rejected") {
    return this.update(id, { status });
  }

  async getTop(limit: number) {
    return db
      .select({
        ...getTableColumns(artisanProfiles),
        average_rating: avg(artisanReviews.rating).mapWith(Number),
        review_count: count(artisanReviews.id),
      })
      .from(artisanProfiles)
      .leftJoin(artisanReviews, eq(artisanReviews.artisan_id, artisanProfiles.id))
      .where(eq(artisanProfiles.status, "approved"))
      .groupBy(artisanProfiles.id)
      .orderBy(desc(sql`avg(${artisanReviews.rating})`))
      .limit(limit);
  }

  async getRatingSummary(artisanId: string) {
    const [summary] = await db
      .select({
        average_rating: avg(artisanReviews.rating).mapWith(Number),
        review_count: count(artisanReviews.id),
      })
      .from(artisanReviews)
      .where(eq(artisanReviews.artisan_id, artisanId));
    return summary ?? { average_rating: null, review_count: 0 };
  }

  async createHireRequest(row: ArtisanHireRequestInsert) {
    const [hire] = await db.insert(artisanHireRequests).values(row).returning();
    return hire;
  }

  async getHireRequestById(id: string) {
    const [hire] = await db.select().from(artisanHireRequests).where(eq(artisanHireRequests.id, id));
    return hire ?? null;
  }

  async listHireRequestsForArtisan(artisanId: string) {
    return db
      .select()
      .from(artisanHireRequests)
      .where(eq(artisanHireRequests.artisan_id, artisanId))
      .orderBy(desc(artisanHireRequests.created_at));
  }

  async listHireRequestsForRequester(requesterId: string) {
    return db
      .select()
      .from(artisanHireRequests)
      .where(eq(artisanHireRequests.requester_id, requesterId))
      .orderBy(desc(artisanHireRequests.created_at));
  }

  async updateHireRequestStatus(id: string, status: "accepted" | "rejected" | "completed") {
    const [updated] = await db
      .update(artisanHireRequests)
      .set({ status, updated_at: new Date() })
      .where(eq(artisanHireRequests.id, id))
      .returning();
    return updated;
  }

  async createReview(row: ArtisanReviewInsert) {
    const [review] = await db.insert(artisanReviews).values(row).returning();
    return review;
  }

  async listReviews(artisanId: string) {
    return db
      .select()
      .from(artisanReviews)
      .where(eq(artisanReviews.artisan_id, artisanId))
      .orderBy(desc(artisanReviews.created_at));
  }
}

const artisansService = new ArtisansService();
export default artisansService;
