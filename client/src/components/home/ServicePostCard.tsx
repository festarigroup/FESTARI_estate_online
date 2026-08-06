"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { Button } from "@/components/ui/Button";
import { PostHeader } from "@/components/home/PostHeader";
import type { ServicePost } from "@/types/home";

/** "Article - Post: Service/Promotion" — lighter footer with a direct booking CTA. */
export function ServicePostCard({ post }: { post: ServicePost }) {
  function handleBookService() {
    toast.success(`Booking request sent to ${post.author.name}.`);
  }

  return (
    <article className="flex w-full shrink-0 flex-col gap-4 rounded-xl bg-white p-6 drop-shadow-[0px_4px_6px_rgba(0,31,63,0.08)]">
      <PostHeader author={post.author} />

      <div className="text-base leading-relaxed text-ink">
        {post.body.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      <div className="relative h-64 w-full overflow-hidden rounded-xl border border-border-subtle">
        <Image src={post.image.src} alt={post.image.alt} fill className="object-cover" />
      </div>

      <div className="flex w-full items-center justify-between border-t border-border-subtle pt-[17px]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => toast("Liked!")}
            className="flex items-center gap-2 text-base font-medium text-muted hover:text-ink"
          >
            <DynamicIcon name="Heart" className="size-5" />
            Like
          </button>
          <button
            onClick={() => toast(`Opening comments on ${post.author.name}'s post…`)}
            className="flex items-center gap-2 text-base font-medium text-muted hover:text-ink"
          >
            <DynamicIcon name="MessageCircle" className="size-5" />
            Comment
          </button>
        </div>
        <Button variant="navy" onClick={handleBookService} className="rounded-lg">
          Book Service
        </Button>
      </div>
    </article>
  );
}
