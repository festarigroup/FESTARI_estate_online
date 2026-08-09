"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { cn } from "@/lib/cn";
import type { GalleryImage } from "@/types/home";

interface PostImageLightboxProps {
  images: GalleryImage[];
  initialIndex: number;
  onClose: () => void;
}

/** Full-screen viewer for a post's photo(s) — click any post image to open it
 * at full size, arrow through the rest if there's more than one. Not a Figma
 * frame (the design only shows the cropped feed thumbnails); built
 * Instagram/Facebook-style to match the story viewer's conventions. */
export function PostImageLightbox({ images, initialIndex, onClose }: PostImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const image = images[index];
  const hasMultiple = images.length > 1;

  function goNext() {
    setIndex((i) => (i + 1) % images.length);
  }

  function goPrev() {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4">
      <button aria-label="Close image viewer" onClick={onClose} className="fixed inset-0" />

      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute top-4 right-4 z-20 text-white/80 hover:text-white"
      >
        <DynamicIcon name="X" className="size-6" />
      </button>

      {hasMultiple && (
        <span className="absolute top-4 left-4 z-20 rounded bg-black/60 px-2.5 py-1 text-sm text-white">
          {index + 1}/{images.length}
        </span>
      )}

      <div className="relative flex h-full max-h-[85vh] w-full max-w-4xl items-center justify-center">
        {hasMultiple && (
          <button
            aria-label="Previous image"
            onClick={goPrev}
            className="absolute left-0 z-20 flex size-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 sm:-left-4"
          >
            <DynamicIcon name="ChevronLeft" className="size-5" />
          </button>
        )}

        {image.type === "video" ? (
          <video
            key={image.src}
            src={image.src}
            controls
            autoPlay
            playsInline
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- full-bleed lightbox has no fixed box for next/image to optimize toward, and sources may be blob: previews it can't fetch anyway
          <img src={image.src} alt={image.alt} className="max-h-full max-w-full object-contain" />
        )}

        {hasMultiple && (
          <button
            aria-label="Next image"
            onClick={goNext}
            className="absolute right-0 z-20 flex size-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 sm:-right-4"
          >
            <DynamicIcon name="ChevronRight" className="size-5" />
          </button>
        )}
      </div>

      {hasMultiple && (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
          {images.map((img, i) => (
            <button
              key={img.src}
              aria-label={`Go to image ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn("size-1.5 rounded-full", i === index ? "bg-white" : "bg-white/40")}
            />
          ))}
        </div>
      )}
    </div>,
    document.body,
  );
}
