"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function toIso(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatDisplay(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#be4d00]">
      <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 9.5h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type DatePickerFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minDate?: string;
};

export default function DatePickerField({
  label,
  value,
  onChange,
  placeholder = "Select date",
  minDate,
}: DatePickerFieldProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const reference = value ? new Date(`${value}T00:00:00`) : new Date();
  const [viewYear, setViewYear] = useState(reference.getFullYear());
  const [viewMonth, setViewMonth] = useState(reference.getMonth());

  useEffect(() => {
    if (!open) return;

    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const startWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const now = new Date();
  const todayIso = toIso(now.getFullYear(), now.getMonth(), now.getDate());

  const cells: Array<{ day: number; iso: string } | null> = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push({ day, iso: toIso(viewYear, viewMonth, day) });

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.7px] text-[#717974]">{label}</span>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center justify-between gap-2 rounded-xl border bg-[#f8fafc] px-3 py-3 text-left text-sm transition-colors ${
          open ? "border-[#be4d00] bg-white ring-2 ring-[#be4d00]/15" : "border-[#c0c8c3] hover:border-[#be4d00]/50"
        }`}
      >
        <span className={value ? "text-[#0f1621]" : "text-[#a3a3a3]"}>{value ? formatDisplay(value) : placeholder}</span>
        <CalendarIcon />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-[calc(100%+8px)] z-50 w-[280px] rounded-2xl border border-[#e5e2e1] bg-white p-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3">
              <button
                type="button"
                onClick={goToPrevMonth}
                aria-label="Previous month"
                className="flex size-7 items-center justify-center rounded-full text-[#414944] transition-colors hover:bg-[#f6f3f2]"
              >
                <ChevronIcon direction="left" />
              </button>
              <p className="text-sm font-semibold text-[#00261b]">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </p>
              <button
                type="button"
                onClick={goToNextMonth}
                aria-label="Next month"
                className="flex size-7 items-center justify-center rounded-full text-[#414944] transition-colors hover:bg-[#f6f3f2]"
              >
                <ChevronIcon direction="right" />
              </button>
            </div>

            <div className="grid grid-cols-7 pb-1 text-center text-[11px] font-semibold uppercase text-[#a3a3a3]">
              {WEEKDAYS.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1">
              {cells.map((cell, index) => {
                if (!cell) return <span key={index} />;
                const isSelected = cell.iso === value;
                const isToday = cell.iso === todayIso;
                const isDisabled = Boolean(minDate) && cell.iso < (minDate as string);

                return (
                  <button
                    key={cell.iso}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                      onChange(cell.iso);
                      setOpen(false);
                    }}
                    className={`mx-auto flex size-9 items-center justify-center rounded-full text-sm transition-colors ${
                      isSelected
                        ? "bg-[#be4d00] font-semibold text-white"
                        : isDisabled
                          ? "cursor-not-allowed text-[#d8d8d8]"
                          : isToday
                            ? "font-semibold text-[#be4d00] hover:bg-[#f6f3f2]"
                            : "text-[#0f1621] hover:bg-[#f6f3f2]"
                    }`}
                  >
                    {cell.day}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
