import { artisanHireRequests, artisanProfiles, artisanReviews } from "#app/db/schema/index.js";

export type ArtisanProfileInsert = typeof artisanProfiles.$inferInsert;
export type ArtisanProfileRow = typeof artisanProfiles.$inferSelect;
export type ArtisanHireRequestInsert = typeof artisanHireRequests.$inferInsert;
export type ArtisanHireRequestRow = typeof artisanHireRequests.$inferSelect;
export type ArtisanReviewInsert = typeof artisanReviews.$inferInsert;
export type ArtisanReviewRow = typeof artisanReviews.$inferSelect;
