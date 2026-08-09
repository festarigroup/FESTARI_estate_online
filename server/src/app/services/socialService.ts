import { db } from "#app/db/db.js";
import { follows, users } from "#app/db/schema/index.js";
import { and, desc, eq, getTableColumns, inArray, not, notInArray, sql } from "drizzle-orm";

class SocialService {
  async follow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new Error("You cannot follow yourself");
    }
    await db.insert(follows).values({ follower_id: followerId, following_id: followingId }).onConflictDoNothing();
  }

  async unfollow(followerId: string, followingId: string) {
    await db
      .delete(follows)
      .where(and(eq(follows.follower_id, followerId), eq(follows.following_id, followingId)));
  }

  async isFollowing(followerId: string, followingId: string) {
    const [row] = await db
      .select()
      .from(follows)
      .where(and(eq(follows.follower_id, followerId), eq(follows.following_id, followingId)));
    return Boolean(row);
  }

  async listFollowing(userId: string) {
    return db
      .select({
        id: users.id,
        firstname: users.firstname,
        lastname: users.lastname,
        profile_picture: users.profile_picture,
        followed_at: follows.created_at,
      })
      .from(follows)
      .innerJoin(users, eq(users.id, follows.following_id))
      .where(eq(follows.follower_id, userId))
      .orderBy(desc(follows.created_at));
  }

  async listFollowers(userId: string) {
    return db
      .select({
        id: users.id,
        firstname: users.firstname,
        lastname: users.lastname,
        profile_picture: users.profile_picture,
        followed_at: follows.created_at,
      })
      .from(follows)
      .innerJoin(users, eq(users.id, follows.follower_id))
      .where(eq(follows.following_id, userId))
      .orderBy(desc(follows.created_at));
  }

  async suggestions(userId: string, limit: number) {
    const alreadyFollowing = db.select({ id: follows.following_id }).from(follows).where(eq(follows.follower_id, userId));

    return db
      .select({
        id: users.id,
        firstname: users.firstname,
        lastname: users.lastname,
        profile_picture: users.profile_picture,
      })
      .from(users)
      .where(and(not(eq(users.id, userId)), notInArray(users.id, alreadyFollowing)))
      .orderBy(desc(users.created_at))
      .limit(limit);
  }
}

const socialService = new SocialService();
export default socialService;
