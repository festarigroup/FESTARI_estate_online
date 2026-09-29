import Image from "next/image";
import Link from "next/link";
import { comingSoonHref } from "@/lib/coming-soon";
import { MARKETPLACE_LISTINGS, type MarketplaceListing } from "@/lib/dummy-marketplace";

/** "/home" dashboard's property-marketplace teaser grid. */
export function MarketplaceSection() {
  return (
    <section className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[15px] font-bold text-night-900">Picked for you in Marketplace</h2>
        <Link href={comingSoonHref("Marketplace")} className="text-[12.5px] font-medium text-brand-600">
          Browse Marketplace
        </Link>
      </div>

      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {MARKETPLACE_LISTINGS.map((listing) => (
          <MarketplaceCard key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
}

function MarketplaceCard({ listing }: { listing: MarketplaceListing }) {
  return (
    <Link
      href={comingSoonHref(listing.subLine)}
      className="flex w-full flex-col gap-3.5 rounded-[28px] border border-gray-200 bg-white p-4 hover:border-brand-200"
    >
      <div className="relative h-[280px] w-full overflow-hidden rounded-[18px]">
        <Image
          src={listing.image}
          alt={listing.subLine}
          fill
          className="object-cover"
          sizes="(min-width: 640px) 50vw, 100vw"
        />
        <span className="absolute left-3 top-3 rounded-full bg-[#e3f2f7] px-2.5 py-1 text-[11px] text-night-900">
          {listing.category}
        </span>
        {listing.sponsored && (
          <span className="absolute right-3 top-3 rounded-full border border-gray-200 bg-white/90 px-2.5 py-1 text-[10.5px] font-medium text-gray-700">
            Sponsored
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <span className="flex w-fit items-center gap-1 rounded-full border border-emerald-800/20 bg-emerald-50 px-2 py-1 text-[9.5px] text-emerald-600">
          <span className="relative block size-2 shrink-0">
            <Image src="/icons/check-circle.svg" alt="" fill sizes="8px" />
          </span>
          {listing.verificationLabel}
        </span>

        <p className="text-[17px] font-semibold text-gray-700">
          {listing.price}
          <span className="text-[11px] font-normal">/{listing.priceUnit}</span>
        </p>
        <p className="text-[12px] text-gray-700">{listing.subLine}</p>
        <p className="text-[12px] text-gray-500">{listing.detailLine}</p>
      </div>
    </Link>
  );
}
