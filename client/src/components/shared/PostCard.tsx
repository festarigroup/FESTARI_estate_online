"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { EmojiPicker } from "@/components/shared/EmojiPicker";
import { FollowButton } from "@/components/shared/FollowButton";
import { LikesBottomSheet } from "@/components/shared/LikesBottomSheet";
import { NavIcon } from "@/components/shared/NavIcon";
import { Tooltip } from "@/components/shared/Tooltip";
import { comingSoonHref } from "@/lib/coming-soon";
import { renderWithHashtags } from "@/lib/hashtags";
import { cn } from "@/lib/utils";

export type PostActionVariant = "primary" | "outline" | "outline-brand";

export interface PostAction {
  label: string;
  variant: PostActionVariant;
}

export interface PollOption {
  label: string;
  percent: number;
  votes: string;
  leading?: boolean;
}

export interface CommentItem {
  id: string;
  authorName: string;
  avatar?: string;
  postedAt: string;
  text: string;
  likes?: number;
}

function getMediaItems(post: PostCardData): MediaItem[] {
  if (post.media) return post.media;
  if (post.video) return [{ url: post.video, isVideo: true }];
  if (post.images) return post.images.map((url) => ({ url }));
  if (post.image) return [{ url: post.image }];
  return [];
}

const DEFAULT_COMMENTS: CommentItem[] = [
  {
    id: "c1",
    authorName: "Jane Doe",
    postedAt: "17s ago",
    text: "We are very good. Your story is very inspiring!\nDon't stop keep going.",
    likes: 20,
  },
  { id: "c2", authorName: "John Doe", postedAt: "1m ago", text: "Cool Champ.", likes: 20 },
  { id: "c3", authorName: "Jane Doe", postedAt: "20m ago", text: "Cool Champ." },
];

export interface MediaItem {
  url: string;
  isVideo?: boolean;
}

export interface PostCardData {
  id: string;
  variant?: "text" | "poll" | "property" | "stay" | "project" | "professional" | "artisan";
  authorName: string;
  roleLine: string;
  postedAt: string;
  avatar: string;
  avatarPlaceholder?: boolean;
  verified?: "individual" | "organization";
  text?: string;
  truncated?: boolean;
  image?: string;
  images?: string[];
  video?: string;
  media?: MediaItem[];
  likes: number;
  comments: number;
  shares?: number;
  shareLabel?: string;
  showComposer?: boolean;
  // poll
  participantAvatars?: string[];
  question?: string;
  hashtags?: string;
  pollOptions?: PollOption[];
  pollFooter?: string;
  // property / stay
  priceLine?: string;
  priceSuffix?: string;
  subLine?: string;
  beds?: number;
  baths?: number;
  rating?: string;
  actions?: PostAction[];
  messageHostLabel?: string;
  commentsList?: CommentItem[];
}

interface PostCardProps {
  post: PostCardData;
  currentUserAvatarInitials?: string;
}

