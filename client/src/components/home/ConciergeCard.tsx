"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { Button } from "@/components/ui/Button";

const FEATURES = [
  "Market your property",
  "Find & screen tenants/guests",
  "Manage bookings & rent collection",
  "Maintenance & repairs",
];

/** "Concierge Card" (Figma node 3371:3317) — the agency management pitch
 * with a faded portrait backdrop. Scrolls normally with the rest of the
 * sidebar rail — an earlier pass made it (then the whole rail) sticky, but
 * that was reverted at explicit request back to plain scrolling.
 *
 * This revision trims the copy (no more "From marketing and viewings…"
 * paragraph between the heading and the checklist, and the heading is one
 * line now instead of two) and swaps the drop-shadow for a border-border
 * outline, matching the rest of the sidebar rail's cards. "Become a Host"
 * is a translucent gold-outline pill with no icon now, not the solid gold
 * button with an arrow it used to be — see Button's own "outline-gold-on-dark"
 * variant doc comment. */
export function ConciergeCard() {
  return (
    <div className="relative w-full shrink-0 overflow-hidden rounded-[39px] border border-border bg-brand-navy p-8">
      <Image
        src="/images/concierge-portrait.png"
        alt=""
        fill
        className="object-cover opacity-60 [mask-image:linear-gradient(to_left,black_40%,transparent_85%)]"
      />

      <div className="relative flex flex-col gap-4 text-white">
        <div className="flex items-center gap-2">
          <DynamicIcon name="Award" className="size-3 text-brand-gold" />
          <span className="font-mono text-[10px] tracking-[1px] text-white/70 uppercase">
            Festari Agency
          </span>
        </div>

        <h2 className="font-heading text-base font-normal">We manage. You relax.</h2>

        <ul className="flex flex-col gap-3 py-2">
          {FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-xs">
              <DynamicIcon name="CircleCheck" className="size-3 shrink-0 text-brand-gold" />
              {feature}
            </li>
          ))}
        </ul>

        <Button
          variant="outline-gold-on-dark"
          className="w-full uppercase"
          onClick={() => toast.success("Thanks! Our team will reach out about hosting.")}
        >
          Become a Host
        </Button>
      </div>
    </div>
  );
}
