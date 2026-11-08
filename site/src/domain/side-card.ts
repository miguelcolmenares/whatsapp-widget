import { resolveLink } from "./links";
import type { LinkContext } from "./links";
import { normalizeTags } from "./filter";

/** One line of the card: what it is, and its value. */
export interface CardRow {
  label: string;
  value: string;
}

/** A link of the card. */
export interface CardLink {
  label: string;
  href: string;
  /** Position of the item in the `links` list of the frontmatter, so a problem with the link points at its line. */
  item: number;
}

/** The side card of a detail page: metadata, links and tags. */
export interface SideCard {
  rows: CardRow[];
  links: CardLink[];
  tags: string[];
}

/**
 * A problem found while reading the card, with where it is in the frontmatter so `check` can point at it.
 * Its `kind` is the kind of finding it becomes: `card` for what the frontmatter got wrong, and `links` or
 * `excludedLinks` for a link that does not lead anywhere, the same two kinds the links in the text have.
 */
export interface CardProblem {
  kind: "card" | "links" | "excludedLinks";
  /** The frontmatter key the problem is under. */
  field: "meta" | "links";
  /** Position in the list, starting at 0, or null for the whole key. */
  index: number | null;
  /** The key that is not known, when the problem is an unknown key. */
  key: string | null;
  message: string;
}

/** The keys an item of `meta` and an item of `links` can have. Anything else is reported. */
export const CARD_KEYS = {
  meta: ["label", "value"],
  links: ["label", "href"],
} as const;

/** The schemes a link of the card can use. `javascript:` and `data:` never reach a page. */
const ALLOWED_SCHEMES = ["http:", "https:", "mailto:"];
const SCHEME = /^([a-z][a-z0-9+.-]*:)/i;

