import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, id, className, error, ...props }: InputProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={id} className="text-sm text-ink dark:text-white">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "h-12 w-full rounded-[20px] border border-muted-300 px-3 text-sm text-ink placeholder:text-muted-400 focus:outline-none focus:ring-2 focus:ring-brand-900 lg:rounded-lg",
          "dark:border-night-700 dark:bg-night-800 dark:text-white dark:placeholder:text-muted-400",
          error && "border-[#e73d1c] focus:ring-[#e73d1c]",
          className,
        )}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-[#e73d1c]">
          {error}
        </p>
      )}
    </div>
  );
}
