/** One line of a markdown text, and whether it belongs to a fenced code block. */
export interface ProseLine {
  /** Position of the line in the text, starting at 0. */
  index: number;
  text: string;
  /** True for the opening and closing fence lines and for everything between them. */
  fenced: boolean;
}

/** A piece of one line: prose, or a code span with its backticks. */
export interface InlinePart {
  text: string;
  code: boolean;
}

/** A markdown link `[label](href "optional title")`. An image starts with `!` and is matched too. The label of a link can hold an image, as a badge does. */
export interface InlineLink {
  image: boolean;
  label: string;
  href: string;
  title: string;
}

const FENCE = /^\s*(?:>\s?)*\s*(```+|~~~+)/;

/**
 * Split markdown into lines and mark the ones inside a fenced code block. A fence closes with the same
 * character and at least as many of them as it opened with, and it can sit in a blockquote or a list.
 * Everything that reads markdown for links, headings or markers starts here, so code is never read.
 */
export function proseLines(markdown: string): ProseLine[] {
  let fence: string | null = null;
  return markdown
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((text, index) => {
      const match = FENCE.exec(text);
      if (fence !== null) {
        if (match && match[1]!.startsWith(fence[0]!) && match[1]!.length >= fence.length)
          fence = null;
        return { index, text, fenced: true };
      }
      if (match) {
        fence = match[1]!;
        return { index, text, fenced: true };
      }
      return { index, text, fenced: false };
    });
}

/**
 * Split one line into prose and code spans. A span opens with a run of backticks and closes at the next
 * run of the same length, so a span written with two backticks can hold a single backtick. A run with no partner is plain text.
 */
export function splitInlineCode(line: string): InlinePart[] {
  const parts: InlinePart[] = [];
  let start = 0;
  let i = 0;
  while (i < line.length) {
    if (line[i] !== "`") {
      i += 1;
      continue;
    }
    let end = i;
    while (line[end] === "`") end += 1;
    const run = end - i;
    let close = -1;
    for (let j = end; j < line.length;) {
      if (line[j] !== "`") {
        j += 1;
        continue;
      }
      let k = j;
      while (line[k] === "`") k += 1;
      if (k - j === run) {
        close = k;
        break;
      }
      j = k;
    }
    if (close === -1) {
      i = end;
      continue;
    }
    if (i > start) parts.push({ text: line.slice(start, i), code: false });
    parts.push({ text: line.slice(i, close), code: true });
    start = close;
    i = close;
  }
  if (start < line.length) parts.push({ text: line.slice(start), code: false });
  return parts;
}

/**
 * The line with every code span replaced by the same number of `\u0000` characters. A link whose label
 * holds code, such as one with a code word in its text, can still be read, a link written inside code cannot, and
 * every other character keeps its position.
 */
export function maskInlineCode(line: string): string {
  return splitInlineCode(line)
    .map((part) => (part.code ? "\u0000".repeat(part.text.length) : part.text))
    .join("");
}

/** The part after `](`: the address, an optional title, and the closing parenthesis. */
const DESTINATION = /([^)\s]+)((?:\s+"[^"]*")?)\)/y;

/** Index of the `]` that closes the `[` at `open`, counting brackets inside the label, or -1. */
function closingBracket(text: string, open: number): number {
  let depth = 0;
  for (let i = open; i < text.length; i += 1) {
    const char = text[i];
    if (char === "\\") i += 1;
    else if (char === "[") depth += 1;
    else if (char === "]") {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/**
 * Read inline links and images of a piece of prose, in order, with where each starts and ends. The label
 * of a link can hold an image, as a badge does, and brackets inside a label are counted. Reading
 * is one pass over the text with no backtracking, so a long run of brackets cannot make it slow.
 */
function scanInlineLinks(prose: string): (InlineLink & { start: number; end: number })[] {
  const found: (InlineLink & { start: number; end: number })[] = [];
  for (let i = 0; i < prose.length; i += 1) {
    if (prose[i] !== "[") continue;
    const close = closingBracket(prose, i);
    if (close === -1 || prose[close + 1] !== "(") continue;
    DESTINATION.lastIndex = close + 2;
    const match = DESTINATION.exec(prose);
    if (!match) continue;
    const image = i > 0 && prose[i - 1] === "!";
    const end = DESTINATION.lastIndex;
    found.push({
      image,
      label: prose.slice(i + 1, close),
      href: match[1]!,
      title: match[2]!,
      start: image ? i - 1 : i,
      end,
    });
    i = end - 1;
  }
  return found;
}

/** Every inline link and image of a piece of prose, in order. Reference links are not read. */
export function inlineLinks(prose: string): InlineLink[] {
  return scanInlineLinks(prose).map(({ image, label, href, title }) => ({
    image,
    label,
    href,
    title,
  }));
}

/** Replace each inline link or image of a piece of prose with what `replace` returns for it. */
export function replaceInlineLinks(
  prose: string,
  replace: (link: InlineLink, whole: string) => string,
): string {
  let out = "";
  let from = 0;
  for (const { start, end, ...link } of scanInlineLinks(prose)) {
    out += prose.slice(from, start) + replace(link, prose.slice(start, end));
    from = end;
  }
  return out + prose.slice(from);
}
