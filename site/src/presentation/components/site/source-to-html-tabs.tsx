import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { cn } from "@/infrastructure/cn";

/** The two views of a sample: the page it builds, and the HTML it writes. */
const VIEWS = [
  { id: "preview", label: "Preview" },
  { id: "html", label: "HTML" },
] as const;
type View = (typeof VIEWS)[number]["id"];

/**
 * The buttons of `SourceToHtml`: one for each sample, and the Preview and HTML tabs. The panels are in the HTML from the
 * start, so the page reads without this island. It only chooses: it marks the panels of the chosen sample and view with
 * `data-active`, and the style of `SourceToHtml` shows those and hides the rest. It loads when it is visible.
 */
export function SourceToHtmlTabs({
  labels,
  scope = "source-to-html",
}: {
  /** The name of each sample, in the order of the panels. Two to four. */
  labels: readonly string[];
  /** The start of the ids of the tabs and the panels. It must be the one that `SourceToHtml` was given. */
  scope?: string;
}) {
  const [sample, setSample] = useState(0);
  const [view, setView] = useState<View>("preview");
  const bar = useRef<HTMLDivElement>(null);
  const tabs = useRef<Record<View, HTMLButtonElement | null>>({ preview: null, html: null });

  useEffect(() => {
    const root = bar.current?.closest<HTMLElement>("[data-source-to-html]");
    if (!root) return;
    root.querySelectorAll<HTMLElement>("[data-st-panel]").forEach((panel) => {
      const kind = panel.dataset.stPanel;
      const shown = panel.dataset.sample === String(sample) && (kind === "source" || kind === view);
      if (shown) panel.setAttribute("data-active", "");
      else panel.removeAttribute("data-active");
    });
  }, [sample, view]);

  // The arrow keys, Home and End move between the two tabs, as the tabs pattern asks, and the focus follows.
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = VIEWS.findIndex((item) => item.id === view);
    const next = {
      ArrowRight: (index + 1) % VIEWS.length,
      ArrowDown: (index + 1) % VIEWS.length,
      ArrowLeft: (index + VIEWS.length - 1) % VIEWS.length,
      ArrowUp: (index + VIEWS.length - 1) % VIEWS.length,
      Home: 0,
      End: VIEWS.length - 1,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    const target = VIEWS[next]!.id;
    setView(target);
    tabs.current[target]?.focus();
  }

  return (
    <div ref={bar} data-st-bar className="flex flex-wrap items-center justify-between gap-3">
      <div role="group" aria-label="Sample" className="flex flex-wrap gap-2">
        {labels.map((label, index) => (
          <button
            key={`${index}-${label}`}
            type="button"
            aria-pressed={index === sample}
            onClick={() => setSample(index)}
            className={cn(
              "inline-flex min-h-11 items-center rounded-md border px-3 font-mono text-sm transition-colors",
              index === sample
                ? "border-brand bg-surface-2 text-fg-bright"
                : "border-border text-fg-muted hover:text-fg-bright",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div
        role="tablist"
        aria-label="View"
        onKeyDown={onKeyDown}
        className="inline-flex rounded-md border border-border p-1"
      >
        {VIEWS.map((item) => {
          const selected = item.id === view;
          return (
            <button
              key={item.id}
              ref={(node) => {
                tabs.current[item.id] = node;
              }}
              type="button"
              role="tab"
              id={`${scope}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${scope}-panel-${sample}-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setView(item.id)}
              className={cn(
                "inline-flex min-h-11 items-center rounded-sm px-4 text-sm transition-colors",
                selected ? "bg-surface-2 text-fg-bright" : "text-fg-muted hover:text-fg-bright",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
