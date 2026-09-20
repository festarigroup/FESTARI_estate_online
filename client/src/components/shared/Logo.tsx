import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

/**
 * Full-color "Biltlinx" wordmark. The source PNG has transparent padding
 * around the mark, so it's cropped via percentage-based absolute
 * positioning (matching the Figma fill transform) rather than plain
 * `object-fit`, keeping the crop correct at any box size.
 */
export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("relative aspect-[204/67] overflow-hidden", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- percentage-based crop needs a plain img, not next/image's fixed intrinsic sizing */}
      <img
        src="/brand/logo-color.png"
        alt="Biltlinx"
        className="absolute left-[-55.77%] top-[-82.35%] h-[243.14%] w-[158.97%] max-w-none"
      />
    </div>
  );
}
