/** An inclusive range of 1-based line numbers. */
export type LineRange = readonly [first: number, last: number];

/** What the text after the language of a fenced code block says. */
export interface CodeMeta {
  /** The caption shown over the block, or null when there is none. */
  title: string | null;
  /** The lines to highlight, as written in `{2,4-6}`. */
  highlighted: LineRange[];
}

/** A line that a diff adds or removes. */
export type DiffKind = "add" | "remove";

const TITLE = /(?:^|\s)title=(?:"([^"]*)"|'([^']*)')/;
const BRACES = /\{([^{}]*)\}/g;

/** Read `4` or `4-6`. Anything else, a zero, or a range that runs backwards, is not a range. */
function readRange(text: string): LineRange | null {
  const match = /^(\d+)(?:\s*-\s*(\d+))?$/.exec(text.trim());
  if (!match) return null;
  const first = Number(match[1]);
  const last = match[2] === undefined ? first : Number(match[2]);
  return first >= 1 && last >= first ? [first, last] : null;
}

/**
 * Read the meta string after the language of a fence, the part GitHub ignores:
 * `title="src/config.ts" {2,4-6}`. The title takes double or single quotes and cannot hold the quote that
 * opens it. Braces that hold anything but line numbers are left alone, and so is a brace inside the title.
 */
export function parseCodeMeta(meta: string | null | undefined): CodeMeta {
  const text = meta ?? "";
  const title = TITLE.exec(text);
  const rest = title ? text.replace(TITLE, " ") : text;
  const highlighted: LineRange[] = [];
  for (const group of rest.matchAll(BRACES)) {
    const body = group[1] ?? "";
    if (!/^[\d\s,-]+$/.test(body)) continue;
    for (const part of body.split(",")) {
      const range = readRange(part);
      if (range) highlighted.push(range);
    }
  }
  return { title: (title?.[1] ?? title?.[2] ?? "").trim() || null, highlighted };
}

/** Whether the 1-based line is inside any of the ranges. */
export function isHighlighted(ranges: readonly LineRange[], line: number): boolean {
  return ranges.some(([first, last]) => line >= first && line <= last);
}

/** The code split into lines, whatever line ends it uses. */
export function splitLines(code: string): string[] {
  return code.split(/\r\n|\r|\n/);
}

/** A comment that ends a line and says `[!code ++]` or `[!code --]`, in the comment styles of the common languages. */
const MARKER = /[ \t]*(?:\/\/|#|--|;|\/\*|<!--)[ \t]*\[!code (\+\+|--)\][ \t]*(?:\*\/|-->)?[ \t]*$/;

/**
 * Take the `[!code ++]` and `[!code --]` comments out of the code. The result has the code without the
 * comments, and for each line whether it was marked as added, removed, or neither. The code is returned
 * as it came when no line has a marker.
 */
export function readDiffMarkers(code: string): { code: string; marks: (DiffKind | null)[] } {
  const lines = splitLines(code);
  const marks: (DiffKind | null)[] = [];
  let found = false;
  const clean = lines.map((line) => {
    const match = MARKER.exec(line);
    if (!match) {
      marks.push(null);
      return line;
    }
    found = true;
    marks.push(match[1] === "++" ? "add" : "remove");
    return line.slice(0, match.index);
  });
  return found ? { code: clean.join("\n"), marks } : { code, marks };
}

/**
 * Read a block in the `diff` language: a line that starts with `+` is added and one that starts with `-` is
 * removed. The two file header lines of a unified diff (`--- a/file` and `+++ b/file`) are neither, but only
 * when a hunk header (`@@`) follows them, so a removed line that starts with `--` in a plain list of changes
 * is still removed.
 */
export function readDiffLanguage(code: string): (DiffKind | null)[] {
  const lines = splitLines(code);
  const hunk = lines.findIndex((line) => line.startsWith("@@"));
  return lines.map((line, index) => {
    if (hunk !== -1 && index < hunk && (line.startsWith("+++") || line.startsWith("---")))
      return null;
    if (line.startsWith("+")) return "add";
    if (line.startsWith("-")) return "remove";
    return null;
  });
}
