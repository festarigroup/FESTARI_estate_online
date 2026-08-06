import { cn } from "@/lib/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "navy" | "gold" | "ghost" | "pill";
}

const VARIANT_STYLES: Record<NonNullable<ButtonProps["variant"]>, string> = {
  navy: "bg-brand-navy text-white hover:bg-brand-navy-light rounded-lg px-6 py-2",
  gold: "bg-brand-gold text-brand-navy hover:brightness-95 rounded-lg py-3 font-medium",
  ghost: "text-muted hover:text-ink",
  pill: "bg-surface-muted text-brand-navy font-semibold hover:bg-border-subtle rounded-full px-4 py-1.5",
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
