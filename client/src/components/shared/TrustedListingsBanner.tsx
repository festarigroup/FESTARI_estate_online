"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "biltlinx:trust-banner-shows";
const MAX_SHOWS_PER_SESSION = 3;
const AUTO_CLOSE_SECONDS = 14;
const INITIAL_DELAY_MS = 3000;
const MIN_REPEAT_DELAY_MS = 90_000;
const MAX_REPEAT_DELAY_MS = 210_000;

function nextRepeatDelay() {
  return MIN_REPEAT_DELAY_MS + Math.random() * (MAX_REPEAT_DELAY_MS - MIN_REPEAT_DELAY_MS);
}

function readShowCount() {
  try {
    return Number(sessionStorage.getItem(STORAGE_KEY) ?? "0");
  } catch {
    return 0;
  }
}

function writeShowCount(count: number) {
  try {
    sessionStorage.setItem(STORAGE_KEY, String(count));
  } catch {
    // Ignore — the banner still works for this session, it just won't remember its count.
  }
}

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 1.667a8.333 8.333 0 1 0 0 16.666 8.333 8.333 0 0 0 0-16.666Zm.833 12.5H9.167v-5h1.666v5Zm0-6.667H9.167V5.833h1.666V7.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M12 4.7L11.3 4L8 7.3L4.7 4L4 4.7L7.3 8L4 11.3L4.7 12L8 8.7L11.3 12L12 11.3L8.7 8L12 4.7Z" fill="currentColor" />
    </svg>
  );
}

/**
 * Occasional reminder on the feed that only Property/Stay/Service/Project
 * posts are backed by a real listing — a plain text/media post can claim
 * anything. Shows once shortly after arriving, auto-dismisses, and can
 * resurface a couple more times over the session at random, throttled
 * intervals so it stays a nudge rather than a nuisance.
 */
export function TrustedListingsBanner() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(AUTO_CLOSE_SECONDS);

  const countdownRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const autoCloseRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const scheduleRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const unmountRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  function clearActiveTimers() {
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
  }

  function showBanner() {
    const shown = readShowCount();
    if (shown >= MAX_SHOWS_PER_SESSION) return;
    writeShowCount(shown + 1);

    setClosing(false);
    setSecondsLeft(AUTO_CLOSE_SECONDS);
    setVisible(true);

    countdownRef.current = setInterval(() => {
      setSecondsLeft((current) => (current <= 1 ? 0 : current - 1));
    }, 1000);
    autoCloseRef.current = setTimeout(dismiss, AUTO_CLOSE_SECONDS * 1000);
  }

  function dismiss() {
    clearActiveTimers();
    setClosing(true);
    unmountRef.current = setTimeout(() => setVisible(false), 150);

    if (readShowCount() < MAX_SHOWS_PER_SESSION) {
      scheduleRef.current = setTimeout(showBanner, nextRepeatDelay());
    }
  }

  useEffect(() => {
    scheduleRef.current = setTimeout(
      showBanner,
      readShowCount() === 0 ? INITIAL_DELAY_MS : nextRepeatDelay(),
    );
    return () => {
      clearActiveTimers();
      if (scheduleRef.current) clearTimeout(scheduleRef.current);
      if (unmountRef.current) clearTimeout(unmountRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return createPortal(
    <div className="fixed inset-x-0 top-[76px] z-[90] flex justify-center px-4 sm:top-[88px]">
      <div
        className={cn(
          "w-full max-w-[420px] overflow-hidden rounded-2xl bg-amber-100 p-[3px] shadow-[0px_12px_32px_-8px_rgba(0,0,0,0.2)]",
          closing ? "animate-leave" : "animate-enter",
        )}
      >
        <div className="flex items-start gap-3 rounded-[13px] bg-white p-4">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <InfoIcon />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-night-900">Stay Safe</p>
            <p className="mt-1 text-xs leading-5 text-gray-500">
              Social posts are not verified by our admin team. Be careful when buying, selling,
              renting, or making payments through information shared in social posts.
            </p>
          </div>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={dismiss}
            className="shrink-0 text-gray-400 hover:text-gray-600"
          >
            <CloseIcon />
          </button>
        </div>
        <p className="py-2 text-center text-[11px] text-gray-500">
          This message will automatically close in{" "}
          <span className="font-semibold text-amber-600">{secondsLeft} sec</span>
        </p>
      </div>
    </div>,
    document.body,
  );
}
