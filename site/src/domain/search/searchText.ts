/** A heading of a page, as the search index keeps it: its text, the anchor the page gives it, and where its text starts. */
export interface SearchableHeading {
  text: string;
  /** The `id` the rendered page gives the heading. Empty when the text has no letter or digit, so there is no anchor. */
  id: string;
  /** Position of the heading text in the searchable text of its page. */
  offset: number;
}

/** A page reduced to the text a reader can search: its body as plain text, and its headings in order. */
export interface SearchableText {
  text: string;
  headings: SearchableHeading[];
}

/**
 * The anchor a heading gets on the rendered page. It follows the rule of the GitHub heading slugger that
 * Astro uses: lowercase, drop what is not a letter, digit, space, hyphen or underscore, spaces become hyphens,
 * and a repeated heading gets `-1`, `-2` and so on.
 */
export function createSlugger(): (text: string) => string {
  const seen = new Map<string, number>();
  return (text) => {
    const base = text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\p{M} _-]/gu, "")
      .replace(/ /g, "-");
    if (!seen.has(base)) {
      seen.set(base, 0);
      return base;
    }
    let count = seen.get(base)!;
    let candidate: string;
    do {
      count++;
      candidate = `${base}-${count}`;
    } while (seen.has(candidate));
    seen.set(base, count);
    seen.set(candidate, 0);
    return candidate;
  };
}

/** Reduce the inline markdown of one line to its text: links keep their label, code keeps its words, marks go. */
function inlineText(line: string): string {
  return line
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<\/?[a-zA-Z][^>]*>/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\[[^\]]*\]/g, "$1")
    .replace(/<(https?:\/\/[^>]+)>/g, "$1")
    .replace(/(`+)([^`]*?)\1/g, "$2")
    .replace(/\\([\\`*_{}[\]()#+\-.!|>~])/g, "$1")
    .replace(/~~|\*/g, "")
    .replace(/(^|[\s([{])_+|_+(?=[\s)\]}.,:;!?]|$)/g, "$1 ")
    .replace(/\s+/g, " ")
    .trim();
}

const FENCE = /^ {0,3}(`{3,}|~{3,})/;
const ATX_HEADING = /^ {0,3}#{1,6}(?:[ \t]+(.*?))?[ \t]*$/;
const SETEXT_UNDERLINE = /^ {0,3}(=+|-+)[ \t]*$/;
const LIST_OR_QUOTE = /^\s*([-*+]\s|\d+[.)]\s|>)/;
const TABLE_DELIMITER = /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/;
const REFERENCE_DEFINITION = /^ {0,3}\[[^\]]+\]:\s*\S+/;

/**
 * Reduce a markdown body to the text a search can match, and list its headings with their anchors.
 * Fenced code is kept as text, because readers search for commands, but a `#` line inside a fence is not a
 * heading. Headings are the ATX (`#`) and the underlined kind outside fences, the ones the page renders, and
 * each one records where its text starts, so a match can be mapped back to the section it is in.
 */
export function extractSearchableText(markdown: string): SearchableText {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const slug = createSlugger();
  const headings: SearchableHeading[] = [];
  let text = "";
  let fence: string | null = null;

  const addLine = (value: string) => {
    text += `${value}\n`;
  };
  const addHeading = (value: string) => {
    headings.push({ text: value, id: slug(value), offset: text.length });
    addLine(value);
  };

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]!;
    const fenceMatch = FENCE.exec(line);

    if (fence !== null) {
      if (fenceMatch && fenceMatch[1]![0] === fence[0] && fenceMatch[1]!.length >= fence.length) {
        fence = null;
      } else if (line.trim() !== "") {
        addLine(line.trim());
      }
      continue;
    }
    if (fenceMatch) {
      fence = fenceMatch[1]!;
      continue;
    }

    const atx = ATX_HEADING.exec(line);
    if (atx) {
      // A closing run of `#` is part of the markup, not of the title.
      const heading = inlineText((atx[1] ?? "").replace(/(^|[ \t]+)#+$/, ""));
      if (heading !== "") addHeading(heading);
      continue;
    }

    const next = lines[index + 1];
    if (
      line.trim() !== "" &&
      !LIST_OR_QUOTE.test(line) &&
      next !== undefined &&
      SETEXT_UNDERLINE.test(next)
    ) {
      const heading = inlineText(line);
      if (heading !== "") addHeading(heading);
      index++;
      continue;
    }

    if (line.trim() === "" || TABLE_DELIMITER.test(line) || REFERENCE_DEFINITION.test(line))
      continue;
    const body = inlineText(
      line
        .replace(/^\s*(>\s?)+/, "")
        .replace(/^\s*([-*+]|\d+[.)])\s+/, "")
        .replace(/\[[ xX]\]\s*/, "")
        .replace(/\|/g, " "),
    );
    if (body !== "") addLine(body);
  }

  return { text: text.trimEnd(), headings };
}
