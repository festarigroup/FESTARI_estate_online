import { db } from "#app/db/db.js";
import { hotelBookings, hotelImages, hotels } from "#app/db/schema/index.js";
import { HotelBookingInsert, HotelImageInsert, HotelInsert } from "#app/types/HotelTypes.js";
import { and, asc, desc, eq, sql } from "drizzle-orm";

class HotelsService {
  async list(location: string | undefined, limit: number, offset: number) {
    const where = location
      ? and(eq(hotels.status, "approved"), sql`${hotels.location} ILIKE ${"%" + location + "%"}`)
      : eq(hotels.status, "approved");

    const [items, countRows] = await Promise.all([
      db.select().from(hotels).where(where).orderBy(desc(hotels.created_at)).limit(limit).offset(offset),
      db.select({ count: sql<number>`count(*)::int` }).from(hotels).where(where),
    ]);
    return { items, total: countRows[0]?.count ?? 0 };
  }

  async getById(id: string) {
    const [hotel] = await db.select().from(hotels).where(eq(hotels.id, id));
    return hotel ?? null;
  }

  async getImages(hotelId: string) {
    return db.select().from(hotelImages).where(eq(hotelImages.hotel_id, hotelId)).orderBy(asc(hotelImages.position));
  }

  async countByOwner(ownerId: string) {
    const [result] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(hotels)
      .where(eq(hotels.owner_id, ownerId));
    return result?.count ?? 0;
  }

  async create(row: HotelInsert) {
    const [created] = await db.insert(hotels).values(row).returning();
    return created;
  }

  async update(id: string, updates: Partial<HotelInsert>) {
    const [updated] = await db
      .update(hotels)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(hotels.id, id))
      .returning();
    return updated;
  }

  async delete(id: string) {
    await db.delete(hotels).where(eq(hotels.id, id));
  }

  async setStatus(id: string, status: "approved" | "rejected") {
    return this.update(id, { status });
  }

  async addImage(row: HotelImageInsert) {
    const [image] = await db.insert(hotelImages).values(row).returning();
    return image;
  }

  async getImageById(imageId: string) {
    const [image] = await db.select().from(hotelImages).where(eq(hotelImages.id, imageId));
    return image ?? null;
  }

  async deleteImage(imageId: string) {
    await db.delete(hotelImages).where(eq(hotelImages.id, imageId));
  }

  async createBooking(row: HotelBookingInsert) {
    const [booking] = await db.insert(hotelBookings).values(row).returning();
    if (!booking) throw new Error("Failed to create booking");
    return booking;
  }

  async getBookingById(id: string) {
    const [booking] = await db.select().from(hotelBookings).where(eq(hotelBookings.id, id));
    return booking ?? null;
  }

  async listBookingsForHotel(hotelId: string) {
    return db.select().from(hotelBookings).where(eq(hotelBookings.hotel_id, hotelId)).orderBy(desc(hotelBookings.created_at));
  }

  async listBookingsForUser(userId: string) {
    return db.select().from(hotelBookings).where(eq(hotelBookings.user_id, userId)).orderBy(desc(hotelBookings.created_at));
  }

  async updateBooking(id: string, updates: Partial<HotelBookingInsert>) {
    const [updated] = await db
      .update(hotelBookings)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(hotelBookings.id, id))
      .returning();
    return updated;
  }

  async cancelBooking(id: string) {
    return this.updateBooking(id, { status: "cancelled" });
  }
}

const hotelsService = new HotelsService();
export default hotelsService;
