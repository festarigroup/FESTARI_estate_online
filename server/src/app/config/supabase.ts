import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAvatarBucket =
  process.env.SUPABASE_AVATAR_BUCKET ?? "avatars";

export const supabaseAdmin =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
        realtime: {
          transport: WebSocket as unknown as typeof globalThis.WebSocket,
        },
      })
    : null;

export function assertSupabaseConfigured() {
  if (!supabaseAdmin) {
    throw new Error("Supabase storage is not configured on the server.");
  }
}
