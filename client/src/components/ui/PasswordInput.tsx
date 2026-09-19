"use client";

import { useState, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 3l18 18M10.6 10.7a3 3 0 0 0 4.2 4.2M6.5 6.6C4.2 8.1 2 12 2 12s3.5 7 10 7c1.8 0 3.3-.4 4.6-1.1M9.9 4.2C10.6 4.1 11.3 4 12 4c6.5 0 10 7 10 7-.4.9-1.2 2.1-2.4 3.3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PasswordInput({ label, id, className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={id} className="text-sm text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          className={cn(
            "h-12 w-full rounded-lg border border-muted-300 px-3 pr-11 text-sm text-ink placeholder:text-muted-400 focus:outline-none focus:ring-2 focus:ring-brand-900",
            className,
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          <EyeIcon open={visible} />
        </button>
      </div>
    </div>
  );
}
