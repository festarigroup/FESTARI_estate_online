import Image from "next/image";
import { SiteNav } from "@/components/shared/SiteNav";

export interface AuthBrandTagline {
  highlight: string;
  rest: string;
}

const DEFAULT_TAGLINE: AuthBrandTagline = { highlight: "Connecting", rest: "the Built Environment" };

interface AuthBrandPanelProps {
  tagline?: AuthBrandTagline;
  /** Overrides the bottom `SiteNav` with plain centered copy (e.g. the sign-up role explainer). */
  footerText?: string;
}

export function AuthBrandPanel({ tagline = DEFAULT_TAGLINE, footerText }: AuthBrandPanelProps) {
  return (
    <div className="hidden h-full w-full flex-col items-center overflow-hidden rounded-[38px] bg-gradient-to-r from-brand-gradient-from to-brand-gradient-to px-8 py-10 lg:flex">
      <Image src="/brand/hero-illustration.png" alt="Biltlinx" width={132} height={66} priority />

      <h1 className="mt-6 max-w-md text-center font-display text-[40px] font-semibold leading-[1.1] tracking-[-3.2px] text-white">
        <span className="text-[#cfdddd]">{tagline.highlight}</span> {tagline.rest}
      </h1>

      <div className="flex-1" />

      {footerText ? (
        <p className="max-w-sm text-center font-display text-base font-semibold leading-[1.1] tracking-[-1.28px] text-white">
          {footerText}
        </p>
      ) : (
        <SiteNav size="base" />
      )}
    </div>
  );
}
