import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex w-full items-center justify-center gap-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        social: "h-12 rounded-xl bg-surface-button text-ink hover:bg-muted-300/40",
        link: "h-auto w-auto p-0 font-medium text-brand-900 underline underline-offset-2 hover:text-brand-900/80",
        primary: "h-10 rounded-lg bg-brand-900 text-white hover:bg-brand-900/90",
      },
    },
    defaultVariants: {
      variant: "social",
    },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />;
}
