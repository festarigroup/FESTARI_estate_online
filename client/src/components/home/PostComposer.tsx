"use client";

import toast from "react-hot-toast";
import { Avatar } from "@/components/ui/Avatar";
import { DynamicIcon, type IconName } from "@/components/ui/DynamicIcon";

const COMPOSER_ACTIONS: { label: string; icon: IconName }[] = [
  { label: "Photo/Video", icon: "ImageIcon" },
  { label: "Property", icon: "Building2" },
  { label: "Service", icon: "Wrench" },
  { label: "Poll", icon: "BarChart3" },
];

/** "Post Composer" card: avatar + prompt input, plus quick-attach actions. */
export function PostComposer() {
  return (
    <div className="flex w-full shrink-0 flex-col gap-6 rounded-xl bg-white p-6 drop-shadow-[0px_4px_6px_rgba(0,31,63,0.08)]">
      <div className="flex w-full items-center gap-4">
        <Avatar src="/images/avatar-kwame-composer.png" alt="Kwame" size={48} />
        <button
          onClick={() => toast("Post composer is coming soon.")}
          className="flex-1 rounded-full bg-surface-muted px-6 py-3 text-left text-base text-muted hover:bg-border-subtle"
        >
          What&apos;s on your mind, Kwame?
        </button>
      </div>

      <div className="flex w-full flex-wrap items-center gap-8 border-t border-border-subtle pt-4">
        {COMPOSER_ACTIONS.map((action) => (
          <button
            key={action.label}
            onClick={() => toast(`${action.label} attachments are coming soon.`)}
            className="flex items-center gap-2 text-brand-navy/70 hover:text-brand-navy"
          >
            <DynamicIcon name={action.icon} className="size-5" />
            <span className="text-sm font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
