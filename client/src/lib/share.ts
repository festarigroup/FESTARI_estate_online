import toast from "react-hot-toast";

interface ShareContent {
  title: string;
  text?: string;
  /** Path this share links back to, e.g. `#post-7`; resolved against the current origin. */
  path: string;
}

/** Native share sheet where supported, clipboard-copy fallback otherwise. */
export async function shareContent({ title, text, path }: ShareContent) {
  const url = typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}${path}` : "";
  const shareData = { title, text: text ?? "Check out this post on Biltlinx", url };

  try {
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share(shareData);
      return;
    }
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return;
    toast.error("Couldn't share this post");
  }
}