const escapePattern = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function text(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** An item of a list key that has both of its texts, and its position in the list. */
interface ListItem {
  item: number;
  values: Record<string, string>;
}

/**
 * Read the entries of a list key. An entry that is not an object, or that lacks a text for one of its
 * two keys, is dropped with a problem. An entry with a key the card does not know is kept and the key is
 * reported, so a typo such as `lable` shows up and does not hide a row.
 */
function readList(
  frontmatter: Record<string, unknown>,
  field: "meta" | "links",
  problems: CardProblem[],
): ListItem[] {
  const raw = frontmatter[field];
  if (raw === undefined || raw === null) return [];
  if (!Array.isArray(raw)) {
    problems.push({
      kind: "card",
      field,
      index: null,
      key: null,
      message: `"${field}" must be a list of items with ${CARD_KEYS[field].map((key) => `"${key}"`).join(" and ")}.`,
    });
    return [];
  }
  const [first, second] = CARD_KEYS[field];
  const items: ListItem[] = [];
  raw.forEach((entry: unknown, index) => {
    if (!isRecord(entry)) {
      problems.push({
        kind: "card",
        field,
        index,
        key: null,
        message: `Item ${index + 1} of "${field}" must have "${first}" and "${second}".`,
      });
      return;
    }
    for (const key of Object.keys(entry)) {
      if (!(CARD_KEYS[field] as readonly string[]).includes(key)) {
        problems.push({
          kind: "card",
          field,
          index,
          key,
          message: `Item ${index + 1} of "${field}" has the key "${key}", which the card does not read. It takes "${first}" and "${second}".`,
        });
      }
    }
    const a = text(entry[first]);
    const b = text(entry[second]);
    if (a === undefined || b === undefined) {
      const bad = a === undefined ? first : second;
      const hint =
        typeof entry[bad] === "number" || typeof entry[bad] === "boolean"
          ? " Write it in quotes to keep it as text."
          : "";
      problems.push({
        kind: "card",
        field,
        index,
        key: null,
        message: `Item ${index + 1} of "${field}" needs "${bad}" as text.${hint}`,
      });
      return;
    }
    items.push({ item: index, values: { [first]: a, [second]: b } });
  });
  return items;
}

/**
 * Read the side card from the frontmatter of a page: `meta` (a list of `label` and `value`), `links` (a list
 * of `label` and `href`) and `tags`. A page has a card when it has at least one valid row or link, so a page that
 * only has `tags`, for the filter bar of an index, does not change. The tags are shown in the card only then.
 */
export function readSideCard(frontmatter: Record<string, unknown>): {
  card: SideCard | null;
  problems: CardProblem[];
} {
  const problems: CardProblem[] = [];
  const rows = readList(frontmatter, "meta", problems).map(({ values }): CardRow => ({
    label: values.label!,
    value: values.value!,
  }));
  const links: CardLink[] = [];
  for (const { item, values } of readList(frontmatter, "links", problems)) {
    const href = values.href!;
    const scheme = SCHEME.exec(href)?.[1]?.toLowerCase();
    if ((scheme && !ALLOWED_SCHEMES.includes(scheme)) || href.startsWith("//")) {
      problems.push({
        kind: "card",
        field: "links",
        index: item,
        key: "href",
        message: `The link "${values.label}" uses "${href}". A link of the card is a page, a file of the repository, or an address that starts with http:, https: or mailto:.`,
      });
      continue;
    }
    links.push({ label: values.label!, href, item });
  }
  if (rows.length === 0 && links.length === 0) return { card: null, problems };
  return { card: { rows, links, tags: normalizeTags(frontmatter.tags) }, problems };
}

/**
 * Point the links of the card where the page's own links would go: a relative link to a page becomes its route,
 * one to a file of the repository becomes its address on the repository, and an address is left as it is.
 * A link to a file that does not exist, or is excluded from the site, is dropped and reported, as `links` or
 * `excludedLinks` like the same link in the text. A card with no row left and no link is dropped with them.
 */
export function resolveCardLinks(
  card: SideCard,
  context: LinkContext,
): { card: SideCard | null; problems: CardProblem[] } {
  const problems: CardProblem[] = [];
  const links: CardLink[] = [];
  for (const link of card.links) {
    const resolution = resolveLink(link.href, context);
    if (resolution.kind === "text-only" || resolution.kind === "missing") {
      problems.push({
        kind: resolution.kind === "missing" ? "links" : "excludedLinks",
        field: "links",
        index: link.item,
        key: "href",
        message: `Card link "${link.label}": ${resolution.warning}`,
      });
      continue;
    }
    links.push({ ...link, href: resolution.href });
  }
  if (card.rows.length === 0 && links.length === 0) return { card: null, problems };
  return { card: { ...card, links }, problems };
}

/**
 * The line of the file where a problem of the card is written, so `check` can point at it. `matter` is the
 * text between the `---` lines, and line 1 of the file is the opening `---`. The line is the one of the key the
 * problem names, else the one where its item begins, else the one of `meta` or `links`, else 1.
 */
export function cardProblemLine(matter: string, problem: CardProblem): number {
  const lines = matter.split(/\r?\n/);
  const indent = (line: string) => line.length - line.trimStart().length;
  const start = lines.findIndex((line) =>
    new RegExp(`^["']?${problem.field}["']?\\s*:`).test(line),
  );
  if (start === -1) return 1;
  let found = start;
  if (problem.index !== null) {
    // The list ends at the next line that is not indented and is not an item of the list itself.
    let end = start + 1;
    while (
      end < lines.length &&
      (lines[end]!.trim() === "" || indent(lines[end]!) > 0 || /^-(\s|$)/.test(lines[end]!))
    )
      end++;
    const starts: number[] = [];
    let level = -1;
    for (let at = start + 1; at < end; at++) {
      const line = lines[at]!;
      if (!/^\s*-(\s|$)/.test(line)) continue;
      if (level === -1) level = indent(line);
      if (indent(line) === level) starts.push(at);
    }
    const first = starts[problem.index];
    if (first !== undefined) {
      found = first;
      if (problem.key !== null) {
        const last = starts[problem.index + 1] ?? end;
        for (let at = first; at < last; at++) {
          const text = lines[at]!.replace(/^\s*(?:-\s*)?/, "");
          if (new RegExp(`^["']?${escapePattern(problem.key)}["']?\\s*:`).test(text)) {
            found = at;
            break;
          }
        }
      }
    }
  }
  return 1 + found;
}
