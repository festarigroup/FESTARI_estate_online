import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex w-full items-center justify-center gap-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        social:
          "h-12 rounded-[20px] lg:rounded-xl bg-surface-button text-ink hover:bg-muted-300/40 dark:bg-night-800 dark:text-white dark:hover:bg-night-700/60",
        link: "h-auto w-auto p-0 font-medium text-brand-900 underline underline-offset-2 hover:text-brand-900/80",
        primary: "h-10 rounded-[20px] lg:rounded-lg bg-brand-900 text-white hover:bg-brand-900/90",
        secondary: "h-10 rounded-[20px] lg:rounded-lg bg-brand-300 text-white hover:bg-brand-300/90",
        outline: "h-10 rounded-[20px] lg:rounded-lg border border-gray-200 bg-white text-night-900 hover:bg-gray-50",
        "outline-brand": "h-10 rounded-[20px] lg:rounded-lg border border-brand-900 bg-white text-brand-900 hover:bg-brand-900/5",
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
