/** The five kinds of callout a blockquote can become, in the order the documentation lists them. */
export const CALLOUT_KINDS = ["note", "tip", "important", "warning", "caution"] as const;

/** One of the five callout kinds. */
export type CalloutKind = (typeof CALLOUT_KINDS)[number];

/** The visible label of each kind, so the tone is never carried by color alone. */
export const CALLOUT_LABELS: Readonly<Record<CalloutKind, string>> = {
  note: "Note",
  tip: "Tip",
  important: "Important",
  warning: "Warning",
  caution: "Caution",
};

/** What a paragraph that opens with a callout marker is made of. */
export interface CalloutMarker {
  kind: CalloutKind;
  /** The text of the paragraph after the marker line. It can be empty. */
  rest: string;
}

const MARKER = /^\[!([A-Za-z]+)\][ \t]*(?:\r?\n|$)/;

/**
 * Read the callout marker at the start of a blockquote's first text: `[!NOTE]` alone on its line, the
 * way GitHub writes an alert. The name is not case sensitive. A marker with text after it on the same line,
 * or a name that is not one of the five kinds, is not a marker, so that blockquote stays a plain one.
 */
export function parseCalloutMarker(text: string): CalloutMarker | null {
  const match = MARKER.exec(text);
  if (!match) return null;
  const kind = match[1]!.toLowerCase();
  if (!(CALLOUT_KINDS as readonly string[]).includes(kind)) return null;
  return { kind: kind as CalloutKind, rest: text.slice(match[0].length) };
}

/**
 * The name in a marker line that looks like a callout marker but is not one of the five kinds,
 * for example `[!NOTES]`. Returns null for a known name and for text that is not a marker line.
 * That blockquote stays a plain one, so the author should hear about it.
 */
export function unknownCalloutMarker(text: string): string | null {
  const match = MARKER.exec(text);
  if (!match) return null;
  return (CALLOUT_KINDS as readonly string[]).includes(match[1]!.toLowerCase()) ? null : match[1]!;
}
