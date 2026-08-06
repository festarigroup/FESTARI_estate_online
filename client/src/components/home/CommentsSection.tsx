"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { Comment } from "@/types/home";

interface CommentsSectionProps {
  comments: Comment[];
  onAddComment: (body: string) => void;
}

/** Comment list + reply box, toggled open by every post variant's Comment button. */
export function CommentsSection({ comments, onAddComment }: CommentsSectionProps) {
  const [draft, setDraft] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (!body) return;
    onAddComment(body);
    setDraft("");
  }

  return (
    <div className="flex w-full flex-col gap-4 border-t border-border-subtle pt-4">
      {comments.length > 0 && (
        <ul className="flex flex-col gap-3">
          {comments.map((comment) => (
            <li key={comment.id} className="flex items-start gap-2">
              <Avatar
                src={comment.author.avatar}
                icon={comment.author.avatarIcon}
                alt={comment.author.name}
                size={32}
              />
              <div className="flex flex-col gap-0.5">
                <div className="rounded-2xl bg-surface-muted px-3 py-2">
                  <p className="text-xs font-semibold text-ink">{comment.author.name}</p>
                  <p className="text-sm text-ink">{comment.body}</p>
                </div>
                <span className="pl-3 text-[11px] text-muted">{comment.createdAt}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Avatar src="/images/avatar-kwame-composer.png" alt="Kwame" size={32} />
        <div className="relative flex-1">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write a comment..."
            className="w-full rounded-full bg-surface-muted px-4 py-2 pr-10 text-sm text-ink placeholder:text-muted focus:outline-2 focus:outline-brand-gold"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            aria-label="Send comment"
            className="absolute top-1/2 right-3 -translate-y-1/2 text-brand-navy disabled:text-muted"
          >
            <DynamicIcon name="Send" className="size-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
