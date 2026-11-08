import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { DemoConfig, LinkContext } from "@/domain";
import { renderMarkdown } from "./render-markdown";

/** One sample of the home page, rendered by the pipeline of a page at build time. */
export interface DemoSample {
  /** The name on the button of the sample. */
  label: string;
  /** The path the sample stands for. It is the title of the source block. */
  title: string;
  /** The Markdown source, highlighted as a code block of a page. */
  source: string;
  /** The page the sample builds, for the preview: its ids are prefixed and its links are text. */
  preview: string;
  /** The HTML the sample builds, highlighted as a code block. */
  html: string;
  /** The HTML the sample builds, as the pipeline wrote it, before it is highlighted. The tests compare it with `html`. */
  generated: string;
}

/**
 * The HTML of a page turned into the HTML of its preview. The ids get a prefix, so they do not collide with the ids of
 * the page or of another sample. A link becomes its text, so the preview cannot navigate away or hold a tab stop
 * that leads nowhere. A heading loses its role, so the outline of the page does not list the sample.
 */
export function previewHtml(html: string, prefix: string): string {
  return html
    .replace(/ id="([^"]*)"/g, (_match, id: string) => ` id="${prefix}${id}"`)
    .replace(/<a(\s[^>]*)?>/g, '<span class="text-brand underline underline-offset-[3px]">')
    .replace(/<\/a>/g, "</span>")
    .replace(/<h([1-6])(\s|>)/g, '<h$1 role="presentation"$2');
}

/**
 * A fenced code block that holds `code` whatever it contains: the fence is one backtick longer than the longest run
 * of backticks in the code, so a sample with its own fences stays inside the block.
 */
export function fence(code: string, language: string, title?: string): string {
  const longest = Math.max(0, ...[...code.matchAll(/`+/g)].map((match) => match[0].length));
  const ticks = "`".repeat(Math.max(3, longest + 1));
  const meta = title ? ` title="${title}"` : "";
  return `${ticks}${language}${meta}\n${code.replace(/\n$/, "")}\n${ticks}\n`;
}

/**
 * Render the samples of the home page with `renderMarkdown`, the function a page uses. Each sample is rendered as the
 * file it stands for, so its relative links are rewritten by the same rules. Its source and its HTML are rendered
 * as code blocks, so they are highlighted at build time and the page needs no highlighter.
 */
export async function renderDemoSamples(
  siteDir: string,
  demo: DemoConfig,
  options: { base: string; context: (file: string) => LinkContext },
): Promise<DemoSample[]> {
  const samples: DemoSample[] = [];
  for (const [index, sample] of demo.samples.entries()) {
    const path = join(siteDir, sample.file);
    let markdown: string;
    try {
      markdown = readFileSync(path, "utf8");
    } catch {
      throw new Error(`The sample "${sample.label}" reads ${path}, which does not exist.`);
    }
    const context = options.context(sample.title);
    const { html: generated } = await renderMarkdown(markdown, { context, base: options.base });
    const source = await renderMarkdown(fence(markdown, "markdown", sample.title), {
      context,
      base: options.base,
    });
    const html = await renderMarkdown(fence(generated, "html", `${sample.title}, as HTML`), {
      context,
      base: options.base,
    });
    samples.push({
      label: sample.label,
      title: sample.title,
      source: source.html,
      preview: previewHtml(generated, `sample${index}-`),
      html: html.html,
      generated,
    });
  }
  return samples;
}
