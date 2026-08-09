import {
  assertSupabaseConfigured,
  supabaseAdmin,
  supabaseAvatarBucket,
} from "#app/config/supabase.js";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

function getAvatarPath(userId: string) {
  return `${userId}/avatar.jpg`;
}

export function getStoragePathFromPublicUrl(url?: string | null): string | null {
  if (!url || !process.env.SUPABASE_URL) return null;

  const marker = `/storage/v1/object/public/${supabaseAvatarBucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;

  return decodeURIComponent(url.slice(idx + marker.length).split("?")[0] ?? "");
}

async function removeStorageObject(path: string) {
  assertSupabaseConfigured();

  const { error } = await supabaseAdmin!.storage
    .from(supabaseAvatarBucket)
    .remove([path]);

  if (error && !error.message?.toLowerCase().includes("not found")) {
    throw error;
  }
}

export async function uploadUserAvatar(params: {
  userId: string;
  fileBuffer: Buffer;
  contentType: string;
  previousUrl?: string | null;
}): Promise<string> {
  assertSupabaseConfigured();

  const normalizedType = params.contentType.toLowerCase();
  if (!ALLOWED_MIME_TYPES.has(normalizedType)) {
    throw new Error("Only JPEG, PNG, and WebP images are allowed.");
  }

  const path = getAvatarPath(params.userId);
  const previousPath = getStoragePathFromPublicUrl(params.previousUrl);

  if (previousPath && previousPath !== path) {
    await removeStorageObject(previousPath);
  } else if (previousPath === path) {
    await removeStorageObject(path);
  }

  const { error: uploadError } = await supabaseAdmin!.storage
    .from(supabaseAvatarBucket)
    .upload(path, params.fileBuffer, {
      upsert: true,
      contentType: normalizedType,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabaseAdmin!.storage
    .from(supabaseAvatarBucket)
    .getPublicUrl(path);

  return `${data.publicUrl}?v=${Date.now()}`;
}

export async function deleteUserAvatar(publicUrl: string) {
  const path = getStoragePathFromPublicUrl(publicUrl);
  if (!path) return;
  await removeStorageObject(path);
}

const avatarStorageService = {
  uploadUserAvatar,
  deleteUserAvatar,
  getStoragePathFromPublicUrl,
};

export default avatarStorageService;
