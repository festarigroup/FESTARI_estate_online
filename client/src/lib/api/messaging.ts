import { apiGet } from "@/lib/api/client";

export function getUnreadCount() {
  return apiGet<{ count: number }>("/messages/unread-count");
}
