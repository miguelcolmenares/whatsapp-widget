import { absoluteUrl } from "./llms";
import { withSiteBase } from "./site-href";

/**
 * Why a value of `site.image` cannot be used, or undefined when it can. A value is either an https address, or a
 * path of the site that names a file in `public/`, such as `/social.png` or `social.png`. It has no spaces, and a
 * path does not leave the site with `..`.
 *
 * @param value - The value as written in `site.image`.
 * @returns A sentence for the person who wrote the config, or undefined.
 */
export function socialImageProblem(value: string): string | undefined {
  if (/\s/.test(value)) {
    return `"${value}" has a space in it. Use a file name without spaces, such as social.png.`;
  }
  if (/^[a-z][a-z\d+.-]*:/i.test(value)) {
    return /^https:\/\/[^/?#\s]+\S*$/.test(value)
      ? undefined
      : `"${value}" is not an https address. Use an https address, or a path of the site such as /social.png.`;
  }
  if (value.startsWith("//")) {
    return `"${value}" is a protocol-relative address. Write the full https address, or a path of the site such as /social.png.`;
  }
  const path = value.replace(/^\//, "");
  if (path === "" || path.endsWith("/")) {
    return `"${value}" is not a file. Name the image file, such as /social.png.`;
  }
  if (path.split("/").some((part) => part === "..")) {
    return `"${value}" leaves the site. Use a file in public/, such as /social.png.`;
  }
  return undefined;
}

/**
 * The absolute address of the social image of a site, the one `og:image` and `twitter:image` point to.
 *
 * A path of the site gets the base, as the links of `nav` do. An https address is kept as it is.
 *
 * @param origin - The origin of the published site, for example `https://user.github.io`.
 * @param base - The base the site is served from, which starts and ends with `/`.
 * @param image - The value of `site.image`.
 * @returns The absolute address of the image.
 */
export function socialImageUrl(origin: string, base: string, image: string): string {
  if (/^https:\/\//i.test(image)) return image;
  return absoluteUrl(origin, withSiteBase(image.startsWith("/") ? image : `/${image}`, base));
}

/**
 * The alt text of the social image: `site.imageAlt`, or the name and the description of the site.
 *
 * @param site - The name, the description and the optional alt text of the site.
 * @returns The text, trimmed.
 */
export function socialImageAlt(site: {
  name: string;
  description: string;
  imageAlt?: string | undefined;
}): string {
  return (site.imageAlt ?? `${site.name}: ${site.description}`).trim();
}
