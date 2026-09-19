"use client";

import { useRef } from "react";

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

  return (
    <div className="flex w-full items-center gap-3" role="group" aria-label="One-time passcode">
      {Array.from({ length: LENGTH }).map((_, index) => (
        <div key={index} className="flex flex-1 items-center gap-3">
          <input
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            value={value[index] ?? ""}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            inputMode="numeric"
            maxLength={1}
            aria-label={`Digit ${index + 1}`}
            className="h-12 w-full flex-1 rounded-xl bg-surface-button text-center text-base text-ink focus:outline-none focus:ring-2 focus:ring-brand-900"
          />
          {index < LENGTH - 1 && <span className="text-3xl text-muted-400">-</span>}
        </div>
      ))}
    </div>
  );
}
