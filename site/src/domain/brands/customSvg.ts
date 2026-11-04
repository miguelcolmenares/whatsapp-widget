import type { BrandGlyph } from "./brand";

const MAX_BYTES = 20_000;
const ALLOWED = new Set(["svg", "path", "g", "title", "desc"]);
const PATH_DATA = /^[MmLlHhVvCcSsQqTtAaZz0-9eE+\-.,\s]+$/;
const VIEW_BOX = /^\s*-?\d+(\.\d+)?([\s,]+-?\d+(\.\d+)?){3}\s*$/;

const attribute = (tag: string, name: string) =>
  new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`)
    .exec(tag)
    ?.slice(1)
    .find((value) => value !== undefined);

/**
 * Take out the XML declaration, the comments and the doctype. A single pass can leave a comment behind that the
 * removal itself closed up (`<!<!-- -->--`), so it runs until the text stops changing.
 */
function withoutMarkupNoise(source: string): string {
  let markup = source;
  for (let previous = ""; previous !== markup;) {
    previous = markup;
    markup = markup.replace(/<\?[\s\S]*?\?>|<!--[\s\S]*?-->|<!DOCTYPE[^>]*>/gi, "");
  }
  return markup;
}

/**
 * Read an SVG file the author added to the brands folder and keep only what a monochrome logo needs:
 * the view box and the path data. Anything else is refused, with the file named, so a logo never draws
 * differently from what the file shows, and a file never brings a script or a request with it.
 */
export function parseCustomSvg(source: string, file: string): BrandGlyph {
  const fail = (reason: string): never => {
    throw new Error(`${file}: ${reason}`);
  };
  if (source.length > MAX_BYTES)
    fail(`is larger than ${MAX_BYTES / 1000} KB. A logo is a few KB of path data.`);
  const markup = withoutMarkupNoise(source);
  const tags = [...markup.matchAll(/<\/?\s*([a-zA-Z][\w:-]*)([^>]*)>/g)];
  if (tags[0]?.[1]?.toLowerCase() !== "svg" || markup.trimStart().startsWith("</"))
    fail("is not an SVG: it must start with an <svg> element.");
  const paths: { d: string; fillRule?: "evenodd" | "nonzero" }[] = [];
  let viewBox: string | undefined;
  for (const [text, name = "", rest = ""] of tags) {
    const tag = name.toLowerCase();
    if (!ALLOWED.has(tag))
      fail(
        `uses <${name}>. A custom logo can only have <path> shapes: convert other shapes to paths in your design tool.`,
      );
    if (text.startsWith("</")) continue;
    if (/\stransform\s*=/.test(rest))
      fail("uses a transform. Apply it in your design tool so the path data is final.");
    if (tag === "svg") viewBox ??= attribute(rest, "viewBox");
    if (tag !== "path") continue;
    const d = attribute(rest, "d");
    if (!d || !PATH_DATA.test(d)) fail("has a <path> without valid path data in d.");
    if (/\sstroke\s*=/.test(rest) || /\sfill\s*=\s*["']none["']/.test(rest))
      fail(
        "has an outline-only path. A logo is a filled shape: convert strokes to outlines in your design tool.",
      );
    const fillRule = attribute(rest, "fill-rule");
    paths.push({
      d: d!.trim(),
      ...(fillRule === "evenodd" || fillRule === "nonzero" ? { fillRule } : {}),
    });
  }
  if (!viewBox || !VIEW_BOX.test(viewBox))
    fail('needs a viewBox on <svg>, for example viewBox="0 0 24 24".');
  if (paths.length === 0) fail("has no <path>.");
  return { viewBox: viewBox!.trim().replace(/[\s,]+/g, " "), paths };
}
