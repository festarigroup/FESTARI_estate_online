"use client";

import { useCallback, useMemo, useState } from "react";
import { StayCategoryNav } from "@/components/stay/StayCategoryNav";
import { StayFilterRow } from "@/components/stay/StayFilterRow";
import { StayListingCard } from "@/components/stay/StayListingCard";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { useRegisterPostComposerHandler } from "@/context/PostComposerContext";
import { STAY_CATEGORIES } from "@/lib/mock-data";
import type { ContentPost, GeneralPost, StayCategory } from "@/types/home";

const ANY_GUESTS = "Guests";
const GUEST_OPTIONS = [ANY_GUESTS, "1-2 Guests", "3-4 Guests", "5+ Guests"];
// A guest-count filter has nothing real to match against on VenueDetails
// (no "sleeps N" field exists yet) -- bedrooms * 2 is this app's own rough
// stand-in, not a pulled design, same reasoning PropertiesBrowser already
// applies to its own price-range buckets.
const GUEST_MIN: Record<string, number> = { "1-2 Guests": 1, "3-4 Guests": 3, "5+ Guests": 5 };

const ANY_PRICE = "Price Range";
const PRICE_RANGES: { label: string; test: (n: number) => boolean }[] = [
  { label: ANY_PRICE, test: () => true },
  { label: "Under GHS 500/night", test: (n) => n < 500 },
  { label: "GHS 500 – 1,500/night", test: (n) => n >= 500 && n < 1_500 },
  { label: "GHS 1,500 – 3,000/night", test: (n) => n >= 1_500 && n < 3_000 },
  { label: "Above GHS 3,000/night", test: (n) => n >= 3_000 },
];

/** Owns the Stay page's category tabs, filter row, and venue feed — Figma
 * node 3393:16310's "Feed Column (8 columns)". The page itself owns the
 * title (mirrors properties/page.tsx owning Properties' title while
 * PropertiesBrowser only owns the filter row + listing grid below it).
 * Category tabs scroll away normally with the feed; StayFilterRow's own
 * root is the sticky element, positioned the same way as
 * PropertiesFilterRow (see its doc comment). There's also no separate
 * composer bar rendered on this screen anymore: posting now goes through
 * TopNavBar's global "+ Create Post" button instead, see
 * PostComposerContext. Venue posts have no backend counterpart yet (see
 * CreatePostModal), so `listings` starts from the seeded STAY_LISTINGS mock
 * and only grows locally as that global composer creates new venue posts
 * this session. */
export function StayBrowser({ initialListings }: { initialListings: GeneralPost[] }) {
  const [listings, setListings] = useState(initialListings);
  const [category, setCategory] = useState<StayCategory>(STAY_CATEGORIES[0].id);
  const [whereTo, setWhereTo] = useState("");
  const [dates, setDates] = useState("");
  const [guests, setGuests] = useState(ANY_GUESTS);
  const [priceRange, setPriceRange] = useState(ANY_PRICE);

  const addPost = useCallback((post: ContentPost) => {
    // Every other page's composer only shows its own post kind (Properties
    // never renders a service post it can't fetch) -- a property/service/
    // poll post created from here still posts (CreatePostModal's own toast
    // already confirms that), it just won't appear in this venue-only feed.
    if (post.kind === "general" && post.tag === "venue") {
      setListings((prev) => [post, ...prev]);
    }
  }, []);

  // Lets TopNavBar's global "+ Create Post" button (Figma node 3393:18030)
  // land venue posts here whenever the Stay page is the mounted page.
  useRegisterPostComposerHandler(addPost);

  function handleClearFilters() {
    setWhereTo("");
    setGuests(ANY_GUESTS);
    setPriceRange(ANY_PRICE);
  }

  const filtered = useMemo(() => {
    const priceTest = PRICE_RANGES.find((r) => r.label === priceRange)?.test ?? (() => true);
    const minGuests = GUEST_MIN[guests] ?? 0;
    const query = whereTo.trim().toLowerCase();
    return listings.filter((listing) => {
      const venue = listing.venueDetails;
      if (!venue || venue.category !== category) return false;
      if (!priceTest(venue.pricePerNight)) return false;
      if (venue.bedrooms * 2 < minGuests) return false;
      if (query && !`${venue.name} ${venue.location}`.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [listings, category, priceRange, guests, whereTo]);

  return (
    <>
      <StayCategoryNav active={category} onSelect={setCategory} />

      <StayFilterRow
        whereTo={whereTo}
        onWhereToChange={setWhereTo}
        dates={dates}
        onDatesChange={setDates}
        guests={guests}
        guestOptions={GUEST_OPTIONS}
        onGuestsChange={setGuests}
        priceRange={priceRange}
        priceRangeOptions={PRICE_RANGES.map((r) => r.label)}
        onPriceRangeChange={setPriceRange}
      />

      <div className="flex w-full flex-col gap-6">
        {filtered.length > 0 ? (
          filtered.map((listing) => <StayListingCard key={listing.id} post={listing} />)
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border-subtle bg-white py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-surface-muted">
              <DynamicIcon name="Search" className="size-5 text-muted" />
            </span>
            <p className="text-sm font-semibold text-ink">No stays match these filters</p>
            <button onClick={handleClearFilters} className="text-sm font-semibold text-brand-navy hover:underline">
              Clear filters
            </button>
          </div>
        )}
      </div>
    </>
  );
}
