/**
 * Where a link written in the config goes on a site published under `base`.
 *
 * A path that starts with `/` is a path of this site, so it gets the base: with the base `/acme/`,
 * `/docs/start/` becomes `/acme/docs/start/`. Everything else is left as written: web addresses,
 * `mailto:` links, `//host` addresses, `#` anchors, paths relative to the page, and a path that already
 * starts with the base, which is how a site worked around the missing rule before it existed.
 *
 * A path that starts with the base by accident is taken as complete. With the base `/docs/`, the link
 * `/docs/api/` stays `/docs/api/` and does not become `/docs/docs/api/`. To reach `/docs/api/` inside such
 * a site, write the base twice: `/docs/docs/api/`.
 *
 * @param href - The link as written in `nav` or `footer.links`.
 * @param base - The base of the site, which starts and ends with `/`.
 * @returns The link to render.
 */
export function withSiteBase(href: string, base: string): string {
  if (!href.startsWith("/") || href.startsWith("//") || base === "/") return href;
  const root = base.slice(0, -1);
  // The base itself, with or without its closing slash, and anything inside it.
  const insideBase =
    href.startsWith(base) || (href.startsWith(root) && /^([?#]|$)/.test(href.slice(root.length)));
  return insideBase ? href : `${base}${href.slice(1)}`;
}
