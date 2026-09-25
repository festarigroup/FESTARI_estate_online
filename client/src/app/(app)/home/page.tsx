"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/shared/AppShell";
import { showSuccessToast } from "@/components/shared/AppToast";
import { MobileQuickPostModal, type QuickComposerMode } from "@/components/shared/MobileQuickPostModal";
import { PostCard, type PostCardData } from "@/components/shared/PostCard";
import { WhoToFollowCard } from "@/components/shared/WhoToFollowCard";
import { TrendingPropertiesCard } from "@/components/shared/TrendingPropertiesCard";
import { UpcomingOpenHousesCard } from "@/components/shared/UpcomingOpenHousesCard";
import { TrendingHashtagsCard } from "@/components/shared/TrendingHashtagsCard";
import { usePostsFeed } from "@/context/PostsContext";
import { usePostModals, type PostModalType } from "@/hooks/usePostModals";
import { comingSoonHref } from "@/lib/coming-soon";

interface FeedTab {
  label: string;
  variant?: PostCardData["variant"];
}

const FEED_TABS: FeedTab[] = [
  { label: "All Posts" },
  { label: "Following" },
  { label: "Nearby" },
  { label: "Properties", variant: "property" },
  { label: "Stay", variant: "stay" },
  { label: "Professionals", variant: "professional" },
  { label: "Projects", variant: "project" },
];

const COMPOSER_ACTIONS = [
  { key: "media", label: "Media", icon: "/icons/media-gallery.svg" },
  { key: "property", label: "Property", icon: "/icons/building-03.svg" },
  { key: "stay", label: "Stay", icon: "/icons/guest-house-sm.svg" },
  { key: "service", label: "Service", icon: "/icons/map-pin-02-sm.svg" },
  { key: "project", label: "Project", icon: "/icons/briefcase-09.svg" },
  { key: "events", label: "Events", icon: "/icons/event-calendar-01.svg" },
  { key: "poll", label: "Poll", icon: "/icons/poll-bar-chart.svg" },
  { key: "article", label: "Article", icon: "/icons/article-document.svg" },
];

/** The desktop composer's icons the mobile card doesn't show up front; the "more" toggle reveals these. */
const MORE_COMPOSER_ACTIONS = COMPOSER_ACTIONS.filter((action) =>
  ["property", "stay", "service", "project", "events"].includes(action.key),
);

const POST_TEXT =
  "Land prices in East Legon Hills are up nearly 12% this quarter. If you're thinking of buying in the next 6 months, now's worth a serious look.";

const CONSULT_TEXT =
  "New build wrapped this week — a 3-unit courtyard house in Trasacco. Full portfolio on my profile.";

