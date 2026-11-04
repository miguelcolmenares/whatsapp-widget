import { CALLOUT_LABELS, parseCalloutMarker } from "../domain";
import type { CalloutKind } from "../domain";
import { calloutIcon } from "./calloutIcons";

interface Node {
  type: string;
  value?: string;
  children?: Node[];
  data?: object;
}

/** An mdast node that the renderer turns into the HTML element `tag`, through `data.hName`. */
const element = (
  type: string,
  tag: string,
  properties: Record<string, unknown>,
  children: Node[],
): Node => ({ type, children, data: { hName: tag, hProperties: properties } });

/** The icon of a callout: an `svg` whose content is the lucide icon of the kind, hidden from assistive technology. */
function iconNode(kind: CalloutKind): Node {
  const icon = calloutIcon(kind);
  return {
    type: "calloutIcon",
    children: [],
    data: {
      hName: "svg",
      hProperties: { ...icon.properties, className: ["callout-icon"], ariaHidden: "true" },
      hChildren: icon.children,
    },
  };
}

/**
 * If the blockquote opens with a callout marker, return its kind and its content without the marker
 * line. Returns null when it is a plain blockquote. It never changes the blockquote it reads.
 */
function takeMarker(quote: Node): { kind: CalloutKind; children: Node[] } | null {
  const paragraph = quote.children?.[0];
  const text = paragraph?.type === "paragraph" ? paragraph.children?.[0] : undefined;
  if (!paragraph || !text || text.type !== "text" || typeof text.value !== "string") return null;
  const marker = parseCalloutMarker(text.value);
  if (!marker) return null;

  const inline = paragraph.children!.slice(1);
  if (marker.rest === "") {
    // A marker that ends its line with two spaces or a backslash leaves a break behind it.
    if (inline[0]?.type === "break") inline.shift();
  } else {
    inline.unshift({ ...text, value: marker.rest });
  }
  const rest = quote.children!.slice(1);
  return {
    kind: marker.kind,
    children: inline.length > 0 ? [{ ...paragraph, children: inline }, ...rest] : rest,
  };
}

/**
 * Remark plugin: a blockquote that opens with `[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]` or
 * `[!CAUTION]` on a line of its own becomes a callout, the same alert syntax GitHub renders. The
 * marker line is removed, and the rest of the blockquote (paragraphs, lists, code, another callout)
 * is kept as it is. The output is an `aside` with `role="note"`, an icon that is hidden from assistive
 * technology and a visible label, so it needs no JavaScript and does not rely on color alone. Any
 * other blockquote is left as it is, and so is a marker in a code block or a code span, because those are not text nodes.
 */
export function remarkCallouts() {
  const visit = (node: Node) => {
    if (!node.children) return;
    node.children = node.children.map((child) => {
      visit(child);
      if (child.type !== "blockquote") return child;
      const callout = takeMarker(child);
      if (!callout) return child;
      const { kind } = callout;
      return element(
        "callout",
        "aside",
        { className: ["callout", `callout-${kind}`], role: "note", dataCallout: kind },
        [
          iconNode(kind),
          element("calloutBody", "div", { className: ["callout-body"] }, [
            element("calloutLabel", "p", { className: ["callout-label"] }, [
              { type: "text", value: CALLOUT_LABELS[kind] },
            ]),
            ...callout.children,
          ]),
        ],
      );
    });
  };
  return (tree: Node) => visit(tree);
}
