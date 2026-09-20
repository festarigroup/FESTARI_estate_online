"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const NAV_ROWS = [
  ["Properties", "People", "Projects", "Services"],
  ["Community", "And more"],
];

const THUMB_INSET = 8;
const CONFIRM_THRESHOLD = 0.85;

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10M8.5 3.5 13 8l-4.5 4.5"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronsRightIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2.00012 6L8.00037 12.0002L1.99658 18.004M8.99963 6L14.9999 12.0002L8.99609 18.004M15.9996 6L21.9999 12.0002L15.9961 18.004"
        className="stroke-[#CBD5E0] dark:stroke-night-700"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface SlideToStartProps {
  onConfirm: () => void;
}

function SlideToStart({ onConfirm }: SlideToStartProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef(0);

  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [maxDrag, setMaxDrag] = useState(0);

  useEffect(() => {
    function updateMaxDrag() {
      if (!trackRef.current || !thumbRef.current) return;
      setMaxDrag(trackRef.current.offsetWidth - thumbRef.current.offsetWidth - THUMB_INSET * 2);
    }
    updateMaxDrag();
    window.addEventListener("resize", updateMaxDrag);
    return () => window.removeEventListener("resize", updateMaxDrag);
  }, []);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    dragStartRef.current = event.clientX - dragX;
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging) return;
    const next = event.clientX - dragStartRef.current;
    setDragX(Math.min(Math.max(next, 0), maxDrag));
  }

  function handlePointerUp() {
    if (!isDragging) return;
    setIsDragging(false);
    if (maxDrag > 0 && dragX >= maxDrag * CONFIRM_THRESHOLD) {
      setDragX(maxDrag);
      window.setTimeout(onConfirm, 150);
    } else {
      setDragX(0);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setDragX(maxDrag);
      window.setTimeout(onConfirm, 150);
    }
  }

  return (
    <div
      ref={trackRef}
      className="relative flex h-16 shrink-0 items-center rounded-full border border-muted-300 bg-[#f1f5f9] p-2 dark:border-night-700 dark:bg-night-800"
    >
      <div className="flex w-full items-center justify-between pl-14 pr-2">
        <span className="font-display text-lg font-medium tracking-[-0.44px] text-muted-300 dark:text-night-700">
          Get Started
        </span>
        <ChevronsRightIcon />
      </div>
      <div
        ref={thumbRef}
        role="button"
        tabIndex={0}
        aria-label="Slide to get started"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        style={{ transform: `translateX(${dragX}px)` }}
        className={`absolute left-2 flex size-12 cursor-grab touch-none items-center justify-center rounded-full bg-brand-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-900 focus-visible:ring-offset-2 active:cursor-grabbing ${
          isDragging ? "" : "transition-transform duration-200 ease-out"
        }`}
      >
        <ArrowRightIcon />
      </div>
    </div>
  );
}

interface SplashScreenProps {
  onGetStarted: () => void;
}

export function SplashScreen({ onGetStarted }: SplashScreenProps) {
  return (
    <div className="flex h-screen w-full flex-col gap-3 bg-white p-4 dark:bg-night-900">
      <div className="relative flex flex-1 flex-col overflow-hidden rounded-[38px] bg-gradient-to-r from-brand-gradient-from to-brand-gradient-to px-6 pb-8 pt-8">
        <Image src="/brand/hero-illustration.png" alt="Biltlinx" width={80} height={40} priority />

        <div className="flex flex-1 flex-col justify-end gap-3 pb-10">
          <h1 className="font-display text-[40px] font-semibold leading-[1.05] tracking-[-0.94px] text-white">
            <span className="text-[#cfdddd]">Connecting</span> the Built Environment
          </h1>
          <p className="max-w-[280px] text-[13px] leading-[1.23] tracking-[-0.39px] text-[#f8fafc]">
            Where people, places, and possibilities come together.
          </p>
        </div>

        <nav aria-label="Site sections" className="flex flex-col items-center gap-2 pb-2">
          {NAV_ROWS.map((row) => (
            <div key={row.join("-")} className="flex flex-wrap items-center justify-center gap-2">
              {row.map((link, index) => (
                <div key={link} className="flex items-center gap-2">
                  {index > 0 && <span className="h-2 w-px rounded-full bg-[#cdced2]" />}
                  <span className="whitespace-nowrap font-display text-sm font-semibold tracking-[-1.12px] text-white">
                    {link}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </nav>
      </div>

      <SlideToStart onConfirm={onGetStarted} />
    </div>
  );
}