export function PostCard({ post, currentUserAvatarInitials = "SL" }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>(post.commentsList ?? DEFAULT_COMMENTS);
  const [commentDraft, setCommentDraft] = useState("");
  const [textExpanded, setTextExpanded] = useState(false);
  const mediaItems = getMediaItems(post);

  const submitComment = () => {
    const text = commentDraft.trim();
    if (!text) return;
    setComments((current) => [
      { id: `local-${Date.now()}`, authorName: "You", postedAt: "Just now", text },
      ...current,
    ]);
    setCommentDraft("");
    setShowComments(true);
  };

  return (
    <article className="flex w-full flex-col gap-[15px] rounded-[29px] border border-gray-200 bg-white p-[15px] sm:rounded-[15px]">
      <PostHeader post={post} />

      <div className="h-px w-full bg-gray-200" />

      {post.variant === "poll" ? (
        <PollBody post={post} />
      ) : (
        <>
          {(post.text || mediaItems.length > 0) && (
            // Mobile shows the image first with the caption below it;
            // desktop keeps the caption above the image.
            <div className="flex w-full flex-col-reverse gap-[15px] sm:flex-col">
              {post.text && (
                <div className="flex w-full items-end gap-0.5 text-sm leading-5">
                  <p className={cn("min-w-0 flex-1 whitespace-pre-line text-[#1e293b]", !textExpanded && "line-clamp-4")}>
                    {renderWithHashtags(post.text)}
                  </p>
                  {post.truncated !== false && (
                    <button
                      type="button"
                      onClick={() => setTextExpanded((v) => !v)}
                      className="shrink-0 font-bold text-gray-400"
                    >
                      {textExpanded ? "less" : "more"}
                    </button>
                  )}
                </div>
              )}

              {mediaItems.length > 0 && <MediaCarousel items={mediaItems} />}
            </div>
          )}

          {(post.priceLine || post.actions) && <div className="h-px w-full bg-gray-200" />}

          {post.priceLine && <PriceRow post={post} />}

          {post.actions && <ActionsRow post={post} />}
        </>
      )}

      <div className="h-px w-full bg-gray-200" />

      <PostStatsBar post={post} showComments={showComments} onToggleComments={() => setShowComments((v) => !v)} />

      {post.showComposer && (
        <div className="flex w-full items-center gap-2 rounded-3xl bg-gray-100 p-2">
          <span className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-[#eef2ff] text-[13px] font-extrabold text-[#4f46e5]">
            {currentUserAvatarInitials}
          </span>
          <input
            type="text"
            value={commentDraft}
            onChange={(event) => setCommentDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") submitComment();
            }}
            placeholder="Add a comment"
            className="min-w-0 flex-1 bg-transparent text-[11px] text-night-900/70 placeholder:text-night-900/40 focus:outline-none"
          />
          <EmojiPicker onSelect={(emoji) => setCommentDraft((current) => current + emoji)} />
          <button
            type="button"
            aria-label="Send comment"
            onClick={submitComment}
            className="relative block size-[23px] shrink-0"
          >
            <Image src="/icons/send-alt-filled.svg" alt="" fill sizes="23px" />
          </button>
        </div>
      )}

      {showComments && (
        <>
          <div className="sm:hidden">
            <CommentsSection comments={comments} />
          </div>
          <CommentsModal
            post={post}
            comments={comments}
            commentDraft={commentDraft}
            setCommentDraft={setCommentDraft}
            submitComment={submitComment}
            currentUserAvatarInitials={currentUserAvatarInitials}
            onClose={() => setShowComments(false)}
          />
        </>
      )}
    </article>
  );
}

