/** The folder, at the root of the repository, that holds the snippets a page can include. */
export const SNIPPETS_DIR = "snippets";

/**
 * A variable or a snippet that could not be expanded. `file` is where it is written: the page, or the snippet when
 * the problem is inside one. `line` is the line of that file, starting at 1. The kinds are the keys `variables` and
 * `snippets` under `check`, so `check` decides the severity.
 */
export interface ReusableIssue {
  kind: "variables" | "snippets";
  /** Repository-relative path of the file where the problem is written, with forward slashes. */
  file: string;
  line: number;
  message: string;
}

/** What expanding the reusable content of one file needs from outside. */
export interface ReusableOptions {
  /** Repository-relative path of the file, for the issues. */
  file: string;
  /** The variables a page can use, by name. */
  variables: Readonly<Record<string, string>>;
  /** The text of a snippet, by the name written in the include, or undefined when there is no such snippet. */
  readSnippet: (name: string) => string | undefined;
  /** Lines of the file before the body (the frontmatter and its fences), so a line number is the file's. */
  lineOffset?: number;
  /** Called once for each variable or include that could not be expanded. */
  onIssue: (issue: ReusableIssue) => void;
}

/** The expanded body, and the line of the file that each of its lines came from. */
export interface ExpandedText {
  text: string;
  /** One entry per line of `text`: the line of the file, starting at 1. A line of a snippet is the line of its include. */
  lines: number[];
}

const FENCE = /^\s*(```+|~~~+)/;
const INCLUDE = /^(\s*)<!--\s*include:\s*(\S+?)\s*-->\s*$/;
const VARIABLE = /\{\{\s*([A-Za-z][\w-]*)\s*\}\}/g;

interface Line {
  text: string;
  line: number;
}

/** True when a text uses a variable or an include, so a page that does not use them is never touched. */
function mightUseReusable(text: string): boolean {
  return text.includes("{{") || /<!--\s*include:/.test(text);
}

/** Split a line into its code spans (odd parts) and the text around them (even parts). */
function splitCodeSpans(line: string): string[] {
  const parts: string[] = [];
  let text = "";
  let index = 0;
  while (index < line.length) {
    if (line[index] !== "`") {
      text += line[index++];
      continue;
    }
    let end = index;
    while (line[end] === "`") end++;
    const run = line.slice(index, end);
    // A span closes with a run of exactly as many backticks. Without one, the backticks are plain text.
    let close = -1;
    for (let probe = end; probe < line.length;) {
      if (line[probe] !== "`") {
        probe++;
        continue;
      }
      let stop = probe;
      while (line[stop] === "`") stop++;
      if (stop - probe === run.length) {
        close = probe;
        break;
      }
      probe = stop;
    }
    if (close === -1) {
      text += run;
      index = end;
      continue;
    }
    parts.push(text, line.slice(index, close + run.length));
    text = "";
    index = close + run.length;
  }
  parts.push(text);
  return parts;
}

/** Replace the variables of a piece of prose. An unknown one stays as written. */
function replaceInProse(
  text: string,
  variables: Readonly<Record<string, string>>,
  unknown: (name: string, written: string) => void,
): string {
  return text.replace(VARIABLE, (written, name: string) => {
    if (Object.hasOwn(variables, name)) return variables[name]!;
    unknown(name, written);
    return written;
  });
}

function unknownVariable(name: string): string {
  return `Unknown variable "${name}". Define it under "vars" in sitekit.config.json, or put it in a code span to show it as written.`;
}

/**
 * Expand the lines of one text. `file` is where the text lives, for the issues: the page, or a snippet. A snippet is
 * expanded with `allowInclude` off, so an include inside it is an issue. Each line keeps the line number it has in
 * `file`, and the caller turns the lines of a snippet into the line of its include.
 */
