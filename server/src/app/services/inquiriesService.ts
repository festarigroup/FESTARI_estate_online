import { db } from "#app/db/db.js";
import { artisanInquiries, propertyInquiries } from "#app/db/schema/index.js";
import { ArtisanInquiryInsert, PropertyInquiryInsert } from "#app/types/InquiryTypes.js";
import { desc, eq } from "drizzle-orm";

class InquiriesService {
  async createPropertyInquiry(row: PropertyInquiryInsert) {
    const [created] = await db.insert(propertyInquiries).values(row).returning();
    return created;
  }

  async listPropertyInquiries(propertyId: string) {
    return db
      .select()
      .from(propertyInquiries)
      .where(eq(propertyInquiries.property_id, propertyId))
      .orderBy(desc(propertyInquiries.created_at));
  }

  async getPropertyInquiryById(id: string) {
    const [row] = await db.select().from(propertyInquiries).where(eq(propertyInquiries.id, id));
    return row ?? null;
  }

  async markPropertyInquiryRead(id: string) {
    const [updated] = await db
      .update(propertyInquiries)
      .set({ is_read: true })
      .where(eq(propertyInquiries.id, id))
      .returning();
    return updated;
  }

  async deletePropertyInquiry(id: string) {
    await db.delete(propertyInquiries).where(eq(propertyInquiries.id, id));
  }

  async createArtisanInquiry(row: ArtisanInquiryInsert) {
    const [created] = await db.insert(artisanInquiries).values(row).returning();
    return created;
  }

  async listArtisanInquiries(artisanId: string) {
    return db
      .select()
      .from(artisanInquiries)
      .where(eq(artisanInquiries.artisan_id, artisanId))
      .orderBy(desc(artisanInquiries.created_at));
  }

  async getArtisanInquiryById(id: string) {
    const [row] = await db.select().from(artisanInquiries).where(eq(artisanInquiries.id, id));
    return row ?? null;
  }

  async markArtisanInquiryRead(id: string) {
    const [updated] = await db
      .update(artisanInquiries)
      .set({ is_read: true })
      .where(eq(artisanInquiries.id, id))
      .returning();
    return updated;
  }

  async deleteArtisanInquiry(id: string) {
    await db.delete(artisanInquiries).where(eq(artisanInquiries.id, id));
  }
}

const inquiriesService = new InquiriesService();
export default inquiriesService;