function PostHeader({ post }: { post: PostCardData }) {
  const router = useRouter();
  const [following, setFollowing] = useState(false);

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="relative block size-[46px] shrink-0">
          <span
            className={cn(
              "relative block size-full overflow-hidden rounded-full",
              post.avatarPlaceholder && "flex items-center justify-center bg-[#eef2ff]",
            )}
          >
            {post.avatarPlaceholder ? (
              <span className="relative block size-[27px]">
                <Image src="/icons/avatar-placeholder-user.svg" alt="" fill sizes="27px" />
              </span>
            ) : (
              <Image src={post.avatar} alt={post.authorName} fill className="object-cover" sizes="46px" />
            )}
          </span>
          {post.verified && (
            <span className="absolute -bottom-0.5 -right-0.5 block size-[17px]">
              <Image
                src={
                  post.verified === "individual"
                    ? "/icons/avatar-verified-badge-green.svg"
                    : "/icons/avatar-verified-badge.svg"
                }
                alt=""
                fill
                sizes="17px"
              />
            </span>
          )}
        </span>
        <div className="flex flex-col items-start whitespace-nowrap">
          <p className="text-[13px] font-bold text-brand-900">{post.authorName}</p>
          <p className="text-[9.5px] text-gray-500">
            {post.roleLine} <span className="font-medium">{post.postedAt}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {post.variant !== "poll" && (
          <>
            <Tooltip label={following ? "Following" : "Follow"} className="sm:hidden">
              <button
                type="button"
                onClick={() => setFollowing((v) => !v)}
                aria-label={following ? "Following" : "Follow"}
                aria-pressed={following}
                className="flex size-[38px] shrink-0 items-center justify-center rounded-lg"
              >
                <NavIcon
                  icon={following ? "/icons/check-circle.svg" : "/icons/user-add-01.svg"}
                  color="brand"
                  size={20}
                  className="shrink-0"
                />
              </button>
            </Tooltip>
            <FollowButton
              following={following}
              onToggle={() => setFollowing((v) => !v)}
              name={post.authorName}
              className="hidden sm:flex"
            />
          </>
        )}
        <Tooltip label="Post options" className="sm:hidden">
          <button
            type="button"
            aria-label="Post options"
            onClick={() => router.push(comingSoonHref("Post options"))}
            className="relative block size-[23px] shrink-0"
          >
            <Image src="/icons/more-horizontal.svg" alt="" fill sizes="23px" />
          </button>
        </Tooltip>
        <Tooltip label="Post options" className="hidden sm:inline-flex">
          <button
            type="button"
            aria-label="Post options"
            onClick={() => router.push(comingSoonHref("Post options"))}
            className="relative block size-[23px] shrink-0"
          >
            <Image src="/icons/menu-03.svg" alt="" fill sizes="23px" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}