function expandLines(
  lines: readonly string[],
  file: string,
  options: ReusableOptions,
  allowInclude: boolean,
): Line[] {
  const out: Line[] = [];
  let fence: string | null = null;

  // The offset is for the body of a page. A snippet is a file of its own and counts from its first line.
  const first = allowInclude ? (options.lineOffset ?? 0) + 1 : 1;
  lines.forEach((line, offset) => {
    const number = offset + first;
    const match = FENCE.exec(line);
    if (fence !== null) {
      if (match && match[1]!.startsWith(fence[0]!) && match[1]!.length >= fence.length)
        fence = null;
      out.push({ text: line, line: number });
      return;
    }
    if (match) {
      fence = match[1]!;
      out.push({ text: line, line: number });
      return;
    }

    const include = INCLUDE.exec(line);
    if (include) {
      const [, indent, name] = include as unknown as [string, string, string];
      if (!allowInclude) {
        options.onIssue({
          kind: "snippets",
          file,
          line: number,
          message: `A snippet cannot include another snippet ("${name}"). Includes go one level deep.`,
        });
        out.push({ text: line, line: number });
        return;
      }
      const text = options.readSnippet(name);
      if (text === undefined) {
        options.onIssue({
          kind: "snippets",
          file,
          line: number,
          message: `Snippet "${name}" was not found. Snippets are the files under ${SNIPPETS_DIR}/ at the root of the repository.`,
        });
        out.push({ text: line, line: number });
        return;
      }
      const body = text.replace(/\r\n/g, "\n").replace(/\n+$/, "");
      const snippet = body === "" ? [] : body.split("\n");
      // The include line's indentation goes in front of every line, so a snippet in a list item stays in it.
      for (const expanded of expandLines(snippet, `${SNIPPETS_DIR}/${name}`, options, false)) {
        out.push({ text: expanded.text === "" ? "" : `${indent}${expanded.text}`, line: number });
      }
      return;
    }

    const expanded = splitCodeSpans(line)
      .map((part, index) =>
        index % 2 === 1
          ? part
          : replaceInProse(part, options.variables, (name) =>
              options.onIssue({
                kind: "variables",
                file,
                line: number,
                message: unknownVariable(name),
              }),
            ),
      )
      .join("");
    out.push({ text: expanded, line: number });
  });
  return out;
}

/**
 * Expand the reusable content of a markdown body. `<!-- include: name.md -->` alone on a line becomes the text of
 * that snippet, with the indentation of the include in front of each line, one level only. `{{ name }}` in prose,
 * headings, link text and addresses becomes the value of the variable. Fenced code and code spans are left as
 * written, so the syntax can be shown. A missing snippet, or an include inside a snippet, is left as written and
 * reported through `onIssue`, and so is an unknown variable. `lines` says which line of the file each line of the
 * result came from. A body that uses neither feature comes back as it is.
 */
export function expandReusable(content: string, options: ReusableOptions): ExpandedText {
  const offset = options.lineOffset ?? 0;
  if (!mightUseReusable(content)) {
    const count = content.split("\n").length;
    return {
      text: content,
      lines: Array.from({ length: count }, (_, index) => offset + index + 1),
    };
  }
  const expanded = expandLines(
    content.replace(/\r\n/g, "\n").split("\n"),
    options.file,
    options,
    true,
  );
  return {
    text: expanded.map((line) => line.text).join("\n"),
    lines: expanded.map((line) => line.line),
  };
}

/**
 * Replace the variables in the string values of a frontmatter, at any depth. `raw` is the text between the `---`
 * lines. Its first element is the rest of line 1, so element `n` is line `n + 1` of the file, and that is how an
 * unknown variable gets its line. Keys are never replaced, so the keys are checked as written.
 */
export function expandFrontmatter(
  data: Record<string, unknown>,
  raw: string,
  options: ReusableOptions,
): Record<string, unknown> {
  if (!raw.includes("{{")) return data;
  const rawLines = raw.split("\n");
  const visit = (value: unknown): unknown => {
    if (typeof value === "string") {
      return replaceInProse(value, options.variables, (name, written) => {
        const at = rawLines.findIndex((line) => line.includes(written));
        options.onIssue({
          kind: "variables",
          file: options.file,
          line: at === -1 ? 1 : at + 1,
          message: unknownVariable(name),
        });
      });
    }
    if (Array.isArray(value)) return value.map(visit);
    if (value !== null && typeof value === "object" && !(value instanceof Date)) {
      return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, visit(item)]));
    }
    return value;
  };
  return visit(data) as Record<string, unknown>;
}

/**
 * The variables of a site: `version` from the package of the repository, then the `vars` of the config, which win.
 * `version` is left out when neither has one, so `{{ version }}` is then an unknown variable.
 */
export function buildVariables(
  vars: Readonly<Record<string, string>>,
  version: string | undefined,
): Record<string, string> {
  return { ...(version === undefined ? {} : { version }), ...vars };
}
