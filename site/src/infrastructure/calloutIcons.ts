import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Info, Lightbulb, MessageSquareWarning, OctagonAlert, TriangleAlert } from "lucide-react";
import type { CalloutKind } from "../domain";

/** An element of a hast tree, the HTML tree that remark hands to the renderer. */
export interface IconElement {
  type: "element";
  tagName: string;
  properties: Record<string, string>;
  children: IconElement[];
}

const ICONS = {
  note: Info,
  tip: Lightbulb,
  important: MessageSquareWarning,
  warning: TriangleAlert,
  caution: OctagonAlert,
} as const;

const TAG = /<(\/?)([a-z][a-z0-9]*)((?:\s+[a-zA-Z-]+="[^"]*")*)\s*(\/?)>/g;
const ATTRIBUTE = /([a-zA-Z-]+)="([^"]*)"/g;
const SKIPPED = new Set(["xmlns", "class", "aria-hidden"]);

const camelCase = (name: string) =>
  name.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());

/**
 * Turn the SVG that lucide renders into a hast element. Its output is plain: tags with quoted
 * attributes and no text, so a small reader is enough. The size is fixed at 16, the size of the
 * icon in the `Callout` component, and the page style does the rest.
 */
function parseSvg(markup: string): IconElement {
  const root: IconElement = { type: "element", tagName: "root", properties: {}, children: [] };
  const stack = [root];
  for (const match of markup.matchAll(TAG)) {
    const [, closing, tagName, attributes, selfClosing] = match;
    if (closing) {
      stack.pop();
      continue;
    }
    const properties: Record<string, string> = {};
    for (const [, name, value] of (attributes ?? "").matchAll(ATTRIBUTE) as Iterable<
      [string, string, string]
    >) {
      if (!SKIPPED.has(name)) properties[camelCase(name)] = value;
    }
    const element: IconElement = { type: "element", tagName: tagName!, properties, children: [] };
    stack[stack.length - 1]!.children.push(element);
    if (!selfClosing) stack.push(element);
  }
  const svg = root.children[0];
  if (!svg || svg.tagName !== "svg") throw new Error("The callout icon did not render as an svg.");
  svg.properties = { ...svg.properties, width: "16", height: "16" };
  return svg;
}

const cache = new Map<CalloutKind, IconElement>();

/**
 * The icon of a callout kind as a hast `svg` element, drawn with `currentColor` so the tone of the
 * callout colors it. It is decorative: the label next to it carries the meaning.
 */
export function calloutIcon(kind: CalloutKind): IconElement {
  let icon = cache.get(kind);
  if (!icon) {
    icon = parseSvg(renderToStaticMarkup(createElement(ICONS[kind])));
    cache.set(kind, icon);
  }
  return structuredClone(icon);
}
