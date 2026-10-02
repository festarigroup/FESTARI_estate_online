"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { showErrorToast } from "@/components/shared/AppToast";
import { EmojiPicker } from "@/components/shared/EmojiPicker";
import { CommentLikeButton, DEFAULT_COMMENTS } from "@/components/shared/PostComments";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import type { CommentItem } from "@/types/comment";

interface DiscoverCommentPanelProps {
  reelId: string;
  onClose: () => void;
}

const IMAGE_ACCEPT = ["image/png", "image/jpeg", "image/gif", "image/webp"];

function formatClock(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  return `${minutes}:${String(totalSeconds % 60).padStart(2, "0")}`;
}

/** The reel comments panel (Figma node 791:38240 + the quick-action toolbar
 * at 791:38337) — rendered in `AppShell`'s `railAccessory` slot (see
 * discover/page.tsx), so it pops up in that same gap between the reel's
 * comment button and the story rail rather than as a centered modal.
 * Reuses `CommentItem`/`DEFAULT_COMMENTS`/`CommentLikeButton` from the main
 * feed's comments UI, and the same emoji/photo/voice-note mechanics as
 * `CommentComposer`, so attachments behave identically everywhere. */
export function DiscoverCommentPanel({ reelId, onClose }: DiscoverCommentPanelProps) {
  const [comments, setComments] = useState<CommentItem[]>(DEFAULT_COMMENTS);
  const [draft, setDraft] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
  // Marks object URLs that have been handed off to a posted comment, so the
  // cleanup effects below don't revoke one still being displayed — same
  // lifecycle as CommentComposer (see its header comment for the full
  // rationale; this mirrors it rather than redefining a looser one).
  const handedOffRef = useRef<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const imagePreview = useMemo(() => (imageFile ? URL.createObjectURL(imageFile) : undefined), [imageFile]);

  useEffect(() => {
    if (!imagePreview) return;
    return () => {
      if (!handedOffRef.current.has(imagePreview)) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  useEffect(() => {
    if (!audioUrl) return;
    return () => {
      if (!handedOffRef.current.has(audioUrl)) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const recorder = useVoiceRecorder({ onRecorded: setAudioUrl });

  const canSend = !recorder.isRecording && (draft.trim().length > 0 || !!imagePreview || !!audioUrl);

  function removeAttachment(kind: "image" | "audio") {
    if (kind === "image") setImageFile(null);
    else setAudioUrl(undefined);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!IMAGE_ACCEPT.includes(file.type)) {
      showErrorToast("Only PNG, JPEG, GIF or WEBP images are supported");
      return;
    }
    setImageFile(file);
  }

  function submit() {
    if (!canSend) return;
    const text = draft.trim();
    if (imagePreview) handedOffRef.current.add(imagePreview);
    if (audioUrl) handedOffRef.current.add(audioUrl);
    setComments((current) => [
      ...current,
      {
        id: `${reelId}-${current.length + 1}`,
        authorName: "You",
        postedAt: "Just now",
        text,
        image: imagePreview,
        audio: audioUrl,
      },
    ]);
    setDraft("");
    setImageFile(null);
    setAudioUrl(undefined);
  }

  return (
    // `h-[min(...)]` matches the reel video's own height formula exactly, and
    // `flex-col` + the card below being `flex-1 min-h-0` means the card plus
    // the quick-action pill (and the attachment preview strip inside the
    // card, when shown) always add up to that same total height — an
    // attachment never grows the panel taller than one reel, it just
    // squeezes the comment list's share of the fixed space.
    <div className="flex h-[min(716px,calc(100vh-130px))] w-[349px] flex-col items-start gap-[12px]">
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-[30px] border border-brand-900 bg-white">
        <div className="flex h-[56px] shrink-0 items-center justify-between border-b border-gray-200 px-[28px]">
          <h2 className="text-[17px] font-bold tracking-[-0.255px] text-[#181a1f]">Add comment</h2>
          <button
            type="button"
            aria-label="Close comments"
            onClick={onClose}
            className="flex items-center justify-center rounded-full p-1 hover:bg-gray-50"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 2L14 14M14 2L2 14" stroke="#94a3b7" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="no-scrollbar flex flex-1 flex-col gap-[12px] overflow-y-auto px-[28px] py-[16px]">
          {comments.map((comment) => (
            <DiscoverCommentRow key={comment.id} comment={comment} />
          ))}
        </div>

        <div className="flex shrink-0 flex-col gap-[12px] border-t border-gray-200 px-[28px] pb-[24px] pt-[17px]">
          {(imagePreview || audioUrl) && (
            <div className="flex flex-wrap items-center gap-2">
              {imagePreview && (
                <div className="relative size-14 shrink-0">
                  <Image src={imagePreview} alt="Attached photo" fill unoptimized className="rounded-xl object-cover" sizes="56px" />
                  <RemoveAttachmentButton label="Remove photo" onClick={() => removeAttachment("image")} />
                </div>
              )}
              {audioUrl && (
                <div className="relative flex min-w-0 items-center rounded-full bg-gray-100 py-1 pl-1 pr-3">
                  <audio controls src={audioUrl} className="h-8 w-[180px] max-w-full" />
                  <RemoveAttachmentButton label="Remove voice note" onClick={() => removeAttachment("audio")} />
                </div>
              )}
            </div>
          )}

          <div className="flex w-full items-center gap-[12px]">
            <span className="relative block size-6 shrink-0 overflow-hidden rounded-full bg-gray-100">
              <Image src="/images/avatar-kasapa.png" alt="" fill sizes="24px" className="object-cover" />
            </span>
            <span className="h-[18px] w-[1.5px] shrink-0 bg-brand-900" aria-hidden />
            {recorder.isRecording ? (
              <p className="flex min-w-0 flex-1 items-center gap-2 text-[13px] font-medium text-black" role="status">
                <span className="size-2 shrink-0 animate-pulse rounded-full bg-like" />
                Recording… {formatClock(recorder.seconds)}
              </p>
            ) : (
              <input
                type="text"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") submit();
                }}
                placeholder="Enter your comment"
                aria-label="Enter your comment"
                className="min-w-0 flex-1 bg-transparent text-[14px] text-night-900 placeholder:text-[#94a3b7] focus:outline-none"
              />
            )}
            <button
              type="button"
              aria-label="Send comment"
              disabled={!canSend}
              onClick={submit}
              className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-brand-900 transition-opacity disabled:opacity-40"
            >
              <span className="relative block size-4">
                <Image src="/icons/send-alt-filled.svg" alt="" fill sizes="16px" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Pill Capsule (Figma node 791:38337) — a separate
          floating control below the comment card, not nested inside its
          border, matching Figma (same emoji/photo/voice-note mechanics as
          CommentComposer). */}
      <div className="flex w-fit shrink-0 items-center gap-[16px] rounded-full border border-brand-900 bg-white px-[17px] py-[9px] shadow-sm">
        <EmojiPicker onSelect={(emoji) => setDraft((current) => current + emoji)} side="top">
          <Image src="/icons/emoji-add.svg" alt="Add emoji" width={16} height={16} />
        </EmojiPicker>
        <button
          type="button"
          aria-label="Add photo or GIF"
          onClick={() => fileInputRef.current?.click()}
          className="flex size-3.5 items-center justify-center"
        >
          <Image src="/icons/gallery-01.svg" alt="" width={14} height={14} />
        </button>
        <button
          type="button"
          aria-label={recorder.isRecording ? "Stop recording" : "Record voice note"}
          aria-pressed={recorder.isRecording}
          onClick={recorder.isRecording ? recorder.stop : recorder.start}
          className="flex size-3.5 items-center justify-center"
        >
          {recorder.isRecording ? (
            <span className="size-2.5 rounded-sm bg-like" />
          ) : (
            <Image src="/icons/mic-02.svg" alt="" width={10} height={13} />
          )}
        </button>
      </div>

      {recorder.error && (
        <p className="text-[11px] text-like" role="alert">
          {recorder.error}
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={IMAGE_ACCEPT.join(",")}
        aria-label="Attach a photo"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

function RemoveAttachmentButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-night-900 text-white"
    >
      <svg width="8" height="8" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </button>
  );
}

function DiscoverCommentRow({ comment }: { comment: CommentItem }) {
  return (
    <div className="flex w-full flex-col items-start gap-[3px]">
      <div className="flex w-full items-center gap-[6px]">
        <span className="relative block size-6 shrink-0 overflow-hidden rounded-full bg-gray-100">
          {comment.avatar ? (
            <Image src={comment.avatar} alt="" fill sizes="24px" className="object-cover" />
          ) : (
            <span className="absolute left-1/2 top-1/2 block size-4 -translate-x-1/2 -translate-y-1/2">
              <Image src="/icons/avatar-placeholder-user.svg" alt="" fill sizes="16px" />
            </span>
          )}
          <span className="absolute -bottom-0.5 -right-0.5 block size-2.5">
            <Image src="/icons/avatar-verified-badge-green.svg" alt="" fill sizes="10px" />
          </span>
        </span>
        <p className="whitespace-nowrap text-[14px] font-bold text-brand-900">{comment.authorName}</p>
        <p className="whitespace-nowrap text-[13px] text-[#9398a1]">{comment.postedAt}</p>
      </div>
      <div className="flex w-full flex-col items-start gap-1 pl-[30px]">
        {comment.text && (
          <p className="w-full whitespace-pre-line text-[13px] leading-[19.25px] text-[#42454b]">{comment.text}</p>
        )}
        {comment.image && (
          <span className="relative my-1 block h-28 w-full max-w-[180px] overflow-hidden rounded-xl bg-gray-100">
            <Image src={comment.image} alt="" fill unoptimized className="object-cover" sizes="180px" />
          </span>
        )}
        {comment.audio && <audio controls src={comment.audio} className="my-1 h-8 w-full max-w-[220px]" />}
        <div className="flex items-center gap-[15px]">
          <CommentLikeButton initialLikes={comment.likes ?? 0} />
          <button type="button" className="text-[10px] font-bold text-brand-900">
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}
