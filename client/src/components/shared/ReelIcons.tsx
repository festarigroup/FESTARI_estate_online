interface IconProps {
  size?: number;
  className?: string;
}

const SAVE_PATH =
  "M5 4.6C5 3.84575 5 3.46863 5.23431 3.23431C5.46863 3 5.84575 3 6.6 3H17.4C18.1542 3 18.5314 3 18.7657 3.23431C19 3.46863 19 3.84575 19 4.6V19.4454C19 20.1263 19 20.4667 18.783 20.5784C18.5661 20.69 18.289 20.4922 17.735 20.0964L12.93 16.6643C12.4809 16.3435 12.2564 16.1831 12 16.1831C11.7436 16.1831 11.5191 16.3435 11.07 16.6643L6.26499 20.0964C5.71095 20.4922 5.43393 20.69 5.21697 20.5784C5 20.4667 5 20.1263 5 19.4454V4.6Z";

export function SaveIcon({ size = 20, className, saved }: IconProps & { saved: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d={SAVE_PATH} fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function RepostIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M7 7h8a3 3 0 0 1 3 3v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10 4 7 7l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 17H9a3 3 0 0 1-3-3v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14 20l3-3-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SpeakerIcon({ muted, size = 15 }: { muted: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 9v6h4l5 5V4L8 9H4Z" fill="currentColor" />
      <path
        d="M16.5 8.5a5 5 0 0 1 0 7M19 6a9 9 0 0 1 0 12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        opacity={muted ? 0.35 : 1}
      />
      {muted && <path d="M15.5 9.5l5 5m0-5l-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />}
    </svg>
  );
}

export function PlusIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M6 0.5V11.5M0.5 6H11.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className={className}>
      <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Figma node 792:38372 — plain white pause glyph, no container. */
export function PauseGlyph() {
  return (
    <svg width="37" height="37" viewBox="0 0 45.7332 45.7336" fill="none" aria-hidden="true">
      <path d="M10.1278 0.000220028H9.93889C8.38086 0.000178235 7.07198 0.000143124 6.01058 0.108117C4.89658 0.221441 3.84997 0.468954 2.90361 1.10129C2.19024 1.57795 1.57773 2.19046 1.10107 2.90383C0.468736 3.85019 0.221223 4.8968 0.107899 6.0108C-7.5267e-05 7.0722 -4.01562e-05 8.38101 1.6365e-06 9.93904V35.7947C-4.01562e-05 37.3527 -7.5267e-05 38.6616 0.107899 39.723C0.221223 40.837 0.468736 41.8836 1.10107 42.8299C1.57773 43.5433 2.19024 44.1558 2.90361 44.6325C3.84997 45.2648 4.89658 45.5123 6.01058 45.6257C7.072 45.7336 8.38083 45.7336 9.9389 45.7336H10.1278C11.6858 45.7336 12.9947 45.7336 14.0561 45.6257C15.1701 45.5123 16.2167 45.2648 17.1631 44.6325C17.8764 44.1558 18.4889 43.5433 18.9656 42.8299C19.5979 41.8836 19.8455 40.837 19.9588 39.723C20.0668 38.6616 20.0667 37.3527 20.0667 35.7947V9.93912C20.0667 8.38105 20.0668 7.07222 19.9588 6.0108C19.8455 4.8968 19.5979 3.85019 18.9656 2.90383C18.4889 2.19046 17.8764 1.57795 17.1631 1.10129C16.2167 0.468954 15.1701 0.221441 14.0561 0.108117C12.9947 0.000143124 11.6858 0.000178235 10.1278 0.000220028Z" fill="white" />
      <path d="M35.7943 1.54153e-06H35.6055C34.0474 -3.86155e-05 32.7385 -7.23464e-05 31.6771 0.1079C30.5631 0.221224 29.5165 0.468737 28.5702 1.10107C27.8568 1.57773 27.2443 2.19024 26.7676 2.90361C26.1353 3.84997 25.8878 4.89658 25.7745 6.01058C25.6665 7.07199 25.6665 8.3808 25.6666 9.93884V35.7944C25.6665 37.3525 25.6665 38.6614 25.7745 39.7228C25.8878 40.8368 26.1353 41.8834 26.7676 42.8297C27.2443 43.5431 27.8568 44.1556 28.5702 44.6323C29.5165 45.2646 30.5631 45.5121 31.6771 45.6254C32.7386 45.7334 34.0474 45.7334 35.6055 45.7333H35.7943C37.3524 45.7334 38.6612 45.7334 39.7227 45.6254C40.8367 45.5121 41.8833 45.2646 42.8296 44.6323C43.543 44.1556 44.1555 43.5431 44.6322 42.8297C45.2645 41.8834 45.512 40.8368 45.6253 39.7228C45.7333 38.6614 45.7333 37.3526 45.7332 35.7945V9.9389C45.7333 8.38088 45.7333 7.07198 45.6253 6.01058C45.512 4.89658 45.2645 3.84997 44.6322 2.90361C44.1555 2.19024 43.543 1.57773 42.8296 1.10107C41.8833 0.468737 40.8367 0.221224 39.7227 0.1079C38.6613 -7.23464e-05 37.3524 -3.86155e-05 35.7943 1.54153e-06Z" fill="white" />
    </svg>
  );
}

/** Figma node 792:38398 — plain white play glyph, no container. */
export function PlayGlyph() {
  return (
    <svg width="34" height="37" viewBox="0 0 39.5 42.2501" fill="none" aria-hidden="true">
      <path
        d="M38.6991 23.4515C37.7271 27.1448 33.1333 29.7546 23.9458 34.9742C15.0641 40.0201 10.6233 42.543 7.04454 41.5289C5.56495 41.1096 4.21687 40.3133 3.12967 39.2164C0.5 36.5633 0.5 31.4172 0.5 21.125C0.5 10.8329 0.5 5.68681 3.12967 3.03367C4.21687 1.93677 5.56495 1.14047 7.04454 0.721198C10.6233 -0.292924 15.0641 2.23 23.9458 7.27584C33.1333 12.4955 37.7271 15.1053 38.6991 18.7986C39.1003 20.3231 39.1003 21.927 38.6991 23.4515Z"
        fill="white"
        stroke="white"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeartGlyph({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="fill-like drop-shadow-[0_3px_8px_rgba(0,0,0,0.35)]">
      <path d="M12 21s-6.72-4.35-9.33-8.3C1.02 10.1 1.42 6.6 4.2 4.9c2.26-1.4 5.1-0.9 6.73 1.1L12 7.5l1.07-1.5c1.63-2 4.47-2.5 6.73-1.1 2.78 1.7 3.18 5.2 1.33 7.8C18.72 16.65 12 21 12 21z" />
    </svg>
  );
}
