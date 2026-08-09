import { cn } from "@/lib/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "count" | "listing-sale" | "listing-rent" | "overlay";
  className?: string;
}

const VARIANT_STYLES: Record<NonNullable<BadgeProps["variant"]>, string> = {
  count: "bg-brand-rust text-white text-[10px] rounded-full size-5 leading-[1]",
  "listing-sale": "bg-brand-navy text-white text-[8px] font-semibold uppercase rounded px-1.5 py-0.5",
  "listing-rent": "bg-brand-rust text-white text-[8px] font-semibold uppercase rounded px-1.5 py-0.5",
  overlay: "bg-brand-navy/80 text-white text-xs rounded px-2 py-1",
};

/** Small pill/count/label badge — overlaid on avatars, images, and list counts. */
export function Badge({ children, variant = "count", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap",
        VARIANT_STYLES[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
