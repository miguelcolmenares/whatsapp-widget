import { codeBlockTransformers } from "./codeBlocks";
import { remarkCallouts } from "./remarkCallouts";
import { remarkRewriteLinks } from "./remarkRewriteLinks";
import type { LinkContext } from "../domain";

/** A page body as HTML, with its headings for the table of contents. */
export interface RenderedMarkdown {
  html: string;
  headings: { depth: number; slug: string; text: string }[];
}

/**
 * Walk a hast tree to make rendered markdown safe and usable:
 * web links open in a new tab, and blocks that can scroll sideways (code, tables) can be
 * focused, so a keyboard user can scroll them. Done in the HTML, so it needs no JavaScript.
 */
function rehypeExternalLinks() {
  type Node = {
    type: string;
    tagName?: string;
    properties?: Record<string, unknown>;
    children?: Node[];
  };
  const visit = (node: Node) => {
    if (node.type === "element" && (node.tagName === "pre" || node.tagName === "table")) {
      node.properties = { ...node.properties, tabIndex: 0 };
    }
    if (node.type === "element" && node.tagName === "a") {
      const href = String(node.properties?.href ?? "");
      if (/^https?:\/\//i.test(href))
        node.properties = { ...node.properties, target: "_blank", rel: "noopener noreferrer" };
    }
    node.children?.forEach(visit);
  };
  return (tree: Node) => visit(tree);
}

/**
 * Render markdown to HTML with Shiki highlighting and rewritten links. The markdown package is
 * loaded on demand: it is ESM only, and nothing else in this layer needs it.
 */
export async function renderMarkdown(
  markdown: string,
  options: { context: LinkContext; base: string; onWarning?: (message: string) => void },
): Promise<RenderedMarkdown> {
  const { createMarkdownProcessor } = await import("@astrojs/markdown-remark");
  const processor = await createMarkdownProcessor({
    syntaxHighlight: { type: "shiki", excludeLangs: [] },
    // Both themes are written as CSS variables (--shiki-dark, --shiki-light), and the page's theme picks one.
    // The light theme is the high-contrast one: its darkest token color still reaches 4.5:1 on the code background.
    shikiConfig: {
      themes: { light: "github-light-high-contrast", dark: "github-dark-default" },
      defaultColor: false,
      transformers: codeBlockTransformers(),
    },
    remarkPlugins: [
      [remarkRewriteLinks, options],
      [remarkCallouts, {}],
    ],
    rehypePlugins: [rehypeExternalLinks],
  });
  const result = await processor.render(markdown);
  return { html: result.code, headings: result.metadata.headings };
}
