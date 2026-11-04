import { ArrowRight } from "lucide-react";
import { cn } from "@/infrastructure/cn";
import { ToneBadge } from "./ToneBadge";
import type { Tone } from "./ToneBadge";

/**
 * A link card for a catalog: an optional badge, a mono title, a description and a hint. Any other attribute of
 * a link, such as a `data-` attribute that a script reads, goes to the link.
 */
export function ItemCard({
  href,
  title,
  description,
  badge,
  tone = "neutral",
  hint,
  className,
  ...rest
}: Omit<React.ComponentProps<"a">, "children" | "title"> & {
  /**
   * Where the card leads. The whole card is the link.
   */
  href: string;
  /**
   * The title, in mono type.
   */
  title: string;
  /**
   * A sentence under the title. An empty text leaves the paragraph out.
   */
  description: string;
  /**
   * The text of a badge over the title.
   */
  badge?: string;
  /**
   * The tone of the badge.
   *
   * @defaultValue "neutral"
   */
  tone?: Tone;
  /**
   * A short text at the foot of the card, before the arrow.
   */
  hint?: string;
}) {
  return (
    <a
      {...rest}
      href={href}
      className={cn(
        "group flex h-full flex-col rounded-lg border border-border bg-surface p-5 transition-colors duration-200 hover:border-border-hover hover:bg-surface-2",
        className,
      )}
    >
      {badge && (
        <div className="mb-4">
          <ToneBadge tone={tone} dot>
            {badge}
          </ToneBadge>
        </div>
      )}
      <h3 className="font-mono text-[15px] font-medium tracking-tight text-fg-bright">{title}</h3>
      {description && <p className="mt-2 text-sm leading-relaxed text-fg-muted">{description}</p>}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4 text-xs text-fg-dim">
        <span>{hint}</span>
        <ArrowRight
          className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>
    </a>
  );
}

/** Explicit tracks at each breakpoint, never `auto-fit`, so columns line up and never orphan. */
export function CardGrid({
  children,
  className,
}: {
  /** The cards of the grid. */
  children: React.ReactNode;
  /** Classes added to the grid. */
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3", className)}>
      {children}
    </div>
  );
}
