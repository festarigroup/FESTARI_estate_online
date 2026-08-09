import { follows } from "#app/db/schema/index.js";

export type FollowInsert = typeof follows.$inferInsert;
export type FollowRow = typeof follows.$inferSelect;
