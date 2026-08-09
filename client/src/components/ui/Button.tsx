import { cn } from "@/lib/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "navy" | "gold" | "ghost" | "pill" | "outline-gold" | "outline-gold-white";
}

const VARIANT_STYLES: Record<NonNullable<ButtonProps["variant"]>, string> = {
  navy: "bg-brand-navy text-white hover:bg-brand-navy-light rounded-lg px-6 py-2",
  gold: "bg-brand-gold text-brand-navy hover:brightness-95 rounded-lg py-3 font-medium",
  ghost: "text-muted hover:text-ink",
  pill: "bg-surface-muted text-brand-navy font-semibold hover:bg-border-subtle rounded-full px-4 py-1.5",
  // The feed's one real Figma CTA button -- "Book Service" on the
  // Service/Promotion post (node 3340:1102): transparent pill, gold-brown
  // outline and label, not a filled color. Every "primary action" CTA a
  // post's action bar renders (Book Service, Make Enquiry, Make a
  // Reservation) shares this exact style now, matching the one Figma
  // actually specifies instead of an invented solid navy.
  "outline-gold":
    "border border-brand-gold-dark text-brand-gold-dark hover:bg-brand-gold-dark/5 rounded-full px-[21px] py-[9px] text-xs font-semibold tracking-[0.24px]",
  // Same outline-pill idea as "outline-gold", but for the "BECOME A HOST"
  // CTA on the navy Concierge Card (node 3379:4774) -- white/10 fill,
  // white uppercase label, since the gold-dark text used on white cards
  // would be unreadable against navy.
  "outline-gold-white":
    "bg-white/10 border border-brand-gold-dark text-white uppercase hover:bg-white/20 rounded-full px-6 py-2 font-heading text-base font-normal",
};

/** Base button — extend via `variant` and `className`, never fork a one-off style. */
export function Button({ variant = "navy", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 text-sm transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
        VARIANT_STYLES[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
