"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { DynamicIcon, type IconName } from "@/components/ui/DynamicIcon";
import { useAuth } from "@/context/AuthContext";
import * as feedApi from "@/lib/api/feed";
import * as propertiesApi from "@/lib/api/properties";
import { mapPost } from "@/lib/adapters";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/cn";
import type { ContentPost } from "@/types/home";

export type AttachmentType = "photo" | "property" | "service" | "venue" | "poll";

export const ATTACHMENT_TYPES: { type: AttachmentType; label: string; icon: IconName }[] = [
  { type: "photo", label: "Photo/Video", icon: "ImageIcon" },
  { type: "property", label: "Property", icon: "Building2" },
  { type: "service", label: "Service", icon: "Wrench" },
  { type: "venue", label: "Venue", icon: "Landmark" },
  { type: "poll", label: "Poll", icon: "BarChart3" },
];

type TagType = "property" | "service" | "venue";

function isTagType(type: AttachmentType): type is TagType {
  return type === "property" || type === "service" || type === "venue";
}

const TAG_NOTE: Record<TagType, string> = {
  property: "This post will be tagged as a property listing.",
  service: "This post will be tagged as a service post.",
  venue: "This post will be tagged as a venue listing.",
};

const FIELD_CLASS =
  "w-full rounded-lg border border-border-subtle px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-2 focus:outline-brand-gold";

interface MediaAttachment {
  url: string;
  type: "image" | "video";
  file: File;
}

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (post: ContentPost) => void;
  /** Which attach button the composer was opened from, if any. */
  initialAttachment?: AttachmentType;
}

/** "What's on your mind" composer, expanded — text + one optional attachment
 * type. Not a Figma frame (the file only shows the collapsed bar); built to
 * give those four buttons somewhere real to go. */
