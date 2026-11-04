import type { Brand, BrandGlyph } from "./brand";
import { BRANDS } from "./brandData";

/** An `icon` value of the config, read: a lucide icon, a brand that ships, or a logo the author added. */
export type IconRef =
  | { kind: "lucide"; name: string }
  | { kind: "brand"; slug: string }
  | { kind: "custom"; name: string };

const NAME = /^[a-z0-9-]+$/;
const PREFIX = "brand:";
const CUSTOM = "custom/";

/** Read an `icon` value: `shield-check`, `brand:github` or `brand:custom/my-logo`. Returns undefined when it is none of them. */
export function parseIconName(value: string): IconRef | undefined {
  if (!value.startsWith(PREFIX))
    return NAME.test(value) ? { kind: "lucide", name: value } : undefined;
  const rest = value.slice(PREFIX.length);
  if (rest.startsWith(CUSTOM)) {
    const name = rest.slice(CUSTOM.length);
    return NAME.test(name) ? { kind: "custom", name } : undefined;
  }
  // `custom` is the folder, never a brand: a bare `brand:custom` is a mistake the message explains.
  return NAME.test(rest) && rest !== "custom" ? { kind: "brand", slug: rest } : undefined;
}

/** The brand that ships with this slug, if there is one. */
export function findBrand(slug: string): Brand | undefined {
  return BRANDS.find((brand) => brand.slug === slug);
}

const squash = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, "");

function distance(a: string, b: string): number {
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let row = 1; row <= a.length; row += 1) {
    const current = [row];
    for (let column = 1; column <= b.length; column += 1) {
      current[column] = Math.min(
        (previous[column] ?? 0) + 1,
        (current[column - 1] ?? 0) + 1,
        (previous[column - 1] ?? 0) + (a[row - 1] === b[column - 1] ? 0 : 1),
      );
    }
    previous = current;
  }
  return previous[b.length] ?? 0;
}

/**
 * The brands closest to a slug that is not one, best first. A brand counts when its slug or its name,
 * written without punctuation, equals the input (`nextjs` finds `Next.js`), contains it or is contained
 * by it, or is within a small edit distance of it.
 */
export function suggestBrands(slug: string, limit = 3): Brand[] {
  const wanted = squash(slug);
  if (!wanted) return [];
  return BRANDS.map((brand) => {
    const candidates = [squash(brand.slug), squash(brand.title)];
    const best = Math.min(...candidates.map((candidate) => distance(wanted, candidate)));
    const related = candidates.some(
      (candidate) =>
        candidate === wanted ||
        (wanted.length >= 3 && (candidate.includes(wanted) || wanted.includes(candidate))),
    );
    return {
      brand,
      rank: related ? 0 : best,
      close: related || best <= Math.max(2, Math.floor(wanted.length / 3)),
    };
  })
    .filter((entry) => entry.close)
    .sort((a, b) => a.rank - b.rank || a.brand.slug.localeCompare(b.brand.slug))
    .slice(0, limit)
    .map((entry) => entry.brand);
}

/**
 * What is wrong with an `icon` value, in a sentence the author can act on, or undefined when it is
 * well formed. An unknown brand names the slug and suggests the closest ones. Whether a custom logo's
 * file exists is not known here: the site checks that when it reads the folder.
 */
export function iconProblem(value: string): string | undefined {
  const ref = parseIconName(value);
  if (!ref) {
    if (value === "brand:custom")
      return 'brand:custom needs the name of a file in the brands folder, for example "brand:custom/my-logo".';
    return `"${value}" is not an icon name. Use a lucide name in kebab-case, "brand:<slug>", or "brand:custom/<name>".`;
  }
  if (ref.kind !== "brand" || findBrand(ref.slug)) return undefined;
  const near = suggestBrands(ref.slug);
  const hint = near.length
    ? `Did you mean ${near.map((brand) => `brand:${brand.slug} (${brand.title})`).join(", ")}?`
    : `The brands that ship are: ${BRANDS.map((brand) => brand.slug).join(", ")}.`;
  return `Unknown brand "${ref.slug}". ${hint} A logo that does not ship can be added as "brand:custom/<name>".`;
}

/** The glyph of a brand that ships, in the shape `Icon` draws. */
export function brandGlyph(brand: Brand): BrandGlyph {
  return { viewBox: "0 0 24 24", paths: [{ d: brand.path }] };
}

/** How a repository link looks: its name and the icon in front of it. */
export interface RepositoryLink {
  /** `GitHub`, `GitLab`, or `Repository` when the host has no logo here. */
  name: string;
  /** A value for `Icon`: a brand logo for a host that has one, else a lucide icon. */
  icon: string;
}

const HOSTS: Record<string, RepositoryLink> = {
  "github.com": { name: "GitHub", icon: "brand:github" },
  "gitlab.com": { name: "GitLab", icon: "brand:gitlab" },
};

/** The name and icon for the repository button, from the host of the repository URL. */
export function repositoryLink(url: string): RepositoryLink {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return HOSTS[host] ?? { name: "Repository", icon: "git-branch" };
  } catch {
    return { name: "Repository", icon: "git-branch" };
  }
}

/** Every `icon` value the config uses, in order. */
export function configIcons(config: { features: readonly { icon: string }[] }): string[] {
  return config.features.map((feature) => feature.icon);
}
