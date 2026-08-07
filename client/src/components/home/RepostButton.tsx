"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { QuoteRepostModal } from "@/components/home/QuoteRepostModal";
import { useReposts } from "@/hooks/useReposts";
import { cn } from "@/lib/cn";

/** The Repost control shared by PostEngagementBar and ServiceActionsBar —
 * pulled out once both needed the exact same button/state/toast, and again
 * now that it needs more than a single click can express. Not reposted
 * yet: clicking opens a small menu — plain Repost, or Repost with thoughts
 * (a quote repost, via QuoteRepostModal). Already reposted: clicking
 * undoes it directly, no menu, since there's nothing to choose between for
 * removal — same one-click convention Save/Follow already use. */
export function RepostButton({ postId }: { postId: string }) {
  const { isReposted, repost, toggleRepost } = useReposts();
  const [quoteOpen, setQuoteOpen] = useState(false);
  const reposted = isReposted(postId);

  function handlePlainRepost() {
    repost(postId);
    toast.success("Reposted to the top of your feed.");
  }

  function handleUndo() {
    toggleRepost(postId);
    toast.success("Repost removed.");
  }

  if (reposted) {
    return (
      <button
        onClick={handleUndo}
        className="flex items-center gap-2 text-base font-medium text-brand-blue"
      >
        <DynamicIcon name="Repeat2" className="size-5" />
        Reposted
      </button>
    );
  }

  return (
    <>
      <Dropdown
        align="left"
        trigger={(bind) => (
          <button
            {...bind}
            className={cn("flex items-center gap-2 text-base font-medium", "text-muted hover:text-ink")}
          >
            <DynamicIcon name="Repeat2" className="size-5" />
            Repost
          </button>
        )}
      >
        <DropdownItem icon="Repeat2" label="Repost" onClick={handlePlainRepost} />
        <DropdownItem icon="Quote" label="Repost with thoughts" onClick={() => setQuoteOpen(true)} />
      </Dropdown>
      <QuoteRepostModal open={quoteOpen} onClose={() => setQuoteOpen(false)} postId={postId} />
    </>
  );
}
