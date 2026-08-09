import {
  assertSupabaseConfigured,
  supabaseAdmin,
  supabaseMediaBucket,
} from "#app/config/supabase.js";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const ALLOWED_VIDEO_TYPES = new Set(["video/mp4", "video/quicktime", "video/webm"]);

export function getStoragePathFromPublicUrl(url?: string | null): string | null {
  if (!url || !process.env.SUPABASE_URL) return null;

  const marker = `/storage/v1/object/public/${supabaseMediaBucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;

  return decodeURIComponent(url.slice(idx + marker.length).split("?")[0] ?? "");
}

export async function uploadMedia(params: {
  pathPrefix: string;
  fileBuffer: Buffer;
  contentType: string;
  fileName: string;
  allowVideo?: boolean;
}): Promise<string> {
  assertSupabaseConfigured();

  const normalizedType = params.contentType.toLowerCase();
  const allowed = params.allowVideo
    ? ALLOWED_IMAGE_TYPES.has(normalizedType) || ALLOWED_VIDEO_TYPES.has(normalizedType)
    : ALLOWED_IMAGE_TYPES.has(normalizedType);

  if (!allowed) {
    throw new Error(
      params.allowVideo
        ? "Only JPEG, PNG, WebP images or MP4, MOV, WebM videos are allowed."
        : "Only JPEG, PNG, and WebP images are allowed.",
    );
  }

  const path = `${params.pathPrefix}/${Date.now()}-${params.fileName}`;

  const { error: uploadError } = await supabaseAdmin!.storage
    .from(supabaseMediaBucket)
    .upload(path, params.fileBuffer, {
      upsert: false,
      contentType: normalizedType,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabaseAdmin!.storage.from(supabaseMediaBucket).getPublicUrl(path);

  return data.publicUrl;
}

export async function deleteMedia(publicUrl: string) {
  const path = getStoragePathFromPublicUrl(publicUrl);
  if (!path) return;

  assertSupabaseConfigured();

  const { error } = await supabaseAdmin!.storage.from(supabaseMediaBucket).remove([path]);

  if (error && !error.message?.toLowerCase().includes("not found")) {
    throw error;
  }
}

const mediaStorageService = {
  uploadMedia,
  deleteMedia,
  getStoragePathFromPublicUrl,
};

export default mediaStorageService;