export function CreatePostModal({ open, onClose, onSubmit, initialAttachment }: CreatePostModalProps) {
  const { user } = useAuth();
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // Property/Service/Venue is a tag, independent of whether photos are
  // attached — a listing post can optionally carry photos too, it's just
  // never required. "Independent" means the photo picker isn't *gated*
  // behind the tag, not that it stays hidden: picking any of the three tags
  // also surfaces the photo option immediately (see handleToggleAttachment
  // and the initial state below), so the upload area doesn't need a
  // second, separate click to appear. Photo and Poll stay mutually
  // exclusive with each other (a poll-with-photos composer doesn't fit
  // this layout).
  const [tag, setTag] = useState<TagType | undefined>(
    initialAttachment && isTagType(initialAttachment) ? initialAttachment : undefined,
  );
  const [showPhotos, setShowPhotos] = useState(
    initialAttachment === "photo" || (!!initialAttachment && isTagType(initialAttachment)),
  );
  const [showPoll, setShowPoll] = useState(initialAttachment === "poll");
  const [media, setMedia] = useState<MediaAttachment[]>([]);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  // Only read/required when tag === "venue" — what a guest needs before
  // requesting a reservation (see VenueReservationButton/ReservationModal),
  // so this is the minimum a venue listing can't be posted without.
  const [venueName, setVenueName] = useState("");
  const [venueLocation, setVenueLocation] = useState("");
  const [venuePricePerNight, setVenuePricePerNight] = useState("");
  const [venueBedrooms, setVenueBedrooms] = useState("");
  // Only read/required when tag === "property" — the same facts the
  // Properties page's metadata strip shows for every listing there (see
  // PropertyPost/PropertyListingCard), so a property posted from here
  // carries the same information as one seeded for that page.
  const [propertyListingType, setPropertyListingType] = useState<"For Sale" | "For Rent">("For Sale");
  const [propertyPrice, setPropertyPrice] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [propertyLocation, setPropertyLocation] = useState("");
  const [propertyBeds, setPropertyBeds] = useState("");
  const [propertyBaths, setPropertyBaths] = useState("");
  const [propertyAreaSqm, setPropertyAreaSqm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function resetState() {
    setBody("");
    setTag(undefined);
    setShowPhotos(false);
    setShowPoll(false);
    setMedia([]);
    setPollQuestion("");
    setPollOptions(["", ""]);
    setVenueName("");
    setVenueLocation("");
    setVenuePricePerNight("");
    setVenueBedrooms("");
    setPropertyListingType("For Sale");
    setPropertyPrice("");
    setPropertyType("");
    setPropertyLocation("");
    setPropertyBeds("");
    setPropertyBaths("");
    setPropertyAreaSqm("");
  }

  // Cancel / backdrop click / Escape: nothing downstream is using these
  // blob URLs, so discard them here.
  function handleCancel() {
    media.forEach((m) => URL.revokeObjectURL(m.url));
    resetState();
    onClose();
  }

  function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setMedia((prev) => [
      ...prev,
      ...files.map((f) => ({
        url: URL.createObjectURL(f),
        type: (f.type.startsWith("video/") ? "video" : "image") as "image" | "video",
        file: f,
      })),
    ]);
  }

  function removeMedia(url: string) {
    URL.revokeObjectURL(url);
    setMedia((prev) => prev.filter((m) => m.url !== url));
  }

  function isAttachmentActive(type: AttachmentType) {
    if (type === "photo") return showPhotos;
    if (type === "poll") return showPoll;
    return tag === type;
  }

  function handleToggleAttachment(type: AttachmentType) {
    if (isTagType(type)) {
      const turningOn = tag !== type;
      setTag(turningOn ? type : undefined);
      if (turningOn) {
        // Surface the photo option immediately rather than requiring a
        // separate click on Photo/Video — attaching one stays optional,
        // it just shouldn't be an extra step to discover.
        setShowPhotos(true);
        setShowPoll(false);
      }
      return;
    }
    if (type === "photo") {
      setShowPhotos((prev) => {
        const next = !prev;
        if (next) {
          setShowPoll(false);
        } else {
          media.forEach((m) => URL.revokeObjectURL(m.url));
          setMedia([]);
        }
        return next;
      });
      return;
    }
    // Poll
    setShowPoll((prev) => {
      const next = !prev;
      if (next) {
        setShowPhotos(false);
        media.forEach((m) => URL.revokeObjectURL(m.url));
        setMedia([]);
      }
      return next;
    });
  }

  function updatePollOption(index: number, value: string) {
    setPollOptions((prev) => prev.map((o, i) => (i === index ? value : o)));
  }

  const trimmedOptions = pollOptions.map((o) => o.trim()).filter(Boolean);
  // A venue listing's required facts (name/location/price/bedrooms) stand in
  // for the usual "you need a caption, photo, or poll" gate — a guest can't
  // request a reservation off a bare caption, so these are what's actually
  // required to post one. Caption/photos stay optional extras on top.
  const venueFieldsValid =
    venueName.trim().length > 0 &&
    venueLocation.trim().length > 0 &&
    Number(venuePricePerNight) > 0 &&
    Number(venueBedrooms) > 0;
  // Same reasoning as venueFieldsValid: a buyer/renter can't act on a bare
  // caption, so these are what's actually required to post a property.
  const propertyFieldsValid =
    propertyType.trim().length > 0 &&
    propertyLocation.trim().length > 0 &&
    propertyPrice.trim().length > 0 &&
    Number(propertyBeds) > 0 &&
    Number(propertyBaths) > 0 &&
    Number(propertyAreaSqm) > 0;
  const canSubmit =
    tag === "venue"
      ? venueFieldsValid
      : tag === "property"
        ? propertyFieldsValid
        : body.trim().length > 0 ||
          media.length > 0 ||
          (showPoll && pollQuestion.trim().length > 0 && trimmedOptions.length >= 2);

  const authorName = [user?.firstname, user?.lastname].filter(Boolean).join(" ") || "You";

  // Venue and poll attachments have no backend counterpart yet (no venue
  // post kind, no poll model) — those two keep posting a local-only object,
  // same as before. Photo/property/service posts go through the real API.
  function buildLocalPost(): ContentPost {
    return {
      id: `post-${Date.now()}`,
      kind: "general",
      author: { name: authorName, avatar: user?.profile_picture ?? undefined, subtitle: "Just now" },
      body: body.trim() ? body.trim().split("\n") : [],
      images: media.length
        ? media.map((m) => ({
            src: m.url,
            alt: m.type === "video" ? `Video attached to ${authorName}'s post` : `Photo attached to ${authorName}'s post`,
            type: m.type,
          }))
        : undefined,
      poll:
        showPoll && trimmedOptions.length >= 2
          ? {
              question: pollQuestion.trim(),
              options: trimmedOptions.map((text, i) => ({ id: `opt-${i}`, text, votes: 0 })),
            }
          : undefined,
      tag,
      propertyDetails:
        tag === "property"
          ? {
              listingType: propertyListingType,
              price: propertyPrice.trim(),
              propertyType: propertyType.trim(),
              location: propertyLocation.trim(),
              beds: Number(propertyBeds),
              baths: Number(propertyBaths),
              areaSqm: Number(propertyAreaSqm),
            }
          : undefined,
      venueDetails:
        tag === "venue"
          ? {
              name: venueName.trim(),
              location: venueLocation.trim(),
              pricePerNight: Number(venuePricePerNight),
              bedrooms: Number(venueBedrooms),
            }
          : undefined,
      comments: [],
    };
  }

  async function handleSubmit() {
    if (!canSubmit || submitting) return;

    if (tag === "venue" || showPoll) {
      onSubmit(buildLocalPost());
      toast.success("Posted to your feed.");
      // Deliberately NOT revoking `images` here — the post we just created
      // now owns these blob URLs for as long as it's shown in the feed.
      resetState();
      onClose();
      return;
    }

    setSubmitting(true);
    try {
      let linkedPropertyId: string | undefined;
      if (tag === "property") {
        const numericPrice = Number(propertyPrice.replace(/[^0-9.]/g, "")) || 0;
        const property = await propertiesApi.createProperty({
          title: propertyType.trim(),
          price: numericPrice,
          location: propertyLocation.trim(),
          listing_type: propertyListingType === "For Sale" ? "for_sale" : "for_rent",
          property_type: "home",
          bedrooms: Number(propertyBeds) || undefined,
          bathrooms: Number(propertyBaths) || undefined,
          area_sqm: Number(propertyAreaSqm) || undefined,
        });
        linkedPropertyId = property.id;
      }

      const created = await feedApi.createPost({
        kind: tag === "property" ? "property" : tag === "service" ? "service" : "general",
        body: body.trim(),
        linked_property_id: linkedPropertyId,
      });

      const imageFiles = media.filter((m) => m.type === "image");
      for (const [index, attachment] of imageFiles.entries()) {
        try {
          await feedApi.uploadPostImage(created.id, attachment.file, index);
        } catch {
          // one failed image upload shouldn't block the rest of the post
        }
      }

      const full = await feedApi.getPost(created.id);
      onSubmit(mapPost(full));
      toast.success("Posted to your feed.");
      resetState();
      onClose();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't create your post.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={handleCancel} title="Create post">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Avatar src={user?.profile_picture ?? undefined} alt={authorName} size={40} />
          <span className="font-heading text-sm text-ink">{authorName}</span>
        </div>

        <textarea
          autoFocus
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={`What's on your mind, ${authorName}?`}
          rows={4}
          className="w-full resize-none rounded-lg border border-border-subtle p-3 text-base text-ink placeholder:text-muted focus:outline-2 focus:outline-brand-gold"
        />

        {showPhotos && (
          <div className="flex flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFilesSelected}
              className="hidden"
            />
            <div className="grid grid-cols-4 gap-2">
              {media.map((m) => (
                <div key={m.url} className="relative aspect-square overflow-hidden rounded-lg bg-brand-navy">
                  {m.type === "video" ? (
                    <video src={m.url} muted playsInline className="size-full object-cover" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element -- local blob: preview
                    <img src={m.url} alt="" className="size-full object-cover" />
                  )}
                  {m.type === "video" && (
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <DynamicIcon name="Play" className="size-6 fill-white text-white drop-shadow" />
                    </span>
                  )}
                  <button
                    onClick={() => removeMedia(m.url)}
                    aria-label="Remove attachment"
                    className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white"
                  >
                    <DynamicIcon name="X" className="size-3" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-muted text-muted hover:border-brand-gold hover:text-brand-gold"
              >
                <DynamicIcon name="Plus" className="size-4" />
                <span className="text-[10px]">Add</span>
              </button>
            </div>
          </div>
        )}

        {tag === "service" && (
          <p className="rounded-lg bg-surface-muted px-3 py-2 text-xs text-muted">
            {TAG_NOTE.service}
          </p>
        )}

        {tag === "property" && (
          <div className="flex flex-col gap-3 rounded-lg border border-border-subtle p-3">
            <p className="text-xs text-muted">
              {TAG_NOTE.property} Add the details buyers or renters need before reaching out.
            </p>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink">Listing type</span>
              <div className="flex gap-2">
                {(["For Sale", "For Rent"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPropertyListingType(type)}
                    className={cn(
                      "flex-1 rounded-lg border px-3 py-2 text-sm font-semibold",
                      propertyListingType === type
                        ? "border-brand-navy bg-brand-navy text-white"
                        : "border-border-subtle text-ink hover:bg-surface-muted",
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink">Property type</span>
              <input
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                placeholder="e.g. 4 Bedroom Detached House"
                className={FIELD_CLASS}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink">Location</span>
              <input
                value={propertyLocation}
                onChange={(e) => setPropertyLocation(e.target.value)}
                placeholder="e.g. East Legon, Accra"
                className={FIELD_CLASS}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink">Price</span>
              <input
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(e.target.value)}
                placeholder={propertyListingType === "For Sale" ? "e.g. GHS 3,450,000" : "e.g. GHS 8,000 / month"}
                className={FIELD_CLASS}
              />
            </label>
            <div className="grid grid-cols-3 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-ink">Beds</span>
                <input
                  type="number"
                  min="1"
                  value={propertyBeds}
                  onChange={(e) => setPropertyBeds(e.target.value)}
                  placeholder="e.g. 4"
                  className={FIELD_CLASS}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-ink">Baths</span>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={propertyBaths}
                  onChange={(e) => setPropertyBaths(e.target.value)}
                  placeholder="e.g. 4.5"
                  className={FIELD_CLASS}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-ink">Area (sqm)</span>
                <input
                  type="number"
                  min="1"
                  value={propertyAreaSqm}
                  onChange={(e) => setPropertyAreaSqm(e.target.value)}
                  placeholder="e.g. 420"
                  className={FIELD_CLASS}
                />
              </label>
            </div>
          </div>
        )}

        {tag === "venue" && (
          <div className="flex flex-col gap-3 rounded-lg border border-border-subtle p-3">
            <p className="text-xs text-muted">
              {TAG_NOTE.venue} Add the details a guest needs before requesting a reservation.
            </p>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink">Venue name</span>
              <input
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                placeholder="e.g. The Palm Garden Events Center"
                className={FIELD_CLASS}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink">Location</span>
              <input
                value={venueLocation}
                onChange={(e) => setVenueLocation(e.target.value)}
                placeholder="e.g. East Legon, Accra"
                className={FIELD_CLASS}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-ink">Price per night (GHS)</span>
                <input
                  type="number"
                  min="1"
                  value={venuePricePerNight}
                  onChange={(e) => setVenuePricePerNight(e.target.value)}
                  placeholder="e.g. 2500"
                  className={FIELD_CLASS}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-ink">Bedrooms</span>
                <input
                  type="number"
                  min="1"
                  value={venueBedrooms}
                  onChange={(e) => setVenueBedrooms(e.target.value)}
                  placeholder="e.g. 4"
                  className={FIELD_CLASS}
                />
              </label>
            </div>
          </div>
        )}

        {showPoll && (
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
              onClick={() => handleToggleAttachment(item.type)}
              className={cn(
                "flex items-center gap-2",
                isAttachmentActive(item.type) ? "text-brand-gold" : "text-brand-navy/70 hover:text-brand-navy",
              )}
            >
              <DynamicIcon name={item.icon} className="size-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="navy" onClick={handleSubmit} disabled={!canSubmit || submitting} className="px-6">
            {submitting ? "Posting..." : "Post"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
