import { properties, propertyImages, wishlists } from "#app/db/schema/index.js";

export type PropertyInsert = typeof properties.$inferInsert;
export type PropertyRow = typeof properties.$inferSelect;

export type PropertyImageInsert = typeof propertyImages.$inferInsert;
export type PropertyImageRow = typeof propertyImages.$inferSelect;

export type WishlistInsert = typeof wishlists.$inferInsert;
export type WishlistRow = typeof wishlists.$inferSelect;
