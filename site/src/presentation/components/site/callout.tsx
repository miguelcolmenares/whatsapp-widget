import { Info, Lightbulb, MessageSquareWarning, OctagonAlert, TriangleAlert } from "lucide-react";
import { cn } from "@/infrastructure/cn";

/**
 * The five kinds, with the tone each one takes. The callouts written as `> [!NOTE]` in markdown use
 * the same icons, labels and tones (see `prose.css`), so a page looks the same either way.
 */
const kinds = {
  note: { icon: Info, label: "Note", tone: "text-brand", edge: "border-l-brand" },
  tip: { icon: Lightbulb, label: "Tip", tone: "text-success", edge: "border-l-success" },
  important: {
    icon: MessageSquareWarning,
    label: "Important",
    tone: "text-fg-bright",
    edge: "border-l-fg-bright",
  },
  warning: { icon: TriangleAlert, label: "Warning", tone: "text-warn", edge: "border-l-warn" },
  caution: {
    icon: OctagonAlert,
    label: "Caution",
    tone: "text-destructive",
    edge: "border-l-destructive",
  },
} as const;

/** A highlighted note, tip, important point, warning or caution inside a page. It is a note, not an alert. */
export function Callout({
  kind = "note",
  title,
  children,
  className,
}: {
  /**
   * Which of the five: note, tip, important, warning or caution. It sets the icon, the label and the tone.
   *
   * @defaultValue "note"
   */
  kind?: keyof typeof kinds;
  /**
   * A title that replaces the name of the kind.
   */
  title?: string;
  /**
   * The text of the callout.
   */
  children: React.ReactNode;
  /**
   * Classes added to the callout.
   */
  className?: string;
}) {
  const { icon: IconComponent, label, tone, edge } = kinds[kind];
  return (
    <aside
      role="note"
      data-callout={kind}
      className={cn(
        "flex gap-3 rounded-lg border border-l-[3px] border-border bg-bg-subtle px-4 py-3.5",
        edge,
        className,
      )}
    >
      <IconComponent className={cn("mt-0.5 size-4 shrink-0", tone)} aria-hidden="true" />
      <div className="min-w-0 text-sm leading-relaxed text-fg">
        <span className={cn("mr-2 font-mono text-[11px] tracking-[0.14em] uppercase", tone)}>
          {title ?? label}
        </span>
        {children}
      </div>
    </aside>
  );
}
