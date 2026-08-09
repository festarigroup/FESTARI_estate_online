import { db } from "#app/db/db.js";
import {
  postComments,
  postImages,
  postLikes,
  postShares,
  posts,
  savedPosts,
  users,
} from "#app/db/schema/index.js";
import { PostImageInsert, PostInsert } from "#app/types/FeedTypes.js";
import { and, desc, eq, getTableColumns, sql } from "drizzle-orm";

function withCounts(currentUserId?: string) {
  return {
    likes_count: sql<number>`(select count(*)::int from ${postLikes} where ${postLikes.post_id} = ${posts.id})`,
    comments_count: sql<number>`(select count(*)::int from ${postComments} where ${postComments.post_id} = ${posts.id})`,
    shares_count: sql<number>`(select count(*)::int from ${postShares} where ${postShares.post_id} = ${posts.id})`,
    is_liked: currentUserId
      ? sql<boolean>`exists (select 1 from ${postLikes} where ${postLikes.post_id} = ${posts.id} and ${postLikes.user_id} = ${currentUserId})`
      : sql<boolean>`false`,
    is_saved: currentUserId
      ? sql<boolean>`exists (select 1 from ${savedPosts} where ${savedPosts.post_id} = ${posts.id} and ${savedPosts.user_id} = ${currentUserId})`
      : sql<boolean>`false`,
  };
}

class PostsService {
  async list(kind: string | undefined, limit: number, offset: number, currentUserId?: string) {
    const where = kind ? eq(posts.kind, kind as any) : undefined;

    const [items, [{ count }]] = await Promise.all([
      db
        .select({
          ...getTableColumns(posts),
          author: {
            id: users.id,
            firstname: users.firstname,
            lastname: users.lastname,
            profile_picture: users.profile_picture,
          },
          ...withCounts(currentUserId),
        })
        .from(posts)
        .innerJoin(users, eq(users.id, posts.author_id))
        .where(where)
        .orderBy(desc(posts.created_at))
        .limit(limit)
        .offset(offset),
      db.select({ count: sql<number>`count(*)::int` }).from(posts).where(where),
    ]);

    return { items, total: count };
  }

  async getById(id: string, currentUserId?: string) {
    const [post] = await db
      .select({
        ...getTableColumns(posts),
        author: {
          id: users.id,
          firstname: users.firstname,
          lastname: users.lastname,
          profile_picture: users.profile_picture,
        },
        ...withCounts(currentUserId),
      })
      .from(posts)
      .innerJoin(users, eq(users.id, posts.author_id))
      .where(eq(posts.id, id));
    return post ?? null;
  }

  async getRawById(id: string) {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post ?? null;
  }

  async create(row: PostInsert) {
    const [created] = await db.insert(posts).values(row).returning();
    return created;
  }

  async update(id: string, updates: Partial<PostInsert>) {
    const [updated] = await db
      .update(posts)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(posts.id, id))
      .returning();
    return updated;
  }

  async delete(id: string) {
    await db.delete(posts).where(eq(posts.id, id));
  }

  async addImage(row: PostImageInsert) {
    const [image] = await db.insert(postImages).values(row).returning();
    return image;
  }

  async getImages(postId: string) {
    return db.select().from(postImages).where(eq(postImages.post_id, postId)).orderBy(postImages.position);
  }
}

const postsService = new PostsService();
export default postsService;
