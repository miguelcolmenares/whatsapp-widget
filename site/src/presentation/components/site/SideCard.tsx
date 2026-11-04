import { ChevronDown } from "lucide-react";

/** One line of the card: a label and its value. */
export interface SideCardRow {
  /** The name of the row, in mono capitals. */
  label: string;
  /** The value. A long one, such as a hash or an address, wraps. */
  value: string;
}

/** A link of the card. */
export interface SideCardLink {
  /** The text of the link. */
  label: string;
  /** Where it leads. */
  href: string;
}

/** How many rows a phone shows before the visitor expands the card. */
export const SIDE_CARD_VISIBLE_ROWS = 3;

/** True when a phone has something to expand: more rows than it shows, or links, or tags. */
export function sideCardHasMore(card: {
  rows: readonly SideCardRow[];
  links: readonly SideCardLink[];
  tags: readonly string[];
}): boolean {
  return card.rows.length > SIDE_CARD_VISIBLE_ROWS || card.links.length > 0 || card.tags.length > 0;
}

/**
 * The card beside the text of a detail page: version, license, links, tags. The metadata is a description list, so
 * a screen reader says each label with its value, and a long value (a hash, an address) wraps. It takes its data
 * from props and imports no content.
 *
 * On a phone it sits above the text, and once the page's script has run it shows its first rows and a button that
 * expands the rest. The script is `presentation/sideCard/sideCard.ts`, and it sets `data-js` on the card. Without it
 * the whole card is shown and the button never appears. From the `lg` width the card is always complete and sticks
 * to the top while the text scrolls, if its parent is as tall as the text.
 */
export function SideCard({
  rows,
  links = [],
  tags = [],
  label = "Details",
  className = "",
}: {
  /** The metadata, one label and value for each line. */
  rows: readonly SideCardRow[];
  /** Links, under the rows. */
  links?: readonly SideCardLink[];
  /** Tags, under the links. */
  tags?: readonly string[];
  /**
   * The accessible name of the card.
   *
   * @defaultValue "Details"
   */
  label?: string;
  /** Classes added to the card. */
  className?: string;
}) {
  const more = sideCardHasMore({ rows, links, tags });
  return (
    <aside
      aria-label={label}
      data-side-card
      className={`min-w-0 rounded-lg border border-border bg-surface p-5 lg:sticky lg:top-24 lg:self-start max-lg:[&[data-js]:not([data-expanded])_[data-extra]]:hidden ${className}`.trim()}
    >
      {rows.length > 0 && (
        <dl className="space-y-4">
          {rows.map((row, index) => (
            <div
              key={`${row.label}-${row.value}`}
              data-extra={index >= SIDE_CARD_VISIBLE_ROWS ? "" : undefined}
              className="min-w-0"
            >
              <dt className="font-mono text-xs tracking-[0.14em] text-fg-muted uppercase">
                {row.label}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed wrap-anywhere text-fg-bright">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {links.length > 0 && (
        <ul
          data-extra
          aria-label="Links"
          className={rows.length > 0 ? "mt-5 space-y-1" : "space-y-1"}
        >
          {links.map((link) => (
            <li key={`${link.label}-${link.href}`}>
              <a
                href={link.href}
                className="inline-flex min-h-11 max-w-full items-center text-sm font-medium wrap-anywhere text-brand underline decoration-brand/40 underline-offset-[3px] hover:decoration-current"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
      {tags.length > 0 && (
        <ul
          data-extra
          aria-label="Tags"
          className={`flex flex-wrap gap-2 ${rows.length > 0 || links.length > 0 ? "mt-5" : ""}`.trim()}
        >
          {tags.map((tag) => (
            <li
              key={tag}
              className="max-w-full rounded-md border border-border-strong bg-surface-2 px-2 py-0.5 font-mono text-xs wrap-anywhere text-fg-muted"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
      {more && (
        <button
          type="button"
          data-side-card-toggle
          hidden
          aria-expanded="false"
          className="group/toggle mt-4 inline-flex min-h-11 w-full items-center justify-between gap-2 rounded-md border border-border-strong bg-background px-4 py-2 text-sm text-fg-bright transition-colors hover:bg-surface-2 lg:hidden"
        >
          All details
          <ChevronDown
            aria-hidden="true"
            className="size-4 transition-transform duration-200 group-aria-expanded/toggle:rotate-180"
          />
        </button>
      )}
    </aside>
  );
}