function MediaCarousel({ items }: { items: MediaItem[] }) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const hasMultiple = items.length > 1;
  const current = items[index];

  const goTo = (next: number) => setIndex((next + items.length) % items.length);

  return (
    <div className="relative h-[285px] w-full overflow-hidden rounded-[29px] sm:rounded-[15px]">
      {current.isVideo ? (
        <video src={current.url} controls className="size-full object-cover" />
      ) : (
        <button
          type="button"
          aria-label="View full image"
          onClick={() => setLightboxOpen(true)}
          className="absolute inset-0 block size-full"
        >
          <Image src={current.url} alt="" fill className="object-cover" sizes="770px" />
        </button>
      )}

      {lightboxOpen &&
        createPortal(
          <MediaLightbox items={items} index={index} onIndexChange={goTo} onClose={() => setLightboxOpen(false)} />,
          document.body,
        )}

      {hasMultiple && (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-between px-4">
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => goTo(index - 1)}
              className="pointer-events-auto flex size-[21px] items-center justify-center rounded-full bg-white shadow-[0px_0px_10px_rgba(69,71,69,0.25)]"
            >
              <span className="relative block h-3 w-[5.5px] rotate-180">
                <Image src="/icons/carousel-arrow.svg" alt="" fill sizes="6px" />
              </span>
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => goTo(index + 1)}
              className="pointer-events-auto flex size-[21px] items-center justify-center rounded-full bg-white shadow-[0px_0px_10px_rgba(69,71,69,0.25)]"
            >
              <span className="relative block h-3 w-[5.5px]">
                <Image src="/icons/carousel-arrow.svg" alt="" fill sizes="6px" />
              </span>
            </button>
          </div>

          <div className="absolute inset-x-0 bottom-[11px] flex items-center justify-center gap-2.5">
            {items.map((item, dot) => (
              <button
                key={item.url + dot}
                type="button"
                aria-label={`Go to image ${dot + 1}`}
                onClick={() => goTo(dot)}
                className={cn("size-[9.5px] rounded-full", dot === index ? "bg-brand-600" : "bg-white")}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MediaLightbox({
  items,
  index,
  onIndexChange,
  onClose,
}: {
  items: MediaItem[];
  index: number;
  onIndexChange: (next: number) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onIndexChange(index - 1);
      if (event.key === "ArrowRight") onIndexChange(index + 1);
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [index, onIndexChange, onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <span className="text-2xl leading-none">&times;</span>
      </button>

      <div className="relative h-full w-full max-w-4xl" onClick={(event) => event.stopPropagation()}>
        {items[index].isVideo ? (
          <video src={items[index].url} controls autoPlay className="size-full object-contain" />
        ) : (
          <Image src={items[index].url} alt="" fill className="object-contain" sizes="100vw" />
        )}
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(event) => {
              event.stopPropagation();
              onIndexChange(index - 1);
            }}
            className="absolute left-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <span className="relative block h-3 w-[5.5px] rotate-180">
              <Image src="/icons/carousel-arrow.svg" alt="" fill sizes="6px" className="invert" />
            </span>
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={(event) => {
              event.stopPropagation();
              onIndexChange(index + 1);
            }}
            className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <span className="relative block h-3 w-[5.5px]">
              <Image src="/icons/carousel-arrow.svg" alt="" fill sizes="6px" className="invert" />
            </span>
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[13px] font-medium text-white">
            {index + 1} / {items.length}
          </div>
        </>
      )}
    </div>
  );
}

function parseVoteCount(votes: string) {
  return Number(votes.replace(/,/g, "")) || 0;
}

function PollBody({ post }: { post: PostCardData }) {
  const [counts, setCounts] = useState(() => post.pollOptions?.map((option) => parseVoteCount(option.votes)) ?? []);
  const [votedIndex, setVotedIndex] = useState<number | null>(null);
  const [questionExpanded, setQuestionExpanded] = useState(false);

  const total = counts.reduce((sum, count) => sum + count, 0);
  const leadingIndex = counts.length
    ? counts.reduce((leader, count, index) => (count > counts[leader] ? index : leader), 0)
    : -1;

  function handleVote(index: number) {
    setCounts((current) => {
      const next = [...current];
      if (votedIndex === index) {
        next[index] -= 1;
      } else {
        if (votedIndex !== null) next[votedIndex] -= 1;
        next[index] += 1;
      }
      return next;
    });
    setVotedIndex((current) => (current === index ? null : index));
  }

  return (
    <div className="flex w-full flex-col gap-[15px]">
      {post.participantAvatars && (
        <div className="flex items-center -space-x-1">
          {post.participantAvatars.map((avatar, index) => (
            <span
              key={avatar + index}
              className="relative block size-[38px] shrink-0 overflow-hidden rounded-xl ring-2 ring-white"
            >
              <Image src={avatar} alt="" fill className="object-cover" sizes="38px" />
            </span>
          ))}
        </div>
      )}

      {post.question && (
        <div className="flex w-full items-end gap-0.5 text-[13px] leading-5">
          <p className={cn("min-w-0 flex-1 whitespace-pre-line text-[#1e293b]", !questionExpanded && "line-clamp-4")}>
            {post.question}{" "}
            {post.hashtags && <span className="font-semibold text-[#f088b6]">{post.hashtags}</span>}
          </p>
          <button
            type="button"
            onClick={() => setQuestionExpanded((v) => !v)}
            className="shrink-0 font-bold text-gray-400"
          >
            {questionExpanded ? "less" : "more"}
          </button>
        </div>
      )}

      {post.pollOptions && (
        <div className="flex w-full flex-col gap-[15px] rounded-[15px] border border-gray-200 p-[15px]">
          <div className="flex w-full flex-col gap-2">
            {post.pollOptions.map((option, index) => {
              const percent = total > 0 ? Math.round((counts[index] / total) * 100) : 0;
              const leading = index === leadingIndex && counts[index] > 0;
              const voted = index === votedIndex;
              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => handleVote(index)}
                  aria-pressed={voted}
                  aria-label={`Vote for ${option.label}`}
                  className="flex w-full items-center justify-between text-[13px]"
                >
                  <div
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-2 py-2 transition-all",
                      leading ? "bg-brand-900 text-white" : "bg-gray-100 text-night-900",
                      voted && "ring-2 ring-brand-600 ring-offset-1",
                    )}
                    style={{ width: `${Math.max(percent, 18)}%` }}
                  >
                    <span className="font-semibold">{percent}%</span>
                    <span className={cn(leading ? "text-white" : "text-gray-600")}>{option.label}</span>
                    {voted && (
                      <span className="relative block size-[19px] shrink-0">
                        <Image src="/icons/check-circle.svg" alt="" fill sizes="19px" />
                      </span>
                    )}
                  </div>
                  <span className="font-medium text-gray-400">{counts[index].toLocaleString()}</span>
                </button>
              );
            })}
          </div>
          {post.pollFooter && (
            <p className="text-left text-[11px] font-medium text-gray-600">
              {post.pollFooter.split(" — ")[0]} — {total.toLocaleString()} votes total
              {votedIndex !== null && " · you voted"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function PriceRow({ post }: { post: PostCardData }) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-col gap-1 whitespace-nowrap text-gray-700">
        <p className="text-[19px] font-semibold">
          {post.priceLine}
          {post.priceSuffix && <span className="text-[10.5px] font-normal">{post.priceSuffix}</span>}
        </p>
        <p className="text-[13px] font-light">{post.subLine}</p>
      </div>

      {post.beds !== undefined && post.baths !== undefined ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="relative block h-[15px] w-[17px]">
              <Image src="/icons/bed-single-01.svg" alt="" fill sizes="17px" />
            </span>
            <span className="text-[9.5px] font-light text-gray-700">
              {post.beds}
              <span className="hidden sm:inline"> bedroom</span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="relative block h-[15px] w-[17px]">
              <Image src="/icons/bathtub-02.svg" alt="" fill sizes="17px" />
            </span>
            <span className="text-[9.5px] font-light text-gray-700">
              {post.baths}
              <span className="hidden sm:inline"> bathroom</span>
            </span>
          </div>
        </div>
      ) : post.rating ? (
        <div className="flex items-center gap-1">
          <span className="relative block size-[13px]">
            <Image src="/icons/star-filled.svg" alt="" fill sizes="13px" />
          </span>
          <span className="text-[8px] font-light text-gray-700">{post.rating}</span>
        </div>
      ) : null}
    </div>
  );
}

function ActionsRow({ post }: { post: PostCardData }) {
  const router = useRouter();
  const [primary, secondary] = post.actions ?? [];
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        {primary && (
          <Button
            variant="primary"
            onClick={() => router.push(comingSoonHref(primary.label))}
            className="h-auto w-auto rounded-xl px-3 py-1.5 text-[10px] sm:h-[38px] sm:rounded-lg sm:px-[15px] sm:py-0 sm:text-[13px]"
          >
            {primary.label}
          </Button>
        )}
        {secondary && (
          <Button
            variant={secondary.variant}
            onClick={() => router.push(comingSoonHref(secondary.label))}
            className="h-auto w-auto rounded-xl px-3 py-1.5 text-[10px] sm:h-[38px] sm:rounded-lg sm:px-[15px] sm:py-0 sm:text-[13px]"
          >
            {secondary.label}
          </Button>
        )}
      </div>
      {post.messageHostLabel && (
        <Button
          variant="outline-brand"
          onClick={() => router.push(comingSoonHref(post.messageHostLabel!))}
          className="h-auto w-auto rounded-xl px-3 py-1.5 text-[10px] sm:h-[38px] sm:rounded-lg sm:px-[15px] sm:py-0 sm:text-[13px]"
        >
          {post.messageHostLabel}
        </Button>
      )}
    </div>
  );
}

async function sharePost(post: PostCardData) {
  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}#post-${post.id}` : "";
  const shareData = {
    title: post.authorName,
    text: post.text ?? post.subLine ?? "Check out this post on Biltlinx",
    url: shareUrl,
  };

  try {
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share(shareData);
      return;
    }
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard");
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return;
    toast.error("Couldn't share this post");
  }
}

