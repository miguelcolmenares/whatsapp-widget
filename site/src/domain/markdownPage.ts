import { resolveLink } from "./links";
import type { LinkContext } from "./links";
import type { Document } from "./document";
import { proseLines, replaceInlineLinks, splitInlineCode } from "./markdownScan";

/** What the Markdown copy of a page needs: the link rules of the page, and the address of the page itself. */
export interface MarkdownPageOptions {
  context: LinkContext;
  /** Origin of the published site, for example `https://user.github.io`. */
  origin: string;
  /** Absolute address of the page, so an in-page anchor can point at it from the copy. */
  pageUrl: string;
}

/** The address of a link target once the copy is read on its own: every site path gets the origin. */
function absolute(target: string, options: MarkdownPageOptions): string {
  if (target.startsWith("#")) return `${options.pageUrl}${target}`;
  if (target.startsWith("/") && !target.startsWith("//")) {
    return `${options.origin.replace(/\/+$/, "")}${target}`;
  }
  return target;
}

/** Rewrite the links of one piece of prose. Each link is decided by `resolveLink`, the rule the HTML uses. */
function rewriteProse(text: string, options: MarkdownPageOptions): string {
  return replaceInlineLinks(text, ({ image, label, href, title }, whole) => {
    if (image) return whole;
    const resolution = resolveLink(href, options.context);
    // A link to an excluded file keeps its words and loses the address, as it does on the page.
    if (resolution.kind === "text-only") return label;
    const target = resolution.kind === "missing" ? href : resolution.href;
    return `[${label}](${absolute(target, options)}${title})`;
  });
}

/**
 * The Markdown copy of a page: its title as a heading, then its body with every link decided by
 * the same rules as the HTML (routes, repository files, excluded files) and written as an absolute
 * address. Fenced code and inline code are never touched.
 */
export function renderMarkdownPage(document: Document, options: MarkdownPageOptions): string {
  const lines = proseLines(document.body).map(({ text, fenced }) =>
    fenced
      ? text
      : splitInlineCode(text)
          .map((part) => (part.code ? part.text : rewriteProse(part.text, options)))
          .join(""),
  );

  const body = lines.join("\n").replace(/^\s+/, "").trimEnd();
  return `${[`# ${document.title}`, body].filter((part) => part !== "").join("\n\n")}\n`;
}
