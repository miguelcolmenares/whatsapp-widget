import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/infrastructure/cn";

const tone = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] leading-5 whitespace-nowrap",
  {
    variants: {
      tone: {
        neutral: "border-border-strong bg-surface-2 text-fg-muted",
        brand: "border-brand/30 bg-brand/10 text-brand",
        success: "border-success/30 bg-success/10 text-success",
        warn: "border-warn/30 bg-warn/10 text-warn",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

const dot: Record<NonNullable<VariantProps<typeof tone>["tone"]>, string> = {
  neutral: "bg-fg-dim",
  brand: "bg-brand",
  success: "bg-success",
  warn: "bg-warn",
};

/** The four tones a badge can have. */
export type Tone = NonNullable<VariantProps<typeof tone>["tone"]>;

/** The only way to show a tone. Components never pick status colors on their own. */
export function ToneBadge({
  tone: value = "neutral",
  dot: withDot = false,
  className,
  children,
}: {
  /**
   * The color of the badge.
   *
   * @defaultValue "neutral"
   */
  tone?: Tone;
  /**
   * Show a dot before the text. The dot is hidden from assistive technology.
   *
   * @defaultValue false
   */
  dot?: boolean;
  /**
   * Classes added to the badge.
   */
  className?: string;
  /**
   * The text of the badge. It always says the status in words, so the color is not the only cue.
   */
  children: React.ReactNode;
}) {
  return (
    <span className={cn(tone({ tone: value }), className)}>
      {withDot && <span aria-hidden="true" className={cn("size-1.5 rounded-full", dot[value])} />}
      {children}
    </span>
  );
}
