import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/infrastructure/cn";

/** A copyable shell command. Shows the text without JavaScript and copies once it hydrates. */
export function CommandBox({
  command,
  label,
  className,
}: {
  /**
   * The command, shown and copied as it is.
   */
  command: string;
  /** The accessible name of the copy button. Without it the name is "Copy command: " and the command. */
  label?: string;
  /**
   * Classes added to the box.
   */
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard access can be refused. The command stays selectable on the page.
    }
  }

  return (
    <div
      className={cn(
        "flex w-full max-w-xl items-center gap-3 rounded-lg border border-border bg-surface/80 py-2 pr-2 pl-4",
        className,
      )}
    >
      <span aria-hidden="true" className="font-mono text-sm text-brand">
        $
      </span>
      <code
        tabIndex={0}
        className="min-w-0 flex-1 overflow-x-auto text-left font-mono text-sm whitespace-nowrap text-fg [scrollbar-width:none]"
      >
        {command}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label={label ?? `Copy command: ${command}`}
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-surface-3 hover:text-fg-bright"
      >
        {copied ? (
          <Check className="size-4 text-brand" aria-hidden="true" />
        ) : (
          <Copy className="size-4" aria-hidden="true" />
        )}
        <span className="sr-only" aria-live="polite">
          {copied ? "Copied" : ""}
        </span>
      </button>
    </div>
  );
}
