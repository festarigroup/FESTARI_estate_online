import Image from "next/image";
import Link from "next/link";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import {
  CATEGORY_META,
  CONTACT_FOR_PRICE_ALLOWED,
  formatMarketplacePrice,
  type MarketplaceItem,
} from "@/types/marketplace";

/**
 * The one card every Marketplace category renders through — a category
 * badge plus a category-specific body (facts strip + optional Sale/Hire
 * badge), never a bespoke card per category. This is deliberately its own,
 * lighter component rather than reusing PropertyListingCard/StayListingCard:
 * those are full social-feed post cards (author header, like/comment/repost/
 * share/save bar, comments panel, lightbox) built around the home feed's
 * `Post` model, which a materials listing or an equipment-hire result has
 * no equivalent of. What IS reused is the established visual language those
 * cards already set — the same rounded-[19px]/[24px] card shell, the same
 * `bg-brand-gold-dark` uppercase corner badge, the same "GHS X,XXX /unit"
 * price convention — so this doesn't read as a different app bolted on.
 *
 * Enforces the price-first hard rule at the last possible point: even
 * though `fetchMarketplaceSearch` already filters out invalid items,
 * returning `null` here for anything that slips through means a card with
 * no price on a category outside the allow-list can never render, full
 * stop, regardless of what a future real backend sends.
 */
export function UniversalCard({ item }: { item: MarketplaceItem }) {
  const isPriceValid = item.price !== null || CONTACT_FOR_PRICE_ALLOWED.includes(item.category);
  if (!isPriceValid) return null;

  const meta = CATEGORY_META[item.category];
  const media = item.media[0];

  return (
    <Link
      href={item.linkTo}
      className="flex w-full flex-col overflow-hidden rounded-[19px] border border-border-subtle bg-white transition-shadow hover:shadow-md lg:rounded-[24px]"
    >
      <div className="relative h-[180px] w-full shrink-0 overflow-hidden bg-surface-muted">
        {media ? (
          <Image
            src={media.url}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <DynamicIcon name={meta.icon} className="size-8 text-muted" />
          </div>
        )}

        <span className="absolute top-3 left-3 flex items-center gap-1 rounded bg-brand-gold-dark px-2 py-1 text-[10px] font-semibold tracking-[0.5px] text-white uppercase shadow-sm">
          <DynamicIcon name={meta.icon} className="size-3" />
          {meta.label}
        </span>

        {item.verified && (
          <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-brand-navy/80 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-[2px]">
            <DynamicIcon name="BadgeCheck" className="size-3" />
            Verified
          </span>
        )}

        {item.category === "equipment" && item.saleOrHire && (
          <span className="absolute bottom-3 left-3 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-brand-navy uppercase shadow-sm">
            {item.saleOrHire === "hire" ? "For Hire" : "For Sale"}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="truncate font-heading text-sm font-semibold text-ink">{item.title}</h3>

        <p className="flex items-center gap-1 text-xs text-muted">
          <DynamicIcon name="MapPin" className="size-3.5 shrink-0" />
          <span className="truncate">{item.location}</span>
        </p>

        {item.facts && item.facts.length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink/80">
            {item.facts.map((fact) => (
              <span key={fact}>{fact}</span>
            ))}
          </div>
        )}

        <p className="mt-auto pt-2 font-heading text-lg font-semibold text-brand-navy">
          {formatMarketplacePrice(item.price)}
        </p>
      </div>
    </Link>
  );
}
