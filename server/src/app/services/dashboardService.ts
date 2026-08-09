import { db } from "#app/db/db.js";
import {
  artisanProfiles,
  hotelBookings,
  hotels,
  payments,
  properties,
  subscriptions,
  users,
} from "#app/db/schema/index.js";
import { desc, eq, sql } from "drizzle-orm";

class DashboardService {
  async getStats() {
    const [[userCount], [propertyCount], [hotelCount], [artisanCount], [activeSubscriptionCount], [bookingCount], revenue] =
      await Promise.all([
        db.select({ count: sql<number>`count(*)::int` }).from(users),
        db.select({ count: sql<number>`count(*)::int` }).from(properties),
        db.select({ count: sql<number>`count(*)::int` }).from(hotels),
        db.select({ count: sql<number>`count(*)::int` }).from(artisanProfiles),
        db
          .select({ count: sql<number>`count(*)::int` })
          .from(subscriptions)
          .where(eq(subscriptions.status, "active")),
        db.select({ count: sql<number>`count(*)::int` }).from(hotelBookings),
        db
          .select({ total: sql<string>`coalesce(sum(${payments.amount}), 0)` })
          .from(payments)
          .where(eq(payments.status, "success")),
      ]);

    const [paymentsByType] = await Promise.all([
      db
        .select({ payment_type: payments.payment_type, count: sql<number>`count(*)::int` })
        .from(payments)
        .where(eq(payments.status, "success"))
        .groupBy(payments.payment_type),
    ]);

    return {
      total_users: userCount?.count ?? 0,
      total_properties: propertyCount?.count ?? 0,
      total_hotels: hotelCount?.count ?? 0,
      total_artisans: artisanCount?.count ?? 0,
      active_subscriptions: activeSubscriptionCount?.count ?? 0,
      total_bookings: bookingCount?.count ?? 0,
      total_revenue: revenue[0]?.total ?? "0",
      payments_by_type: paymentsByType,
    };
  }

  async getRecentActivity(limit = 20) {
    const [recentProperties, recentHotels, recentArtisans, recentPayments] = await Promise.all([
      db.select().from(properties).orderBy(desc(properties.created_at)).limit(limit),
      db.select().from(hotels).orderBy(desc(hotels.created_at)).limit(limit),
      db.select().from(artisanProfiles).orderBy(desc(artisanProfiles.created_at)).limit(limit),
      db.select().from(payments).orderBy(desc(payments.created_at)).limit(limit),
    ]);

    return { recent_properties: recentProperties, recent_hotels: recentHotels, recent_artisans: recentArtisans, recent_payments: recentPayments };
  }

  async getPendingApprovals() {
    const [pendingProperties, pendingHotels, pendingArtisans] = await Promise.all([
      db.select().from(properties).where(eq(properties.status, "pending")).orderBy(desc(properties.created_at)),
      db.select().from(hotels).where(eq(hotels.status, "pending")).orderBy(desc(hotels.created_at)),
      db
        .select()
        .from(artisanProfiles)
        .where(eq(artisanProfiles.status, "pending"))
        .orderBy(desc(artisanProfiles.created_at)),
    ]);

    return { properties: pendingProperties, hotels: pendingHotels, artisans: pendingArtisans };
  }
}

const dashboardService = new DashboardService();
export default dashboardService;
