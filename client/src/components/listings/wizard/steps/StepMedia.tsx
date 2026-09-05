import { useRef } from "react";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { Listing } from "@/types/listing";

interface StepProps {
  draft: Listing;
  onChange: (patch: Partial<Listing>) => void;
}

/** Step 8 — Media: photo/video upload with local blob previews, same
 * pattern CreatePostModal already uses for post attachments. This mock has
 * nowhere real to upload to, so files never leave the browser — the
 * preview step and PropertyDetailsView both just read these blob: URLs
 * directly, same as a freshly-composed feed post's unsent attachments do. */
export function StepMedia({ draft, onChange }: StepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const added = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: (file.type.startsWith("video/") ? "video" : "image") as "image" | "video",
    }));
    onChange({ media: [...draft.media, ...added] });
  }

  function removeMedia(url: string) {
    URL.revokeObjectURL(url);
    onChange({ media: draft.media.filter((m) => m.url !== url) });
  }

  return (
    <div className="flex flex-col gap-3">
      <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple onChange={handleFilesSelected} className="hidden" />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {draft.media.map((m) => (
          <div key={m.url} className="relative aspect-square overflow-hidden rounded-lg bg-brand-navy">
            {m.type === "video" ? (
              <video src={m.url} muted playsInline className="size-full object-cover" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- local blob: preview
              <img src={m.url} alt="" className="size-full object-cover" />
            )}
            <button
              onClick={() => removeMedia(m.url)}
              aria-label="Remove photo"
              className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white"
            >
              <DynamicIcon name="X" className="size-3" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-muted text-muted hover:border-brand-gold hover:text-brand-gold"
        >
          <DynamicIcon name="Camera" className="size-5" />
          <span className="text-xs">Add photo/video</span>
        </button>
      </div>
      <p className="text-xs text-muted">Listings with at least 3 photos get more views.</p>
    </div>
  );
}
