import {
  postComments,
  postImages,
  postLikes,
  postShares,
  posts,
  savedPosts,
  stories,
  storyViews,
} from "#app/db/schema/index.js";

export type StoryInsert = typeof stories.$inferInsert;
export type StoryRow = typeof stories.$inferSelect;
export type StoryViewInsert = typeof storyViews.$inferInsert;

export type PostInsert = typeof posts.$inferInsert;
export type PostRow = typeof posts.$inferSelect;
export type PostImageInsert = typeof postImages.$inferInsert;
export type PostCommentInsert = typeof postComments.$inferInsert;
export type PostCommentRow = typeof postComments.$inferSelect;
export type PostLikeInsert = typeof postLikes.$inferInsert;
export type PostShareInsert = typeof postShares.$inferInsert;
export type SavedPostInsert = typeof savedPosts.$inferInsert;
