import { useState } from "react";

const DEFAULT_DELAY_MS = 1500;

export function useHangTight(delayMs: number = DEFAULT_DELAY_MS) {
  const [pending, setPending] = useState(false);

  function run(onSettled: () => void) {
    setPending(true);
    setTimeout(() => {
      setPending(false);
      onSettled();
    }, delayMs);
  }

  return { pending, run };
}
