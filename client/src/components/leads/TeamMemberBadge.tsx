import { cn } from "@/lib/cn";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

/** Small initials badge for an assignee — team members here are stub
 * names with no photos (see TEAM_MEMBERS), so this stands in for Avatar
 * (which is photo-first) rather than forcing a fallback icon that reads
 * as "no owner" for every single one. */
export function TeamMemberBadge({ name, size = 24 }: { name: string | null; size?: number }) {
  return (
    <span
      title={name ?? "Unassigned"}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold",
        name ? "bg-brand-navy text-white" : "border border-dashed border-border-subtle text-muted",
      )}
    >
      {name ? initials(name) : "–"}
    </span>
  );
}
