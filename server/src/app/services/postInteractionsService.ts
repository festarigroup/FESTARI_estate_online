import { db } from "#app/db/db.js";
import { postComments, postLikes, posts, postShares, savedPosts, users } from "#app/db/schema/index.js";
import { PostCommentInsert } from "#app/types/FeedTypes.js";
import { and, desc, eq, getTableColumns, sql } from "drizzle-orm";

class PostInteractionsService {
  async like(postId: string, userId: string) {
    await db.insert(postLikes).values({ post_id: postId, user_id: userId }).onConflictDoNothing();
  }

  async unlike(postId: string, userId: string) {
    await db.delete(postLikes).where(and(eq(postLikes.post_id, postId), eq(postLikes.user_id, userId)));
  }

  async addComment(row: PostCommentInsert) {
    const [comment] = await db.insert(postComments).values(row).returning();
    return comment;
  }

  async listComments(postId: string, limit: number, offset: number) {
    const [items, [{ count }]] = await Promise.all([
      db
        .select({
          ...getTableColumns(postComments),
          author: {
            id: users.id,
            firstname: users.firstname,
            lastname: users.lastname,
            profile_picture: users.profile_picture,
          },
        })
        .from(postComments)
        .innerJoin(users, eq(users.id, postComments.author_id))
        .where(eq(postComments.post_id, postId))
        .orderBy(desc(postComments.created_at))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(postComments)
        .where(eq(postComments.post_id, postId)),
    ]);

    return { items, total: count };
  }

  async getCommentById(id: string) {
    const [comment] = await db.select().from(postComments).where(eq(postComments.id, id));
    return comment ?? null;
  }

  async deleteComment(id: string) {
    await db.delete(postComments).where(eq(postComments.id, id));
  }

  async recordShare(postId: string, userId: string) {
    const [share] = await db.insert(postShares).values({ post_id: postId, user_id: userId }).returning();
    return share;
  }

  async save(postId: string, userId: string) {
    await db.insert(savedPosts).values({ post_id: postId, user_id: userId }).onConflictDoNothing();
  }

  async unsave(postId: string, userId: string) {
    await db.delete(savedPosts).where(and(eq(savedPosts.post_id, postId), eq(savedPosts.user_id, userId)));
  }

  async listSaved(userId: string) {
    return db
      .select({ ...getTableColumns(posts), saved_at: savedPosts.created_at })
      .from(savedPosts)
      .innerJoin(posts, eq(posts.id, savedPosts.post_id))
      .where(eq(savedPosts.user_id, userId))
      .orderBy(desc(savedPosts.created_at));
  }
}

const postInteractionsService = new PostInteractionsService();
export default postInteractionsService;
