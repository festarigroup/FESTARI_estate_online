import { artisanInquiries, propertyInquiries } from "#app/db/schema/index.js";

export type PropertyInquiryInsert = typeof propertyInquiries.$inferInsert;
export type PropertyInquiryRow = typeof propertyInquiries.$inferSelect;

export type ArtisanInquiryInsert = typeof artisanInquiries.$inferInsert;
export type ArtisanInquiryRow = typeof artisanInquiries.$inferSelect;
