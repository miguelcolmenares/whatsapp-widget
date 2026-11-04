import { plainText } from "./describe";
import { proseLines } from "./markdownScan";

/** A heading found in markdown, before its anchor is decided. */
export interface HeadingLine {
  depth: number;
  /** The heading text without markdown marks. */
  text: string;
  /** Position of the heading's line in the markdown, starting at 0. */
  index: number;
}

/** A heading with the anchor the rendered page gives it. */
export interface HeadingAnchor extends HeadingLine {
  anchor: string;
  /** The anchor before a number was added to keep it unique. */
  base: string;
  /** Position of the first heading that has the same base, or null when this is the first. */
  firstIndex: number | null;
}

const ATX = /^ {0,3}(?:>\s?)*\s*(#{1,6})[ \t]+(.*?)(?:[ \t]+#+)?[ \t]*$/;
const SETEXT_TEXT = /^ {0,3}[^\s>#*+\-=|`~\d<][^\n]*$/;
const SETEXT_RULE = /^ {0,3}(=+|-+)[ \t]*$/;

/**
 * Turn heading text into the anchor a browser jumps to: lowercase, punctuation removed, each space
 * a hyphen. It is the rule GitHub and the site's renderer use, so a link that works on GitHub works here.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\p{Pc}\- ]/gu, "")
    .replace(/ /g, "-");
}

/** The headings of a markdown text: `#` headings and underlined ones, never anything inside a fence. */
export function extractHeadings(markdown: string): HeadingLine[] {
  const lines = proseLines(markdown);
  const found: HeadingLine[] = [];
  lines.forEach((line, position) => {
    if (line.fenced) return;
    const atx = ATX.exec(line.text);
    if (atx) {
      const text = plainText(atx[2]!);
      if (text !== "") found.push({ depth: atx[1]!.length, text, index: line.index });
      return;
    }
    const rule = SETEXT_RULE.exec(line.text);
    const above = lines[position - 1];
    if (rule && above && !above.fenced && SETEXT_TEXT.test(above.text)) {
      const previous = found[found.length - 1];
      if (previous?.index === above.index) return;
      const text = plainText(above.text);
      if (text !== "")
        found.push({ depth: rule[1]!.startsWith("=") ? 1 : 2, text, index: above.index });
    }
  });
  return found;
}

/**
 * Give each heading its anchor. A second heading that makes the same anchor gets `-1`, a third `-2`,
 * the way the rendered page does, so the anchors here are the ids there.
 */
export function anchorHeadings(headings: readonly HeadingLine[]): HeadingAnchor[] {
  const taken = new Map<string, number>();
  const firstOf = new Map<string, number>();
  return headings.map((heading) => {
    const base = slugify(heading.text);
    let anchor = base;
    while (taken.has(anchor)) {
      taken.set(base, taken.get(base)! + 1);
      anchor = `${base}-${taken.get(base)}`;
    }
    taken.set(anchor, 0);
    const firstIndex = firstOf.get(base) ?? null;
    if (firstIndex === null) firstOf.set(base, heading.index);
    return { ...heading, anchor, base, firstIndex };
  });
}

/** Anchors a page declares itself in HTML, `<a id="x">` or `<h2 id="x">`, outside code. */
export function explicitAnchors(markdown: string): string[] {
  return proseLines(markdown)
    .filter((line) => !line.fenced && line.text.includes("<"))
    .flatMap((line) =>
      [...line.text.matchAll(/<[a-z][^>]*?\b(?:id|name)\s*=\s*["']([^"']+)["'][^>]*>/gi)].map(
        (match) => match[1]!,
      ),
    );
}
