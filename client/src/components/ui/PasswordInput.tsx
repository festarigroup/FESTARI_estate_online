"use client";

import { useState } from "react";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { cn } from "@/lib/cn";

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  className?: string;
}

/** Password `<input>` with a show/hide toggle. Not a Figma frame (no auth
 * screens exist in the file), so the eye-icon convention here is this app's
 * own -- shared between login and register so both password fields behave
 * identically instead of forking the same toggle state twice. */
export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input type={visible ? "text" : "password"} className={cn("w-full pr-10", className)} {...props} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted hover:text-ink"
      >
        <DynamicIcon name={visible ? "EyeOff" : "Eye"} className="size-4" />
      </button>
    </div>
  );
}