const POSTS: PostCardData[] = [
  {
    id: "1",
    variant: "text",
    authorName: "Andy Ansong",
    roleLine: "Real Estate Consultant |",
    postedAt: "27m ago",
    avatar: "/icons/avatar-andy.png",
    verified: "individual",
    text: POST_TEXT,
    image: "/images/post-building-01.jpg",
    likes: 42,
    comments: 42,
    showComposer: true,
  },
  {
    id: "2",
    variant: "poll",
    authorName: "Edwin adu Boateng",
    roleLine: "Sales Agent |",
    postedAt: "2hrs ago",
    avatar: "",
    avatarPlaceholder: true,
    participantAvatars: ["/images/poll-avatar-1.png", "/images/poll-avatar-2.png", "/images/poll-avatar-3.png"],
    question: "What matters most when choosing a stay?",
    hashtags: "#quickquestion #plsanswer",
    pollOptions: [
      { label: "Amenities", percent: 55, votes: "1,418", leading: true },
      { label: "Price", percent: 25, votes: "4,587" },
      { label: "Location", percent: 12, votes: "1,418" },
      { label: "Reviews", percent: 8, votes: "487" },
    ],
    pollFooter: "Jun 25, 2026 — 12,157 votes total",
    likes: 12,
    comments: 25,
    shareLabel: "187 Share",
    showComposer: true,
  },
  {
    id: "3",
    variant: "property",
    authorName: "Kasapa Properties Ltd",
    roleLine: "Sponsored by agent |",
    postedAt: "40m ago",
    avatar: "/images/avatar-kasapa.png",
    verified: "organization",
    text: POST_TEXT,
    images: [
      "/images/post-building-01.jpg",
      "/images/post-property-exterior.jpg",
      "/images/post-property-living-room.jpg",
      "/images/post-property-kitchen.jpg",
      "/images/post-property-bedroom.jpg",
    ],
    priceLine: "GHS 1,850.00",
    subLine: "4 bedroom Detached House",
    beds: 4,
    baths: 2,
    actions: [
      { label: "Request viewing", variant: "primary" },
      { label: "View Property", variant: "outline" },
    ],
    messageHostLabel: "Message Host",
    likes: 42,
    comments: 42,
  },
  {
    id: "4",
    variant: "stay",
    authorName: "Golden Palm Hotel",
    roleLine: "Labadi |",
    postedAt: "1d",
    avatar: "/images/avatar-golden-palm.png",
    verified: "organization",
    image: "/images/post-hotel-pool.jpg",
    priceLine: "GHS 550.00",
    priceSuffix: "/night",
    subLine: "Deluxe room",
    rating: "4.7 ratings (312)",
    actions: [
      { label: "Book Now", variant: "primary" },
      { label: "Check Availability", variant: "outline" },
    ],
    likes: 42,
    comments: 42,
  },
  {
    id: "5",
    variant: "professional",
    authorName: "Ama Boatengmaa",
    roleLine: "Architect - Studio Meridian |",
    postedAt: "27m ago",
    avatar: "/images/avatar-generic.png",
    verified: "individual",
    text: CONSULT_TEXT,
    image: "/images/post-building-01.jpg",
    actions: [
      { label: "Request Consultation", variant: "primary" },
      { label: "Message", variant: "outline" },
    ],
    messageHostLabel: "Message Host",
    likes: 42,
    comments: 42,
    showComposer: true,
  },
  {
    id: "6",
    variant: "artisan",
    authorName: "Yaw Osei",
    roleLine: "Electrician - Serves Accra |",
    postedAt: "27m ago",
    avatar: "/images/avatar-generic.png",
    verified: "individual",
    text: CONSULT_TEXT,
    image: "/images/post-building-01.jpg",
    actions: [
      { label: "Book Artisan", variant: "primary" },
      { label: "Bookmark Artisan", variant: "outline" },
    ],
    messageHostLabel: "Message Host",
    likes: 42,
    comments: 42,
    showComposer: true,
  },
  {
    id: "7",
    variant: "project",
    authorName: "Golden Ridge Developers",
    roleLine: "New Development |",
    postedAt: "3hrs ago",
    avatar: "/images/avatar-kasapa.png",
    verified: "organization",
    text: "Breaking ground on Golden Ridge Estates — 40 serviced plots with road network and utilities already in. Reserve a plot before the next price review.",
    image: "/images/post-building-01.jpg",
    actions: [
      { label: "Make Enquiry", variant: "primary" },
      { label: "View Project", variant: "outline" },
    ],
    messageHostLabel: "Message Host",
    likes: 42,
    comments: 42,
    showComposer: true,
  },
];

