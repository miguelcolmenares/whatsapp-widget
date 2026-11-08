/** One step of a flow: a phase label, a title, an optional detail and an optional command. */
export interface FlowStep {
  /** The phase, in mono capitals over the step. */
  label: string;
  /** The name of the step. */
  title: string;
  /** A short line under the title. */
  detail?: string;
  /** A command, in a mono pill under the step. */
  command?: string;
}

/** Steps in a row from `md` up, stacked below it. */
export function FlowDiagram({
  steps,
}: {
  /** The steps, in order. */
  steps: readonly FlowStep[];
}) {
  return (
    <ol className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-bg-subtle p-4 md:auto-cols-fr md:grid-flow-col md:p-6">
      {steps.map((step, index) => (
        <li
          key={`${step.label}-${step.title}`}
          className="relative flex flex-col items-center gap-2 text-center"
        >
          <span className="font-mono text-[10px] tracking-[0.16em] text-brand uppercase">
            {step.label}
          </span>
          <div className="w-full rounded-lg border border-border-strong bg-surface-2 px-3 py-3">
            <div className="font-semibold text-fg-bright">{step.title}</div>
            {step.detail && <div className="text-xs text-fg-dim">{step.detail}</div>}
          </div>
          {step.command && (
            <code className="rounded-full border border-border bg-surface px-2.5 py-0.5 font-mono text-[11px] text-fg-muted">
              {step.command}
            </code>
          )}
          {index < steps.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute top-1/2 -right-3 hidden h-px w-3 bg-border-strong md:block"
            />
          )}
        </li>
      ))}
    </ol>
  );
}
