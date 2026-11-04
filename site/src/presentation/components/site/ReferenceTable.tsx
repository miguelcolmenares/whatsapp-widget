/** One row of a reference: a name, its type, its default, and what it does. */
export interface ReferenceRow {
  /** The name, written in code: a config key, an option, a flag. */
  name: string;
  /** The type, as a short text. */
  type: string;
  /** The default, or a word such as `required`. Optional, a row without one shows a dash. */
  default?: string;
  /** The values the name accepts. Optional, a row without them shows a dash. */
  allowed?: string;
  /** What the name does. */
  text: string;
}

/**
 * A table for a reference: a column of code names, a type, a default, the values allowed and a text.
 * The table scrolls sideways inside its own wrapper on a narrow screen, and the wrapper takes the
 * keyboard focus (`tabindex="0"` in the HTML, so it works without JavaScript) with a name for
 * assistive technology, so a keyboard user can scroll it. The first cell of each row is its row header.
 */
export function ReferenceTable({
  label,
  rows,
}: {
  /** What the table lists, for example `Keys of the search group`. It names the scrollable region. */
  label: string;
  /** The rows, in the order shown. */
  rows: readonly ReferenceRow[];
}) {
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className="overflow-x-auto rounded-lg border border-border bg-surface"
    >
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
        <caption className="sr-only">{label}</caption>
        <thead>
          <tr className="border-b border-border">
            {["Key", "Type", "Default", "Allowed values", "Description"].map((heading) => (
              <th
                key={heading}
                scope="col"
                className="px-4 py-3 font-mono text-xs font-medium tracking-[0.1em] whitespace-nowrap text-fg-muted uppercase"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-b border-border align-top last:border-b-0">
              <th scope="row" className="px-4 py-3 text-left font-normal">
                <code className="font-mono text-sm whitespace-nowrap text-brand">{row.name}</code>
              </th>
              <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-fg-muted">
                {row.type}
              </td>
              <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-fg-muted">
                {row.default ?? "-"}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-fg-muted">{row.allowed ?? "-"}</td>
              <td className="min-w-64 px-4 py-3 text-fg">{row.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
