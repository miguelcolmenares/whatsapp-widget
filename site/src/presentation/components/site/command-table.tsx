/** A command, what it does, and an optional note shown on wide screens. */
export interface CommandRow {
  /** The command, in code. */
  command: string;
  /** What it does. */
  text: string;
  /** More detail, shown from the `lg` breakpoint up. */
  note?: string;
}

/** A two-column list of commands and what they do. */
export function CommandTable({
  rows,
}: {
  /** The commands, in the order shown. */
  rows: readonly CommandRow[];
}) {
  return (
    <ul className="grid grid-cols-1 overflow-hidden rounded-lg border border-border bg-surface md:grid-cols-2">
      {rows.map((row) => (
        <li
          key={row.command}
          className="flex items-baseline gap-4 border-b border-border px-4 py-3 last:border-b-0 md:[&:nth-child(odd)]:border-r md:[&:nth-last-child(-n+2)]:border-b-0"
        >
          <code className="shrink-0 font-mono text-sm text-brand">{row.command}</code>
          <span className="min-w-0 flex-1 text-sm text-fg">{row.text}</span>
          {row.note && <span className="hidden text-xs text-fg-dim lg:inline">{row.note}</span>}
        </li>
      ))}
    </ul>
  );
}
