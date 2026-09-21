import Image from "next/image";
import { AppShell } from "@/components/shared/AppShell";
import { PostCard, type PostCardData } from "@/components/shared/PostCard";

const FEED_TABS = ["All Posts", "Following", "Nearby", "Properties", "Stay", "Professionals", "Projects"];

const COMPOSER_ACTIONS = [
  { key: "photo", label: "Photo", icon: "/icons/image-01.svg" },
  { key: "video", label: "Video", icon: "/icons/video-01.svg" },
  { key: "property", label: "Property", icon: "/icons/building-03.svg" },
  { key: "stay", label: "Stay", icon: "/icons/guest-house-sm.svg" },
  { key: "service", label: "Service", icon: "/icons/map-pin-02-sm.svg" },
  { key: "project", label: "Project", icon: "/icons/briefcase-09.svg" },
  { key: "events", label: "Events", icon: "/icons/timer-01.svg" },
  { key: "poll", label: "Poll", icon: "/icons/chart-02.svg" },
  { key: "article", label: "Article", icon: "/icons/book-bookmark-01.svg" },
];

const POSTS: PostCardData[] = [
  {
    id: "1",
    authorName: "Andy Ansong",
    authorRole: "Real Estate Consultant",
    postedAt: "27m ago",
    text: "Land prices in East Legon Hills are up nearly 12% this quarter. If you're thinking of buying in the next 6 months, now's worth a serious look.",
    image: "/icons/post-image-sample.jpg",
    likes: 42,
    comments: 42,
    avatar: "/icons/avatar-andy.png",
  },
  {
    id: "2",
    authorName: "Jane Doe",
    authorRole: "Sales Agent",
    postedAt: "1h ago",
    text: "Just closed on a beautiful 3-bedroom apartment in Cantonments. Grateful for another happy client!",
    likes: 28,
    comments: 12,
    avatar: "/icons/avatar-sample.jpg",
  },
  {
    id: "3",
    authorName: "John Doe",
    authorRole: "Property Manager",
    postedAt: "3h ago",
    text: "Reminder: our open house for the Airport Residential listing runs this Saturday from 10am to 2pm. Come through!",
    image: "/icons/post-image-sample.jpg",
    likes: 15,
    comments: 6,
    avatar: "/icons/avatar-sample.jpg",
  },
];

const PEOPLE_YOU_MAY_KNOW = [
  { name: "Andy Ansong", role: "Real Estate Consultant", avatar: "/icons/avatar-andy.png" },
  { name: "Edwin Adu", role: "Sales Agent", avatar: "/icons/avatar-sample.jpg" },
  { name: "Carlos Ramirez", role: "Software Engineer", avatar: "/icons/avatar-sample.jpg" },
];

export default function HomeFeedPage() {
  return (
    <AppShell activeKey="feed" rightRail={<RightRail />}>
      <div className="mx-auto flex w-[802px] max-w-full flex-col gap-4">
        <ComposerCard />
        <FeedTabs />
        {POSTS.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </AppShell>
  );
}

function ComposerCard() {
  return (
    <div className="flex w-full flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex w-full items-center justify-center gap-2.5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#eef2ff] text-sm font-extrabold text-[#4f46e5]">
          SL
        </span>
        <div className="flex w-full items-center justify-between rounded-3xl bg-gray-100 p-2">
          <p className="text-xs font-medium text-black/35">What&apos;s on your mind?</p>
          <button type="button" aria-label="Post" className="relative block size-6 shrink-0">
            <Image src="/icons/send-alt-filled.svg" alt="" fill sizes="24px" />
          </button>
        </div>
      </div>

      <div className="h-px w-full bg-gray-200" />

      <div className="flex w-full flex-wrap items-center gap-[18px]">
        {COMPOSER_ACTIONS.map((action) => (
          <button
            key={action.key}
            type="button"
            className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-brand-900"
          >
            <span className="relative block size-3.5 shrink-0">
              <Image src={action.icon} alt="" fill sizes="14px" />
            </span>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function FeedTabs() {
  return (
    <div className="flex h-11 w-full items-center rounded-2xl border border-[#e6e7ec] bg-white pl-4 pr-2.5">
      {FEED_TABS.map((tab, index) => (
        <button
          key={tab}
          type="button"
          className={
            index === 0
              ? "flex h-full items-center justify-center border-b-2 border-brand-600 p-4 text-[13px] font-medium text-brand-600"
              : "flex h-full items-center justify-center border-b border-[#e6e7ec] p-4 text-[13px] text-[#111826]"
          }
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function RightRail() {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4">
        <div>
          <p className="text-lg font-bold text-night-900">List Your Property</p>
          <p className="text-sm text-gray-500">Grow your visibility and connect with serious buyers.</p>
        </div>
        <div className="relative h-[120px] w-full overflow-hidden rounded-xl">
          <Image src="/icons/post-image-sample.jpg" alt="" fill className="object-cover" sizes="318px" />
        </div>
        <button
          type="button"
          className="h-10 w-full rounded-lg bg-brand-900 text-sm font-medium text-white hover:bg-brand-900/90"
        >
          Get Started
        </button>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-3">
        <div className="flex items-center justify-between px-0 py-1">
          <p className="text-base font-semibold text-night-900">People you may know</p>
        </div>
        <ul className="flex flex-col gap-4">
          {PEOPLE_YOU_MAY_KNOW.map((person) => (
            <li key={person.name} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="relative block size-11 shrink-0 overflow-hidden rounded-full">
                  <Image src={person.avatar} alt={person.name} fill className="object-cover" sizes="44px" />
                </span>
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-night-900">{person.name}</p>
                  <p className="text-xs text-gray-500">{person.role}</p>
                </div>
              </div>
              <button
                type="button"
                className="h-6 shrink-0 rounded-full border border-brand-900 px-3 text-xs font-medium text-brand-900"
              >
                Connect
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
