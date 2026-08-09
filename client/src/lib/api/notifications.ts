import { apiGet } from "@/lib/api/client";

export function getUnreadCount() {
  return apiGet<{ count: number }>("/notifications/unread-count");
}
