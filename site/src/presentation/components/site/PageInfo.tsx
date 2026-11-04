import { Pencil } from "lucide-react";

/** The day a page last changed: a machine-readable value for `datetime` and the text a reader sees. */
export interface PageUpdated {
  /** The value of the `datetime` attribute, for example `2026-10-28`. */
  datetime: string;
  /** The date as a reader sees it. */
  text: string;
}

/**
 * The line at the foot of a page: a link to edit its source file and the date it last changed.
 * Each part shows only when it is given, and the whole line is left out when neither is.
 * The link is a 44px target, and the date is a `<time>` element.
 */
export function PageInfo({
  editUrl,
  updated,
}: {
  /** The address of the source file on the repository host. Without it the link is left out. */
  editUrl?: string;
  /** The day of the last change. Without it the date is left out. */
  updated?: PageUpdated;
}) {
  if (!editUrl && !updated) return null;
  return (
    <div className="mt-12 flex flex-col gap-x-6 sm:flex-row sm:items-center sm:justify-between">
      {editUrl ? (
        <a
          href={editUrl}
          className="inline-flex min-h-11 items-center gap-2 text-sm text-fg-muted underline underline-offset-4 hover:text-fg-bright"
        >
          <Pencil className="size-3.5" aria-hidden="true" />
          Edit this page
        </a>
      ) : (
        <span />
      )}
      {updated && (
        <p className="min-h-11 content-center text-sm text-fg-muted">
          Last updated <time dateTime={updated.datetime}>{updated.text}</time>
        </p>
      )}
    </div>
  );
}
