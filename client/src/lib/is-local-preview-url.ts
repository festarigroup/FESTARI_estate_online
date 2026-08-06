/**
 * True for `blob:`/`data:` URLs produced by `URL.createObjectURL` or a
 * `FileReader` — i.e. a locally-picked file being previewed before upload.
 * next/image's optimizer can't fetch these, so callers should fall back to a
 * plain `<img>` when this returns true.
 */
export function isLocalPreviewUrl(src: string): boolean {
  return src.startsWith("blob:") || src.startsWith("data:");
}
