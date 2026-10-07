/** Desktop (sm+) dialog chrome shared by every modal — the two-layer "frosted" frame from the
 * Figma "Who can view?" panel (node 927:17826): a bordered, translucent outer shell that holds the
 * (slightly translucent white) panel. Apply to the dialog's relative wrapper (the element that also
 * holds the floating close button). The panel inside sets its own `sm:bg-white/90 sm:shadow-none sm:backdrop-blur-none`.
 * Mobile bottom sheets are unaffected — everything here is `sm:`-scoped. */
export const MODAL_FRAME =
  "sm:rounded-[26px] sm:border sm:border-[rgba(15,22,33,0.12)] sm:bg-white/10 sm:p-2.5 sm:shadow-[0px_24px_60px_-15px_rgba(0,0,0,0.15)] sm:backdrop-blur-[8px]";

