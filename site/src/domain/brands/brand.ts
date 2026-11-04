/** One brand logo as data: the path of a monochrome mark on a 24 by 24 grid, and where it came from. */
export interface Brand {
  /** The Simple Icons slug, for example `nextdotjs`. It is what `brand:<slug>` names. */
  slug: string;
  /** The name of the brand as its owner writes it, for example `Next.js`. */
  title: string;
  /** The `d` attribute of the single path that draws the mark. */
  path: string;
  /** SPDX id of the licence of the icon. Always `CC0-1.0` unless the icon is on the allowlist. */
  license: string;
  /** Where the mark was taken from. */
  source: string;
  /** The owner's brand guidelines, when Simple Icons has a link to them. */
  guidelines?: string;
  /** Author of an icon with its own licence. */
  author?: string;
  /** The attribution text that the licence asks for. */
  attribution?: string;
}

/** What `Icon` draws for a logo: a view box and one or more filled paths. */
export interface BrandGlyph {
  /** The `viewBox` attribute, four numbers. */
  viewBox: string;
  /** The shapes, each filled with `currentColor`. */
  paths: readonly { d: string; fillRule?: "evenodd" | "nonzero" }[];
}