function PostStatsBar({
  post,
  showComments,
  onToggleComments,
}: {
  post: PostCardData;
  showComments: boolean;
  onToggleComments: () => void;
}) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likesSheetOpen, setLikesSheetOpen] = useState(false);

  const likeCount = post.likes + (liked ? 1 : 0);
  const likerNames = buildLikerNames(likeCount);

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full items-center justify-between sm:justify-start sm:gap-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-6">
          <button
            type="button"
            className="flex items-center gap-2"
            aria-pressed={liked}
            aria-label={`${likeCount} Likes`}
            onClick={() => setLiked((v) => !v)}
          >
            <NavIcon
              key={liked ? "liked" : "unliked"}
              icon={liked ? "/icons/heart-like-filled.svg" : "/icons/heart-like.svg"}
              color="night"
              size={23}
              className={liked ? "bg-[#ef575f] animate-like-pop" : undefined}
            />
            <span
              className={cn(
                "hidden text-[11px] font-bold sm:inline",
                liked ? "text-[#ef575f]" : "text-brand-900",
              )}
            >
              {likeCount} Likes
            </span>
          </button>
          <button
            type="button"
            className="flex items-center gap-2"
            aria-expanded={showComments}
            aria-label={`${post.comments} Comments`}
            onClick={onToggleComments}
          >
            <span className="relative block size-[23px] shrink-0">
              <Image src="/icons/message-03.svg" alt="" fill sizes="23px" />
            </span>
            <span className="hidden text-[11px] font-bold text-brand-900 sm:inline">{post.comments} Comments</span>
          </button>
          <button type="button" className="flex items-center gap-2" aria-label={post.shareLabel ?? "Share"} onClick={() => sharePost(post)}>
            <span className="relative block size-[23px] shrink-0">
              <Image src="/icons/share-05.svg" alt="" fill sizes="23px" />
            </span>
            <span className="hidden text-[11px] font-bold text-brand-900 sm:inline">
              {post.shareLabel ?? "Share"}
            </span>
          </button>
        </div>
        <button
          type="button"
          className="flex items-center gap-2"
          aria-label={saved ? "Saved" : "Save"}
          onClick={() => setSaved((v) => !v)}
        >
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={saved ? "text-brand-600" : "text-night-700"}>
            <path
              d="M5 4.6C5 3.84575 5 3.46863 5.23431 3.23431C5.46863 3 5.84575 3 6.6 3H17.4C18.1542 3 18.5314 3 18.7657 3.23431C19 3.46863 19 3.84575 19 4.6V19.4454C19 20.1263 19 20.4667 18.783 20.5784C18.5661 20.69 18.289 20.4922 17.735 20.0964L12.93 16.6643C12.4809 16.3435 12.2564 16.1831 12 16.1831C11.7436 16.1831 11.5191 16.3435 11.07 16.6643L6.26499 20.0964C5.71095 20.4922 5.43393 20.69 5.21697 20.5784C5 20.4667 5 20.1263 5 19.4454V4.6Z"
              fill={saved ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          <span className="hidden text-[11px] font-bold text-brand-900 sm:inline">{saved ? "Saved" : "Save"}</span>
        </button>
      </div>

      {likeCount > 0 && (
        <button
          type="button"
          onClick={() => setLikesSheetOpen(true)}
          className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start"
        >
          <p className="min-w-0 flex-1 truncate text-left text-[11px] text-gray-600 sm:flex-none">
            Liked by <span className="font-bold text-brand-900">{likerNames[0]}</span>
            {likeCount > 1 && (
              <>
                {" "}
                and <span className="font-bold text-brand-900">{likeCount - 1} others</span>
              </>
            )}
          </p>
          <span className="flex shrink-0 items-center -space-x-2 sm:order-first sm:mr-1">
            {[0, 1, 2].map((avatar) => (
              <span
                key={avatar}
                className="relative block size-[22px] shrink-0 overflow-hidden rounded-full bg-[#eef2ff] ring-2 ring-white"
              >
                <Image src="/icons/avatar-placeholder-user.svg" alt="" fill sizes="22px" className="p-0.5" />
              </span>
            ))}
            {likeCount > 3 && (
              <span className="relative flex size-[22px] shrink-0 items-center justify-center rounded-full bg-night-900 text-[8px] font-bold text-white ring-2 ring-white">
                +{likeCount - 3}
              </span>
            )}
          </span>
        </button>
      )}

      <LikesBottomSheet open={likesSheetOpen} onClose={() => setLikesSheetOpen(false)} names={likerNames} />
    </div>
  );
}

