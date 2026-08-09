import { conversations, messages } from "#app/db/schema/index.js";

export type ConversationRow = typeof conversations.$inferSelect;
export type MessageInsert = typeof messages.$inferInsert;
export type MessageRow = typeof messages.$inferSelect;
