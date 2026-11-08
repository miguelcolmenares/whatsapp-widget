/** The HTML comment a page writes where its color palette goes. GitHub hides a comment, so there the page keeps its tables only. */
export const COLOR_PALETTE_MARKER = "<!-- sitekit:color-palette -->";

/** The color tokens of a `design/tokens.json`: the dark set is the top-level `color`, the light set is `themes.light.color`. */
export interface TokenColors {
  color: Record<string, string>;
  themes?: { light?: { color?: Record<string, string> } };
}

/** One token of the palette, with its value in each of the two sets. */
export interface PaletteEntry {
  name: string;
  dark: string;
  light: string;
}

/** A group of the palette, in the order the page shows them. */
export interface PaletteGroup {
  title: string;
  entries: PaletteEntry[];
}

/** The groups the palette shows the tokens in. A token that a site adds and no group lists goes to `Other`. */
export const PALETTE_GROUPS: readonly { title: string; names: readonly string[] }[] = [
  {
    title: "Surfaces",
    names: ["bg", "bg-subtle", "surface", "surface-2", "surface-3"],
  },
  { title: "Borders", names: ["border", "border-strong", "border-hover"] },
  { title: "Text", names: ["fg", "fg-bright", "fg-muted", "fg-dim", "fg-faint"] },
  { title: "Accent", names: ["accent", "accent-strong", "accent-contrast"] },
  { title: "Status", names: ["success", "warn", "danger"] },
  { title: "Code", names: ["code-highlight", "code-add", "code-remove"] },
];

/**
 * The palette of a site: every color token, grouped as `PALETTE_GROUPS` lists them, each with its dark and its light
 * value. It throws when the two sets do not have the same tokens, so a page never shows a swatch with a missing half.
 */
export function colorPalette(tokens: TokenColors): PaletteGroup[] {
  const dark = tokens.color ?? {};
  const light = tokens.themes?.light?.color ?? {};
  const names = Object.keys(dark);
  const onlyDark = names.filter((name) => !(name in light));
  const onlyLight = Object.keys(light).filter((name) => !(name in dark));
  if (onlyDark.length || onlyLight.length)
    throw new Error(
      `The light and dark color sets differ. Only in dark: ${onlyDark.join(", ") || "none"}. Only in light: ${onlyLight.join(", ") || "none"}.`,
    );

  const entry = (name: string): PaletteEntry => ({ name, dark: dark[name]!, light: light[name]! });
  const grouped = PALETTE_GROUPS.map((group) => ({
    title: group.title,
    entries: group.names.filter((name) => name in dark).map(entry),
  }));
  const listed = new Set(PALETTE_GROUPS.flatMap((group) => [...group.names]));
  const other = names.filter((name) => !listed.has(name)).map(entry);
  const groups = other.length > 0 ? [...grouped, { title: "Other", entries: other }] : grouped;
  return groups.filter((group) => group.entries.length > 0);
}
