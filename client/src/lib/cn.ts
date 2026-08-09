import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class strings, resolving conflicts (e.g. `p-2` vs `p-4`)
 * the way the last one wins, while still supporting conditional clsx syntax.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
