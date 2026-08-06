"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { DynamicIcon, type IconName } from "@/components/ui/DynamicIcon";
import { cn } from "@/lib/cn";
import type { FeedPost } from "@/types/home";

export type AttachmentType = "photo" | "property" | "service" | "poll";

export const ATTACHMENT_TYPES: { type: AttachmentType; label: string; icon: IconName }[] = [
  { type: "photo", label: "Photo/Video", icon: "ImageIcon" },
  { type: "property", label: "Property", icon: "Building2" },
  { type: "service", label: "Service", icon: "Wrench" },
  { type: "poll", label: "Poll", icon: "BarChart3" },
];

const MAX_IMAGES = 4;
const TAG_NOTE: Record<"property" | "service", string> = {
  property: "This post will be tagged as a property listing.",
  service: "This post will be tagged as a service post.",
};

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (post: FeedPost) => void;
  /** Which attach button the composer was opened from, if any. */
  initialAttachment?: AttachmentType;
}

/** "What's on your mind" composer, expanded — text + one optional attachment
 * type. Not a Figma frame (the file only shows the collapsed bar); built to
 * give those four buttons somewhere real to go. */
export function CreatePostModal({ open, onClose, onSubmit, initialAttachment }: CreatePostModalProps) {
  const [body, setBody] = useState("");
  const [attachment, setAttachment] = useState<AttachmentType | undefined>(initialAttachment);
  const [images, setImages] = useState<string[]>([]);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function resetAndClose() {
    images.forEach((url) => URL.revokeObjectURL(url));
    setBody("");
    setAttachment(undefined);
    setImages([]);
    setPollQuestion("");
    setPollOptions(["", ""]);
    onClose();
  }

  function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, MAX_IMAGES - images.length);
    setImages((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  }

  function removeImage(url: string) {
    URL.revokeObjectURL(url);
    setImages((prev) => prev.filter((u) => u !== url));
  }

  function updatePollOption(index: number, value: string) {
    setPollOptions((prev) => prev.map((o, i) => (i === index ? value : o)));
  }

  const trimmedOptions = pollOptions.map((o) => o.trim()).filter(Boolean);
  const canSubmit =
    body.trim().length > 0 ||
    images.length > 0 ||
    (attachment === "poll" && pollQuestion.trim().length > 0 && trimmedOptions.length >= 2);

  function handleSubmit() {
    if (!canSubmit) return;
    onSubmit({
      id: `post-${Date.now()}`,
      kind: "general",
      author: { name: "Kwame", avatar: "/images/avatar-kwame-composer.png", subtitle: "Just now" },
      body: body.trim() ? body.trim().split("\n") : [],
      images: attachment === "photo" && images.length
        ? images.map((src) => ({ src, alt: "Photo attached to Kwame's post" }))
        : undefined,
      poll: attachment === "poll" && trimmedOptions.length >= 2
        ? {
            question: pollQuestion.trim(),
            options: trimmedOptions.map((text, i) => ({ id: `opt-${i}`, text, votes: 0 })),
          }
        : undefined,
      tag: attachment === "property" || attachment === "service" ? attachment : undefined,
      comments: [],
    });
    toast.success("Posted to your feed.");
    resetAndClose();
  }

  return (
    <Modal open={open} onClose={resetAndClose} title="Create post">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Avatar src="/images/avatar-kwame-composer.png" alt="Kwame" size={40} />
          <span className="font-heading text-sm text-ink">Kwame</span>
        </div>

        <textarea
          autoFocus
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What's on your mind, Kwame?"
          rows={4}
          className="w-full resize-none rounded-lg border border-border-subtle p-3 text-base text-ink placeholder:text-muted focus:outline-2 focus:outline-brand-gold"
        />

        {attachment === "photo" && (
          <div className="flex flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesSelected}
              className="hidden"
            />
            <div className="grid grid-cols-4 gap-2">
              {images.map((url) => (
                <div key={url} className="relative aspect-square overflow-hidden rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element -- local blob: preview */}
                  <img src={url} alt="" className="size-full object-cover" />
                  <button
                    onClick={() => removeImage(url)}
                    aria-label="Remove photo"
                    className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white"
                  >
                    <DynamicIcon name="X" className="size-3" />
                  </button>
                </div>
              ))}
              {images.length < MAX_IMAGES && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-muted text-muted hover:border-brand-gold hover:text-brand-gold"
                >
                  <DynamicIcon name="Plus" className="size-4" />
                  <span className="text-[10px]">Add</span>
                </button>
              )}
            </div>
          </div>
        )}

        {(attachment === "property" || attachment === "service") && (
          <p className="rounded-lg bg-surface-muted px-3 py-2 text-xs text-muted">
            {TAG_NOTE[attachment]}
          </p>
        )}

        {attachment === "poll" && (
          <div className="flex flex-col gap-2 rounded-lg border border-border-subtle p-3">
            <input
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              placeholder="Ask a question..."
              className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-2 focus:outline-brand-gold"
            />
            {pollOptions.map((option, i) => (
              <input
                key={i}
                value={option}
                onChange={(e) => updatePollOption(i, e.target.value)}
                placeholder={`Option ${i + 1}`}
                className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-2 focus:outline-brand-gold"
              />
            ))}
            {pollOptions.length < 4 && (
              <button
                onClick={() => setPollOptions((prev) => [...prev, ""])}
                className="flex items-center gap-1 self-start text-sm font-medium text-brand-navy hover:underline"
              >
                <DynamicIcon name="Plus" className="size-4" />
                Add option
              </button>
            )}
          </div>
        )}

        <div className="flex w-full flex-wrap items-center gap-6 border-t border-border-subtle pt-4">
          {ATTACHMENT_TYPES.map((item) => (
            <button
              key={item.type}
              onClick={() => setAttachment((prev) => (prev === item.type ? undefined : item.type))}
              className={cn(
                "flex items-center gap-2",
                attachment === item.type ? "text-brand-gold" : "text-brand-navy/70 hover:text-brand-navy",
              )}
            >
              <DynamicIcon name={item.icon} className="size-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button variant="navy" onClick={handleSubmit} disabled={!canSubmit} className="px-6">
            Post
          </Button>
        </div>
      </div>
    </Modal>
  );
}
