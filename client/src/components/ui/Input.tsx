import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, id, className, ...props }: InputProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={id} className="text-sm text-ink">
        {label}
      </label>
      <input
        id={id}
        className={cn(
          "h-12 w-full rounded-lg border border-muted-300 px-3 text-sm text-ink placeholder:text-muted-400 focus:outline-none focus:ring-2 focus:ring-brand-900",
          className,
        )}
        {...props}
      />
    </div>
  );
}
