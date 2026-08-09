import { db } from "#app/db/db.js";
import {
  artisanProfiles,
  postComments,
  postImages,
  postLikes,
  posts,
  postShares,
  properties,
  savedPosts,
  users,
} from "#app/db/schema/index.js";
import { PostImageInsert, PostInsert } from "#app/types/FeedTypes.js";
import { desc, eq, getTableColumns, inArray, sql } from "drizzle-orm";

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

function baseSelection(currentUserId?: string) {
  return {
    ...getTableColumns(posts),
    author: {
      id: users.id,
      firstname: users.firstname,
      lastname: users.lastname,
      profile_picture: users.profile_picture,
    },
    linked_property: {
      id: properties.id,
      title: properties.title,
      price: properties.price,
      location: properties.location,
      listing_type: properties.listing_type,
      property_type: properties.property_type,
      bedrooms: properties.bedrooms,
      bathrooms: properties.bathrooms,
      area_sqm: properties.area_sqm,
    },
    linked_artisan: {
      id: artisanProfiles.id,
      service_type: artisanProfiles.service_type,
    },
    ...withCounts(currentUserId),
  };
}

function withJoins<T extends ReturnType<typeof db.select>>(query: T) {
  return (query as any)
    .from(posts)
    .innerJoin(users, eq(users.id, posts.author_id))
    .leftJoin(properties, eq(properties.id, posts.linked_property_id))
    .leftJoin(artisanProfiles, eq(artisanProfiles.id, posts.linked_artisan_id));
}

function normalizeLinkedRows(rows: any[]) {
  return rows.map((row) => ({
    ...row,
    linked_property: row.linked_property?.id ? row.linked_property : null,
    linked_artisan: row.linked_artisan?.id ? row.linked_artisan : null,
  }));
}

class PostsService {
  async list(kind: string | undefined, limit: number, offset: number, currentUserId?: string) {
    const where = kind ? eq(posts.kind, kind as any) : undefined;

    const [items, countRows] = await Promise.all([
      withJoins(db.select(baseSelection(currentUserId)))
        .where(where)
        .orderBy(desc(posts.created_at))
        .limit(limit)
        .offset(offset),
      db.select({ count: sql<number>`count(*)::int` }).from(posts).where(where),
    ]);

    return { items: normalizeLinkedRows(items), total: countRows[0]?.count ?? 0 };
  }

  async getById(id: string, currentUserId?: string) {
    const rows = await withJoins(db.select(baseSelection(currentUserId))).where(eq(posts.id, id));
    const [post] = normalizeLinkedRows(rows);
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

  async getImagesForPosts(postIds: string[]) {
    if (postIds.length === 0) return new Map<string, typeof postImages.$inferSelect[]>();

    const rows = await db
      .select()
      .from(postImages)
      .where(inArray(postImages.post_id, postIds))
      .orderBy(postImages.position);

    const map = new Map<string, typeof postImages.$inferSelect[]>();
    for (const row of rows) {
      const existing = map.get(row.post_id);
      if (existing) existing.push(row);
      else map.set(row.post_id, [row]);
    }
    return map;
  }
}

const postsService = new PostsService();
export default postsService;
