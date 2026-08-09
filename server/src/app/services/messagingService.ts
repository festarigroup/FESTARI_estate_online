import { db } from "#app/db/db.js";
import { conversationParticipants, conversations, messages, users } from "#app/db/schema/index.js";
import { MessageInsert } from "#app/types/MessagingTypes.js";
import { and, desc, eq, inArray, ne, sql } from "drizzle-orm";

class MessagingService {
  async findOneToOne(userId: string, otherUserId: string) {
    const shared = await db
      .select({ conversation_id: conversationParticipants.conversation_id })
      .from(conversationParticipants)
      .where(inArray(conversationParticipants.user_id, [userId, otherUserId]))
      .groupBy(conversationParticipants.conversation_id)
      .having(sql`count(distinct ${conversationParticipants.user_id}) = 2 and count(*) = 2`);

    if (!shared[0]) return null;
    return this.getById(shared[0].conversation_id);
  }

  async createOneToOne(userId: string, otherUserId: string) {
    const [conversation] = await db.insert(conversations).values({}).returning();
    if (!conversation) throw new Error("Failed to create conversation");

    await db.insert(conversationParticipants).values([
      { conversation_id: conversation.id, user_id: userId },
      { conversation_id: conversation.id, user_id: otherUserId },
    ]);

    return conversation;
  }

  async findOrCreateOneToOne(userId: string, otherUserId: string) {
    const existing = await this.findOneToOne(userId, otherUserId);
    if (existing) return existing;
    return this.createOneToOne(userId, otherUserId);
  }

  async getById(id: string) {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation ?? null;
  }

  async isParticipant(conversationId: string, userId: string) {
    const [row] = await db
      .select()
      .from(conversationParticipants)
      .where(
        and(
          eq(conversationParticipants.conversation_id, conversationId),
          eq(conversationParticipants.user_id, userId),
        ),
      );
    return Boolean(row);
  }

  async listForUser(userId: string) {
    const conversationIds = db
      .select({ id: conversationParticipants.conversation_id })
      .from(conversationParticipants)
      .where(eq(conversationParticipants.user_id, userId));

    return db
      .select()
      .from(conversations)
      .where(inArray(conversations.id, conversationIds))
      .orderBy(desc(conversations.updated_at));
  }

  async getParticipants(conversationId: string) {
    return db
      .select({
        id: users.id,
        firstname: users.firstname,
        lastname: users.lastname,
        profile_picture: users.profile_picture,
      })
      .from(conversationParticipants)
      .innerJoin(users, eq(users.id, conversationParticipants.user_id))
      .where(eq(conversationParticipants.conversation_id, conversationId));
  }

  async getMessages(conversationId: string, limit: number, offset: number) {
    return db
      .select()
      .from(messages)
      .where(eq(messages.conversation_id, conversationId))
      .orderBy(desc(messages.created_at))
      .limit(limit)
      .offset(offset);
  }

  async sendMessage(row: MessageInsert) {
    const [message] = await db.insert(messages).values(row).returning();
    if (!message) throw new Error("Failed to send message");

    await db
      .update(conversations)
      .set({ updated_at: new Date() })
      .where(eq(conversations.id, row.conversation_id as string));

    return message;
  }

  async getUnreadCount(userId: string) {
    const conversationIds = db
      .select({ id: conversationParticipants.conversation_id })
      .from(conversationParticipants)
      .where(eq(conversationParticipants.user_id, userId));

    const [result] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(messages)
      .where(
        and(
          inArray(messages.conversation_id, conversationIds),
          ne(messages.sender_id, userId),
          eq(messages.is_read, false),
        ),
      );

    return result?.count ?? 0;
  }
}

const messagingService = new MessagingService();
export default messagingService;
