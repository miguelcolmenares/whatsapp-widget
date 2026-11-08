import { cn } from "@/infrastructure/cn";

/** A mono eyebrow, a heading and a lede, with room for an action on the right. */
export function SectionHeader({
  eyebrow,
  title,
  lede,
  className,
  children,
  as: Heading = "h2",
}: {
  /**
   * The heading element. Use "h1" for the heading that names the page.
   *
   * @defaultValue "h2"
   */
  as?: "h1" | "h2";
  /**
   * A short line in mono type over the heading.
   */
  eyebrow?: string;
  /**
   * The heading.
   */
  title: string;
  /**
   * A sentence under the heading.
   */
  lede?: React.ReactNode;
  /**
   * Classes added to the wrapper.
   */
  className?: string;
  /**
   * An action, shown on the right of the text, or under it on a phone.
   */
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("mb-10 flex flex-wrap items-end justify-between gap-6", className)}>
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-3 font-mono text-xs tracking-[0.14em] text-fg-dim uppercase">
            {eyebrow}
          </p>
        )}
        <Heading className="text-balance text-[clamp(1.75rem,4vw,2.6rem)] leading-[1.1] font-semibold tracking-[-0.03em] text-fg-bright">
          {title}
        </Heading>
        {lede && <p className="mt-4 text-pretty text-lg leading-relaxed text-fg-muted">{lede}</p>}
      </div>
      {children}
    </div>
  );
}
