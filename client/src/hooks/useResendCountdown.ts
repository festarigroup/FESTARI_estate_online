import { useEffect, useState } from "react";

const DEFAULT_SECONDS = 60;

export function useResendCountdown(seconds: number = DEFAULT_SECONDS) {
  const [secondsLeft, setSecondsLeft] = useState(seconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  function restart() {
    setSecondsLeft(seconds);
  }

  return { secondsLeft, canResend: secondsLeft <= 0, restart };
}