const LIKER_NAME_POOL = [
  "Kwame", "Ama Boateng", "Kojo Mensah", "Efua Owusu", "Kwabena Asante",
  "Akosua Darko", "Yaw Agyeman", "Abena Sarpong", "Kofi Appiah", "Adjoa Nkrumah",
];

function buildLikerNames(count: number): string[] {
  return Array.from({ length: count }, (_, index) => LIKER_NAME_POOL[index % LIKER_NAME_POOL.length]);
}

function CommentsModal({
  post,
  comments,
  commentDraft,
  setCommentDraft,
  submitComment,
  currentUserAvatarInitials,
  onClose,
}: {
  post: PostCardData;
  comments: CommentItem[];
  commentDraft: string;
  setCommentDraft: (value: string) => void;
  submitComment: () => void;
  currentUserAvatarInitials: string;
  onClose: () => void;
}) {
  const [liked, setLiked] = useState(false);
  const likeCount = post.likes + (liked ? 1 : 0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[120] hidden items-center justify-center bg-black/50 p-4 sm:flex"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Comments"
    >
      <div onClick={(event) => event.stopPropagation()} className="relative w-full max-w-[770px]">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute -right-3 -top-3 z-10 flex size-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-md hover:bg-gray-50"
        >
          <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <div className="flex max-h-[85vh] w-full flex-col gap-5 overflow-y-auto overflow-x-hidden rounded-2xl bg-white p-8 shadow-[0px_24px_60px_-15px_rgba(0,0,0,0.15)]">
        {post.showComposer && (
          <div className="flex w-full items-center gap-2 rounded-3xl bg-gray-100 p-2">
            <span className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-[#eef2ff] text-[13px] font-extrabold text-[#4f46e5]">
              {currentUserAvatarInitials}
            </span>
            <input
              type="text"
              value={commentDraft}
              onChange={(event) => setCommentDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") submitComment();
              }}
              placeholder="Add a comment"
              className="min-w-0 flex-1 bg-transparent text-[11px] text-night-900/70 placeholder:text-night-900/40 focus:outline-none"
            />
            <EmojiPicker onSelect={(emoji) => setCommentDraft(commentDraft + emoji)} side="bottom" />
            <button
              type="button"
              aria-label="Send comment"
              onClick={submitComment}
              className="relative block size-[23px] shrink-0"
            >
              <Image src="/icons/send-alt-filled.svg" alt="" fill sizes="23px" />
            </button>
          </div>
        )}

        <div className="flex w-full items-center justify-between px-2.5">
          <button
            type="button"
            aria-pressed={liked}
            aria-label={`${likeCount} Likes`}
            onClick={() => setLiked((v) => !v)}
            className="flex items-center gap-2"
          >
            <NavIcon
              key={liked ? "liked" : "unliked"}
              icon={liked ? "/icons/heart-like-filled.svg" : "/icons/heart-like.svg"}
              color="night"
              size={20}
              className={liked ? "bg-[#ef575f] animate-like-pop" : undefined}
            />
            <span className={cn("text-xs font-bold", liked ? "text-[#ef575f]" : "text-brand-900")}>
              {likeCount} Likes
            </span>
          </button>
          <span className="flex items-center gap-4">
            <button
              type="button"
              aria-label={post.shareLabel ?? "Share"}
              onClick={() => sharePost(post)}
              className="text-xs font-bold text-brand-900"
            >
              {post.shares ?? 12} Shares
            </button>
            <span className="text-xs font-bold text-brand-900">{post.comments} Comments</span>
          </span>
        </div>

        <div className="flex w-full flex-col items-center gap-[14px]">
          {comments.map((comment) => (
            <CommentRow key={comment.id} comment={comment} />
          ))}
        </div>

        <button type="button" className="text-left text-[11px] font-bold text-brand-900">
          Load More Comments
        </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function CommentsSection({ comments }: { comments: CommentItem[] }) {
  return (
    <div className="flex w-full flex-col gap-2.5">
      <p className="text-[11px] font-bold text-brand-900">Comments</p>
      <div className="flex w-full flex-col items-center gap-[14px]">
        {comments.map((comment) => (
          <CommentRow key={comment.id} comment={comment} />
        ))}
      </div>
      <button type="button" className="text-left text-[11px] font-bold text-brand-900">
        Load More Comments
      </button>
    </div>
  );
}

function CommentRow({ comment }: { comment: CommentItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex w-full items-start gap-[14px]">
      <span className="relative block size-[47px] shrink-0 overflow-hidden rounded-full bg-[#eef2ff]">
        {comment.avatar ? (
          <Image src={comment.avatar} alt={comment.authorName} fill className="object-cover" sizes="47px" />
        ) : (
          <span className="absolute left-1/2 top-1/2 block size-6 -translate-x-1/2 -translate-y-1/2">
            <Image src="/icons/avatar-placeholder-user.svg" alt="" fill sizes="24px" />
          </span>
        )}
      </span>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
        <div className="flex w-full items-start justify-between gap-2">
          <p className="text-[13px] font-bold text-brand-900">{comment.authorName}</p>
          <p className="shrink-0 text-[9.5px] text-gray-500">{comment.postedAt}</p>
        </div>
        <div className="flex w-full items-end gap-1 text-[13px] leading-[1.5]">
          <p className={cn("min-w-0 flex-1 whitespace-pre-line text-gray-600", !expanded && "line-clamp-4")}>
            {renderWithHashtags(comment.text)}
          </p>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="shrink-0 text-[11px] font-bold text-gray-400"
          >
            {expanded ? "less" : "more"}
          </button>
        </div>
        <CommentLikeButton initialLikes={comment.likes ?? 0} />
      </div>
    </div>
  );
}

function CommentLikeButton({ initialLikes }: { initialLikes: number }) {
  const [liked, setLiked] = useState(false);
  const likeCount = initialLikes + (liked ? 1 : 0);

  return (
    <button
      type="button"
      onClick={() => setLiked((v) => !v)}
      aria-pressed={liked}
      aria-label={liked ? "Unlike comment" : "Like comment"}
      className="flex items-center gap-1"
    >
      <NavIcon
        key={liked ? "liked" : "unliked"}
        icon={liked ? "/icons/heart-like-filled.svg" : "/icons/heart-like.svg"}
        color="brand"
        size={11}
        className={liked ? "bg-[#ef575f] animate-like-pop" : "bg-gray-400"}
      />
      {likeCount > 0 ? (
        <span className={cn("text-[9.5px] font-bold", liked ? "text-[#ef575f]" : "text-brand-900")}>
          {likeCount}
        </span>
      ) : (
        <span className="text-[9.5px] font-bold text-gray-400">Like</span>
      )}
    </button>
  );
}
