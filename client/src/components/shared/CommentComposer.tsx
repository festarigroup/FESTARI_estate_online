"use client";

import Image from "next/image";
import { useRef, useState, type ChangeEvent } from "react";
import { EmojiPicker } from "@/components/shared/EmojiPicker";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { cn } from "@/lib/utils";

export interface CommentAttachments {
  /** Object URL of an attached photo. */
  image?: string;
  /** Object URL of a recorded voice note. */
  audio?: string;
}

interface CommentComposerProps {
  draft: string;
  onDraftChange: (value: string) => void;
  onSubmit: (attachments: CommentAttachments) => void;
}

function formatClock(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  return `${minutes}:${String(totalSeconds % 60).padStart(2, "0")}`;
}

/** The "Add a comment" bar shown in the comments sheet/modal: text, emoji,
 * a photo attachment and a recorded voice note. */
export function CommentComposer({ draft, onDraftChange, onSubmit }: CommentComposerProps) {
  const [attachments, setAttachments] = useState<CommentAttachments>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const recorder = useVoiceRecorder({
    onRecorded: (audio) => setAttachments((current) => ({ ...current, audio })),
  });

  const canSend =
    !recorder.isRecording && (draft.trim().length > 0 || !!attachments.image || !!attachments.audio);

  const removeAttachment = (kind: keyof CommentAttachments) => {
    const url = attachments[kind];
    if (url) URL.revokeObjectURL(url);
    setAttachments((current) => ({ ...current, [kind]: undefined }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !file.type.startsWith("image/")) return;
    if (attachments.image) URL.revokeObjectURL(attachments.image);
    setAttachments((current) => ({ ...current, image: URL.createObjectURL(file) }));
  };

  const submit = () => {
    if (!canSend) return;
    onSubmit(attachments);
    // The submitted comment now owns these URLs, so don't revoke them.
    setAttachments({});
  };

  return (
    <div className="flex w-full flex-col gap-2 rounded-3xl bg-gray-100 p-2">
      {(attachments.image || attachments.audio) && (
        <div className="flex flex-wrap items-center gap-2 px-1 pt-1">
          {attachments.image && (
            <div className="relative size-16 shrink-0">
              <Image
                src={attachments.image}
                alt="Attached photo"
                fill
                unoptimized
                className="rounded-xl object-cover"
                sizes="64px"
              />
              <RemoveButton label="Remove photo" onClick={() => removeAttachment("image")} />
            </div>
          )}
          {attachments.audio && (
            <div className="relative flex min-w-0 items-center rounded-full bg-white py-1 pl-1 pr-3">
              <audio controls src={attachments.audio} className="h-8 w-[200px] max-w-full" />
              <RemoveButton label="Remove voice note" onClick={() => removeAttachment("audio")} />
            </div>
          )}
        </div>
      )}

      <div className="flex w-full items-center gap-3">
        <span className="relative block size-10 shrink-0">
          <Image src="/icons/avatar-andy.png" alt="" fill className="rounded-full object-cover" sizes="40px" />
          <span className="absolute -bottom-0.5 -right-0.5 block size-4">
            <Image src="/icons/avatar-verified-lg.svg" alt="" fill sizes="16px" />
          </span>
        </span>

        {recorder.isRecording ? (
          <p className="flex min-w-0 flex-1 items-center gap-2 text-[12px] font-medium text-black" role="status">
            <span className="size-2 shrink-0 animate-pulse rounded-full bg-[#ef575f]" />
            Recording… {formatClock(recorder.seconds)}
          </p>
        ) : (
          <input
            type="text"
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") submit();
            }}
            placeholder="Add a comment"
            aria-label="Add a comment"
            className="min-w-0 flex-1 bg-transparent text-[12px] font-medium text-black placeholder:text-black/35 focus:outline-none"
          />
        )}

        <button
          type="button"
          aria-label="Send comment"
          disabled={!canSend}
          onClick={submit}
          className={cn("relative block size-6 shrink-0 transition-opacity", !canSend && "opacity-40")}
        >
          <Image src="/icons/send-alt-filled.svg" alt="" fill sizes="24px" />
        </button>

        <div className="flex shrink-0 items-center gap-3 rounded-full border border-gray-200 bg-white/10 px-3 py-[9px] sm:gap-4 sm:px-[17px]">
          <EmojiPicker onSelect={(emoji) => onDraftChange(draft + emoji)} side="bottom">
            <Image src="/icons/emoji-add.svg" alt="" width={16} height={16} />
          </EmojiPicker>
          <button
            type="button"
            aria-label="Add photo"
            onClick={() => fileInputRef.current?.click()}
            className="flex size-3.5 items-center justify-center"
          >
            <Image src="/icons/gallery-01.svg" alt="" width={11} height={11} />
          </button>
          <button
            type="button"
            aria-label={recorder.isRecording ? "Stop recording" : "Record voice note"}
            aria-pressed={recorder.isRecording}
            onClick={recorder.isRecording ? recorder.stop : recorder.start}
            className="flex size-3.5 items-center justify-center"
          >
            {recorder.isRecording ? (
              <span className="size-2.5 rounded-sm bg-[#ef575f]" />
            ) : (
              <Image src="/icons/mic-02.svg" alt="" width={10} height={13} />
            )}
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {recorder.error && (
        <p className="px-2 pb-1 text-[11px] text-[#ef575f]" role="alert">
          {recorder.error}
        </p>
      )}
    </div>
  );
}

function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
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
