/** Name of the llms.txt file, at the site base. */
export const LLMS_FILE = "llms.txt";

/** Name of the Markdown copy of a directory page, as the llms.txt proposal names it. */
const MARKDOWN_INDEX = "index.html.md";

/**
 * An absolute address from the origin of the site and a path that already carries the base,
 * for example `https://user.github.io` and `/repo/docs/a/` give `https://user.github.io/repo/docs/a/`.
 */
export function absoluteUrl(origin: string, path: string): string {
  return `${origin.replace(/\/+$/, "")}${path}`;
}

/** Address of the llms.txt file of a site. */
export function llmsUrl(origin: string, base: string): string {
  return absoluteUrl(origin, `${base}${LLMS_FILE}`);
}

/**
 * Path, relative to the site output, of the Markdown copy of a page: the page route with the base
 * taken off, and `index.html.md` after it. `/repo/docs/a/` becomes `docs/a/index.html.md`.
 */
export function markdownPath(route: string, base: string): string {
  return `${route.slice(base.length)}${MARKDOWN_INDEX}`;
}

/** Address of the Markdown copy of a page, the page route followed by `index.html.md`. */
export function markdownUrl(origin: string, route: string): string {
  return absoluteUrl(origin, `${route}${MARKDOWN_INDEX}`);
}
