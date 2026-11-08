/** One number of a stat row: the value, what it counts, and an optional note under it. */
export interface StatItem {
  /** The number, or any short text. A long one wraps inside its card. */
  value: string;
  /** What the value counts. */
  label: string;
  /** A line under the value, for the unit or the period. */
  note?: string;
}

/** The fewest and the most stats a row shows. */
export const STAT_LIMITS = { min: 2, max: 5 } as const;

/**
 * Explicit tracks for each count, written out in full so Tailwind sees every class.
 * One column on a phone, then the count that leaves no card alone on a row where it can.
 */
const TRACKS: Record<number, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 sm:grid-cols-3 lg:grid-cols-5",
};

/**
 * Two to five numbers with their labels, as a description list so a screen reader says the label
 * and its value together. The values come from props: the component fetches nothing.
 * It throws when the count is outside the limits, so a bad page fails the build with a clear message.
 */
export function StatRow({
  stats,
}: {
  /** Two to five items. A different count throws. */
  stats: readonly StatItem[];
}) {
  const tracks = TRACKS[stats.length];
  if (!tracks) {
    throw new Error(
      `StatRow takes ${STAT_LIMITS.min} to ${STAT_LIMITS.max} stats, got ${stats.length}.`,
    );
  }
  return (
    <dl className={`grid gap-4 ${tracks}`}>
      {stats.map((stat) => (
        <div
          key={`${stat.label}-${stat.value}`}
          className="min-w-0 rounded-lg border border-border bg-surface p-5"
        >
          <dt className="font-mono text-xs tracking-[0.14em] text-fg-muted uppercase">
            {stat.label}
          </dt>
          <dd className="mt-3 font-mono text-3xl font-semibold tracking-tight wrap-anywhere text-fg-bright">
            {stat.value}
          </dd>
          {stat.note && <dd className="mt-2 text-sm leading-relaxed text-fg-muted">{stat.note}</dd>}
        </div>
      ))}
    </dl>
  );
}
