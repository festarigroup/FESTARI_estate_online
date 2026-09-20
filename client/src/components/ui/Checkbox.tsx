import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
}

export function Checkbox({ label, id, className, ...props }: CheckboxProps) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-xs text-ink dark:text-white">
      <input
        id={id}
        type="checkbox"
        className={cn(
          "size-[18px] rounded border border-muted-300 accent-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-900",
          "dark:border-night-700 dark:bg-night-800",
          className,
        )}
        {...props}
      />
      {label}
    </label>
  );
}
