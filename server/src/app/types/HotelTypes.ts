import { hotelBookings, hotelImages, hotelReviews, hotels } from "#app/db/schema/index.js";

export type HotelInsert = typeof hotels.$inferInsert;
export type HotelRow = typeof hotels.$inferSelect;
export type HotelImageInsert = typeof hotelImages.$inferInsert;
export type HotelBookingInsert = typeof hotelBookings.$inferInsert;
export type HotelBookingRow = typeof hotelBookings.$inferSelect;
export type HotelReviewInsert = typeof hotelReviews.$inferInsert;
export type HotelReviewRow = typeof hotelReviews.$inferSelect;