export default function HomeFeedPage() {
  const [activeTab, setActiveTab] = useState(FEED_TABS[0].label);
  const { posts: userPosts } = usePostsFeed();

  const allPosts = useMemo(() => [...userPosts, ...POSTS], [userPosts]);
  const activeVariant = FEED_TABS.find((tab) => tab.label === activeTab)?.variant;
  const filteredPosts = useMemo(
    () => (activeTab === "All Posts" ? allPosts : allPosts.filter((post) => post.variant === activeVariant)),
    [activeTab, activeVariant, allPosts],
  );

  return (
    <AppShell
      activeKey="feed"
      rightRail={<RightRail />}
      header={
        <div className="pb-[15px]">
          <FeedTabs activeTab={activeTab} onSelect={setActiveTab} />
        </div>
      }
    >
      <div className="flex w-full flex-col gap-[15px]">
        <ComposerCard />
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="flex w-full flex-col items-center gap-[15px] rounded-[15px] border border-gray-200 bg-white p-[15px] py-9 text-center">
            <p className="text-[13px] text-gray-500">No posts here yet — check back soon.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}

const LINKED_COMPOSER_KEYS = ["media", "poll", "article"] as const;

function ComposerCard() {
  const { openPostModal, modals } = usePostModals();

  return (
    <>
      <div className="hidden w-full flex-col gap-[15px] rounded-[15px] border border-gray-200 bg-white p-[15px] sm:flex">
        <div className="flex w-full items-center justify-center gap-2.5">
          <span className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-[#eef2ff] text-[13px] font-extrabold text-[#4f46e5]">
            SL
          </span>
          <button
            type="button"
            onClick={() => openPostModal("media")}
            className="flex w-full items-center justify-between rounded-3xl bg-gray-100 p-2"
          >
            <p className="text-[11px] font-medium text-black/35">Add your comment</p>
            <span className="relative block size-[23px] shrink-0">
              <Image src="/icons/send-alt-filled.svg" alt="" fill sizes="23px" />
            </span>
          </button>
        </div>

        <div className="h-px w-full bg-gray-200" />

        <div className="flex w-full flex-wrap items-center justify-between gap-3 sm:gap-[17px]">
          {COMPOSER_ACTIONS.map((action) =>
            (LINKED_COMPOSER_KEYS as readonly string[]).includes(action.key) ? (
              <button
                key={action.key}
                type="button"
                aria-label={action.label}
                onClick={() => openPostModal(action.key as PostModalType)}
                className="flex items-center gap-2 text-[11px] font-bold text-gray-500 hover:text-brand-900"
              >
                <span className="relative block size-4 shrink-0 sm:size-[13px]">
                  <Image src={action.icon} alt="" fill sizes="16px" />
                </span>
                <span className="hidden sm:inline">{action.label}</span>
              </button>
            ) : (
              <Link
                key={action.key}
                href={comingSoonHref(action.label)}
                aria-label={action.label}
                className="flex items-center gap-2 text-[11px] font-bold text-gray-500 hover:text-brand-900"
              >
                <span className="relative block size-4 shrink-0 sm:size-[13px]">
                  <Image src={action.icon} alt="" fill sizes="16px" />
                </span>
                <span className="hidden sm:inline">{action.label}</span>
              </Link>
            ),
          )}
        </div>
      </div>

      {modals}
      <MobileComposerCard />
    </>
  );
}

function MobileComposerCard() {
  const { modals } = usePostModals();
  const { addPost } = usePostsFeed();
  const [commentDraft, setCommentDraft] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);
  const [quickPostOpen, setQuickPostOpen] = useState(false);
  const [quickPostMode, setQuickPostMode] = useState<QuickComposerMode>("post");

  function submitComment() {
    const text = commentDraft.trim();
    if (!text) return;
    addPost({ kind: "media", text, files: [] });
    showSuccessToast("Your post has been shared");
    setCommentDraft("");
  }

  return (
    <div className="flex w-full flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:hidden">
      <div className="flex w-full items-center gap-2.5">
        <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-[#eef2ff] text-base font-extrabold text-[#4f46e5]">
          SL
          <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-[1.5px] border-white bg-[#22c55e]" />
        </span>
        <div className="flex w-full items-center justify-between gap-2 rounded-3xl border border-transparent bg-gray-100 p-2 focus-within:border-brand-900 focus-within:bg-white">
          <input
            type="text"
            value={commentDraft}
            onChange={(event) => setCommentDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") submitComment();
            }}
            placeholder="Add a comment"
            className="min-w-0 flex-1 bg-transparent text-xs text-night-900 placeholder:text-black/35 focus:outline-none"
          />
          <button
            type="button"
            aria-label="Send"
            onClick={submitComment}
            disabled={!commentDraft.trim()}
            className="relative block size-6 shrink-0 disabled:opacity-30"
          >
            <Image src="/icons/send-alt-filled.svg" alt="" fill sizes="24px" />
          </button>
        </div>
      </div>

      <div className="h-px w-full bg-gray-200" />

      <div className="flex w-full flex-wrap items-center gap-[18px]">
        <button
          type="button"
          aria-label="Media"
          onClick={() => {
            setQuickPostMode("post");
            setQuickPostOpen(true);
          }}
        >
          <span className="relative block size-3.5">
            <Image src="/icons/media-gallery.svg" alt="" fill sizes="14px" />
          </span>
        </button>
        <button
          type="button"
          aria-label="Poll"
          onClick={() => {
            setQuickPostMode("poll");
            setQuickPostOpen(true);
          }}
        >
          <span className="relative block size-3.5">
            <Image src="/icons/poll-bar-chart.svg" alt="" fill sizes="14px" />
          </span>
        </button>
        <button
          type="button"
          aria-label="Article"
          onClick={() => {
            setQuickPostMode("article");
            setQuickPostOpen(true);
          }}
        >
          <span className="relative block size-3.5">
            <Image src="/icons/article-document.svg" alt="" fill sizes="14px" />
          </span>
        </button>

        {moreOpen &&
          MORE_COMPOSER_ACTIONS.map((action) => (
            <Link key={action.key} href={comingSoonHref(action.label)} aria-label={action.label}>
              <span className="relative block size-3.5">
                <Image src={action.icon} alt="" fill sizes="14px" />
              </span>
            </Link>
          ))}

        <button type="button" aria-label="More options" aria-expanded={moreOpen} onClick={() => setMoreOpen((v) => !v)}>
          <span className="relative block size-4">
            <Image src="/icons/more-horizontal.svg" alt="" fill sizes="16px" />
          </span>
        </button>
      </div>

      {modals}
      <MobileQuickPostModal open={quickPostOpen} onClose={() => setQuickPostOpen(false)} initialMode={quickPostMode} />
    </div>
  );
}

function FeedTabs({ activeTab, onSelect }: { activeTab: string; onSelect: (label: string) => void }) {
  return (
    <div className="no-scrollbar flex h-[42px] w-full items-center overflow-x-auto rounded-[15px] border border-[#e6e7ec] bg-white pl-[15px] pr-2.5">
      {FEED_TABS.map((tab) => (
        <button
          key={tab.label}
          type="button"
          onClick={() => onSelect(tab.label)}
          className={
            tab.label === activeTab
              ? "flex h-full shrink-0 items-center justify-center whitespace-nowrap border-b-2 border-brand-600 p-[15px] text-[12px] font-medium text-brand-600"
              : "flex h-full shrink-0 items-center justify-center whitespace-nowrap border-b border-[#e6e7ec] p-[15px] text-[12px] text-[#111826]"
          }
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function RightRail() {
  return (
    <div className="flex w-full flex-col gap-[15px]">
      <div className="flex flex-col gap-[15px] rounded-[15px] border border-gray-200 bg-white p-[15px]">
        <div>
          <p className="text-[17px] font-bold text-night-900">List Your Property</p>
          <p className="text-[13px] text-gray-500">Grow your visibility and connect with serious buyers.</p>
        </div>
        <div className="relative h-[114px] w-full overflow-hidden rounded-xl">
          <Image src="/images/post-building-01.jpg" alt="" fill className="object-cover" sizes="318px" />
        </div>
        <Link
          href={comingSoonHref("List Property")}
          className="flex h-[38px] w-full items-center justify-center rounded-lg bg-brand-900 text-[13px] font-medium text-white hover:bg-brand-900/90"
        >
          List Property
        </Link>
      </div>

      <WhoToFollowCard />
      <TrendingPropertiesCard />
      <UpcomingOpenHousesCard />
      <TrendingHashtagsCard />
    </div>
  );
}
