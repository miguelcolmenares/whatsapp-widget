/** Apply a replacement until the text stops changing, so a tag split by another tag cannot reappear. */
function replaceUntilStable(text: string, pattern: RegExp, replacement: string): string {
  let current = text;
  for (let previous = ""; previous !== current;) {
    previous = current;
    current = current.replace(pattern, replacement);
  }
  return current;
}

/** Turn a markdown fragment into plain text: no code marks, links, images, emphasis or HTML. */
export function plainText(markdown: string): string {
  return replaceUntilStable(
    markdown.replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1"),
    /<[^>]+>/g,
    "",
  )
    .replace(/`+([^`]*)`+/g, "$1")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/\s+/g, " ")
    .trim();
}

interface Block {
  kind: "heading" | "paragraph" | "other";
  level?: number;
  text: string;
}

/** Split markdown into blocks, ignoring fenced code, so a `#` comment in a fence is never a heading. */
function blocks(markdown: string): Block[] {
  const result: Block[] = [];
  let paragraph: string[] = [];
  let fence: string | null = null;

  const flush = () => {
    if (paragraph.length > 0) result.push({ kind: "paragraph", text: paragraph.join(" ") });
    paragraph = [];
  };

  for (const line of markdown.replace(/\r\n/g, "\n").split("\n")) {
    const fenceMatch = /^\s*(```+|~~~+)/.exec(line);
    if (fence !== null) {
      if (
        fenceMatch &&
        fenceMatch[1]!.startsWith(fence[0]!) &&
        fenceMatch[1]!.length >= fence.length
      )
        fence = null;
      continue;
    }
    if (fenceMatch) {
      flush();
      fence = fenceMatch[1]!;
      continue;
    }
    const heading = /^(#{1,6})\s+(.*?)\s*#*\s*$/.exec(line);
    if (heading) {
      flush();
      result.push({ kind: "heading", level: heading[1]!.length, text: heading[2]! });
    } else if (line.trim() === "") {
      flush();
    } else if (
      /^\s*(\||>|[-*+]\s|\d+\.\s|<)/.test(line) ||
      /^\s{4,}\S/.test(line) ||
      /^[-=]{3,}\s*$/.test(line)
    ) {
      flush();
      result.push({ kind: "other", text: line });
    } else {
      paragraph.push(line.trim());
    }
  }
  flush();
  return result;
}

/** A paragraph made only of images and links to images, as a row of badges. */
function isBadgeOnly(text: string): boolean {
  // Remove each badge, then see if anything is left. One pass with no nested repetition, so no backtracking.
  return (
    plainText(text) === "" ||
    text.replace(/\[?!\[[^\]]*\]\([^)]*\)\]?(?:\([^)]*\))?/g, "").trim() === ""
  );
}

/** The first level-one heading, as plain text, or the fallback. */
export function extractTitle(markdown: string, fallback: string): string {
  const heading = blocks(markdown).find((block) => block.kind === "heading" && block.level === 1);
  const title = heading ? plainText(heading.text) : "";
  return title || fallback;
}

/** The first paragraph of real prose, as plain text, cut at a word boundary. */
export function extractDescription(markdown: string, maxLength = 200): string {
  const paragraph = blocks(markdown).find(
    (block) => block.kind === "paragraph" && !isBadgeOnly(block.text),
  );
  if (!paragraph) return "";
  const text = plainText(paragraph.text);
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 40 ? cut.lastIndexOf(" ") : cut.length).trimEnd()}…`;
}

/** Remove a leading `# Title` when it repeats the page title, since the page already shows it. */
export function dropLeadingTitle(markdown: string, title: string): string {
  const match = /^\s*#\s+(.*?)\s*#*\s*(\n|$)/.exec(markdown);
  if (!match || plainText(match[1]!) !== title) return markdown;
  return markdown.slice(match[0].length).replace(/^\s*\n/, "");
}

/** `getting-started` becomes `Getting started`. */
export function humanize(slug: string): string {
  const words = slug
    .replace(/\.[a-z]+$/i, "")
    .replace(/[-_]+/g, " ")
    .trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}
