import { db } from "#app/db/db.js";
import { stories, storyViews, users } from "#app/db/schema/index.js";
import { StoryInsert } from "#app/types/FeedTypes.js";
import { and, desc, eq, getTableColumns, gt } from "drizzle-orm";

class StoriesService {
  async create(row: Omit<StoryInsert, "expires_at">) {
    const [created] = await db
      .insert(stories)
      .values({ ...row, expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) })
      .returning();
    return created;
  }

  async listActive() {
    return db
      .select({ ...getTableColumns(stories), author: { id: users.id, firstname: users.firstname, lastname: users.lastname, profile_picture: users.profile_picture } })
      .from(stories)
      .innerJoin(users, eq(users.id, stories.author_id))
      .where(gt(stories.expires_at, new Date()))
      .orderBy(desc(stories.created_at));
  }

  async getById(id: string) {
    const [story] = await db.select().from(stories).where(eq(stories.id, id));
    return story ?? null;
  }

  async delete(id: string) {
    await db.delete(stories).where(eq(stories.id, id));
  }

  async recordView(storyId: string, viewerId: string) {
    await db
      .insert(storyViews)
      .values({ story_id: storyId, viewer_id: viewerId })
      .onConflictDoNothing();
  }
}

const storiesService = new StoriesService();
export default storiesService;
