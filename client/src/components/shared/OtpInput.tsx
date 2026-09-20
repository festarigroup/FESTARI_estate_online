"use client";

import { Fragment, useRef } from "react";

const LENGTH = 4;

interface OtpInputProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function OtpInput({ value, onChange }: OtpInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  function handleChange(index: number, digit: string) {
    const nextDigit = digit.replace(/\D/g, "").slice(-1);
    const next = [...value];
    next[index] = nextDigit;
    onChange(next);

    if (nextDigit && index < LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleSelectExisting(event: { currentTarget: HTMLInputElement }) {
    // Select any existing digit so typing (or tapping on mobile) immediately
    // replaces it instead of being blocked by maxLength once the box is full.
    event.currentTarget.select();
  }

  return (
    <div className="flex w-full items-center gap-3" role="group" aria-label="One-time passcode">
      {Array.from({ length: LENGTH }).map((_, index) => (
        <Fragment key={index}>
          <input
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            value={value[index] ?? ""}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={handleSelectExisting}
            onClick={handleSelectExisting}
            inputMode="numeric"
            maxLength={1}
            aria-label={`Digit ${index + 1}`}
            className="h-12 min-w-0 flex-1 rounded-xl bg-surface-button text-center text-base text-ink focus:outline-none focus:ring-2 focus:ring-brand-900 dark:bg-night-800 dark:text-white"
          />
          {index < LENGTH - 1 && (
            <span className="shrink-0 text-3xl text-muted-400 dark:text-night-700">-</span>
          )}
        </Fragment>
      ))}
    </div>
  );
}
