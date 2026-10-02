"use client";

import { useState } from "react";

/** Per-URL loaded/failed/retry tracking for an `<Image>` — shared by the post
 * carousel and its lightbox. Spread `imageProps` onto the `<Image>` (with
 * `key={retryKey}`) and use `failed`/`loaded` for the error and skeleton states. */
export function useMediaLoadState(url: string) {
  const [failedUrls, setFailedUrls] = useState<Set<string>>(new Set());
  const [loadedUrls, setLoadedUrls] = useState<Set<string>>(new Set());
  const [retryKey, setRetryKey] = useState(0);

  function retry() {
    setFailedUrls((prev) => {
      const next = new Set(prev);
      next.delete(url);
      return next;
    });
    setRetryKey((tick) => tick + 1);
  }

  return {
    failed: failedUrls.has(url),
    loaded: loadedUrls.has(url),
    retryKey,
    retry,
    imageProps: {
      onLoad: () => setLoadedUrls((prev) => new Set(prev).add(url)),
      onError: () => setFailedUrls((prev) => new Set(prev).add(url)),
    },
  };
}
