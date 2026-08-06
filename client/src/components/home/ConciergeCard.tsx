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

/** "Concierge Card" — the agency management pitch with a faded portrait backdrop. */
export function ConciergeCard() {
  return (
    <div className="relative w-full shrink-0 overflow-hidden rounded-xl bg-brand-navy p-8 shadow-[0px_4px_12px_0px_rgba(0,31,63,0.08)]">
      <Image
        src="/images/concierge-portrait.png"
        alt=""
        fill
        className="object-cover opacity-60 [mask-image:linear-gradient(to_left,black_40%,transparent_85%)]"
      />

      <div className="relative flex flex-col gap-4 text-white">
        <div className="flex items-center gap-2">
          <DynamicIcon name="Building2" className="size-3" />
          <span className="font-mono text-[10px] tracking-[1px] text-white/70 uppercase">
            Festari Agency
          </span>
        </div>

        <h2 className="font-heading text-base">
          We manage.
          <br />
          You relax.
        </h2>

        <p className="text-sm text-white/70">
          From marketing and viewings to tenant support, maintenance and reporting, we handle
          everything.
        </p>

        <ul className="flex flex-col gap-3 py-2">
          {FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-xs">
              <DynamicIcon name="Check" className="size-3 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        <Button
          variant="gold"
          className="w-full"
          onClick={() => toast.success("Thanks! Our team will reach out about hosting.")}
        >
          Become a Host
          <DynamicIcon name="ArrowRight" className="size-4" />
        </Button>
      </div>
    </div>
  );
}
