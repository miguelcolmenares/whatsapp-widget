import type { SearchIndex, SearchPage } from "./searchIndex";

/** A piece of a page's text to show under a result, with the ranges to mark. */
export interface SearchSnippet {
  text: string;
  /** Ranges of `text` that match a word of the query, in order and without overlap. */
  marks: { start: number; end: number }[];
  /** True when the text starts in the middle of the page, so a reader sees an ellipsis. */
  leading: boolean;
  /** True when the text stops before the end of the page. */
  trailing: boolean;
}

/** One result: a page, the section of it that matched, and a snippet of that section. */
export interface SearchHit {
  /** Address of the page, with `#anchor` added when the result is a section of it. */
  url: string;
  title: string;
  collection: string;
  /** Heading of the matching section, or "" for the top of the page. */
  heading: string;
  /** Anchor of the matching section, or "" when there is none, so the link goes to the top of the page. */
  anchor: string;
  snippet: SearchSnippet;
  score: number;
}

/**
 * Weight of a word of the query, by where it is found. A word that starts a word of a title beats a word
 * inside a title, a title beats a heading, a heading beats the description, and the description beats the body.
 * Each place has a prefix and a substring weight.
 */
const WEIGHT = {
  title: { prefix: 100, substring: 60 },
  heading: { prefix: 50, substring: 30 },
  description: { prefix: 25, substring: 12 },
  body: { prefix: 10, substring: 5 },
} as const;

/** How many words of a query count. Longer queries are cut, so a pasted paragraph stays cheap. */
const MAX_WORDS = 8;
/** Characters in which the words of a query are counted together, to find where they cluster in a page. */
const CLUSTER = 160;
/** Occurrences considered per page. A word such as "the" can appear hundreds of times in a long page. */
const MAX_OCCURRENCES = 2000;
/** Characters of text kept before and after the first match in a snippet. */
const BEFORE = 48;
const AFTER = 112;

/** The words of a query: letters and digits, case ignored. */
export function queryWords(query: string): string[] {
  return (query.match(/[\p{L}\p{N}]+/gu) ?? [])
    .slice(0, MAX_WORDS)
    .map((word) => word.toLowerCase());
}

const escapeWord = (word: string) => word.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");

/** Every place a word occurs in a text: where it starts, how long the match is, and whether it starts a word. */
function occurrences(
  text: string,
  word: string,
): { index: number; length: number; starts: boolean }[] {
  const found: { index: number; length: number; starts: boolean }[] = [];
  for (const match of text.matchAll(new RegExp(escapeWord(word), "giu"))) {
    const at = match.index!;
    found.push({
      index: at,
      length: match[0].length,
      starts: at === 0 || !/[\p{L}\p{N}]/u.test(text[at - 1]!),
    });
  }
  return found;
}

/** The weight a word earns in one text: a word start beats a substring, and the first occurrence wins. */
function fieldMatch(text: string, word: string, weight: { prefix: number; substring: number }) {
  const found = occurrences(text, word);
  if (found.length === 0) return null;
  const prefix = found.find((candidate) => candidate.starts);
  return prefix
    ? { score: weight.prefix, index: prefix.index }
    : { score: weight.substring, index: found[0]!.index };
}

/**
 * The place in a text where the most distinct query words sit together. Among the places with the same number
 * of words, the one that covers them in the shortest span wins, then the earliest. A phrase therefore beats the
 * same words spread over a paragraph, and one common word such as "the" cannot pull the match to the top of a page.
 */
function clusterAt(text: string, words: readonly string[]): number | undefined {
  const found = words
    .flatMap((word) => occurrences(text, word).map((match) => ({ index: match.index, word })))
    .sort((a, b) => a.index - b.index)
    .slice(0, MAX_OCCURRENCES);
  let best: { index: number; count: number; span: number } | undefined;
  for (let start = 0; start < found.length; start++) {
    const seen = new Set<string>();
    let span = 0;
    for (
      let end = start;
      end < found.length && found[end]!.index - found[start]!.index < CLUSTER;
      end++
    ) {
      if (seen.has(found[end]!.word)) continue;
      seen.add(found[end]!.word);
      span = found[end]!.index - found[start]!.index;
    }
    const candidate = { index: found[start]!.index, count: seen.size, span };
    if (
      !best ||
      candidate.count > best.count ||
      (candidate.count === best.count && candidate.span < best.span)
    ) {
      best = candidate;
    }
  }
  return best?.index;
}

/** The last heading that starts at or before a position, which is the section that holds it. */
function sectionAt(page: SearchPage, position: number) {
  let section: SearchPage["headings"][number] | undefined;
  for (const heading of page.headings) {
    if (heading.offset <= position) section = heading;
    else break;
  }
  return section;
}

/** A piece of text around a position, cut at spaces where it can be, with every query word in it marked. */
function snippetAround(text: string, position: number, words: readonly string[]): SearchSnippet {
  let start = Math.max(0, position - BEFORE);
  let end = Math.min(text.length, position + AFTER);
  if (start > 0) {
    const space = text.indexOf(" ", start);
    if (space !== -1 && space - start < 16) start = space + 1;
  }
  if (end < text.length) {
    const space = text.lastIndexOf(" ", end);
    if (space > position && end - space < 16) end = space;
  }
  const raw = text.slice(start, end);
  const ranges: { start: number; end: number }[] = [];
  for (const word of words) {
    for (const { index, length } of occurrences(raw, word)) {
      ranges.push({ start: index, end: index + length });
    }
  }
  ranges.sort((a, b) => a.start - b.start);
  const marks: { start: number; end: number }[] = [];
  for (const range of ranges) {
    const last = marks[marks.length - 1];
    if (last && range.start <= last.end) last.end = Math.max(last.end, range.end);
    else marks.push({ ...range });
  }
  return {
    text: raw.replace(/\s/g, " "),
    marks,
    leading: start > 0,
    trailing: end < text.length,
  };
}

/** Score one page for the query words. A page must contain every word, or it is not a result. */
function scorePage(page: SearchPage, words: readonly string[]): SearchHit | null {
  let score = 0;
  let bestHeading: { score: number; section: SearchPage["headings"][number] } | undefined;

  for (const word of words) {
    let best = fieldMatch(page.title, word, WEIGHT.title)?.score ?? 0;

    for (const section of page.headings) {
      const match = fieldMatch(section.text, word, WEIGHT.heading);
      if (!match) continue;
      if (!bestHeading || match.score > bestHeading.score)
        bestHeading = { score: match.score, section };
      best = Math.max(best, match.score);
    }

    const described = fieldMatch(page.description, word, WEIGHT.description);
    if (described) best = Math.max(best, described.score);

    const body = fieldMatch(page.text, word, WEIGHT.body);
    if (body) best = Math.max(best, body.score);

    if (best === 0) return null;
    score += best;
  }

  const bodyAt = clusterAt(page.text, words);
  const descriptionAt = clusterAt(page.description, words);

  // The section to show: where the words cluster in the body, else the heading that matched, else the
  // description, else the top of the page.
  let position = 0;
  let section: SearchPage["headings"][number] | undefined;
  let source = page.text;
  if (bodyAt !== undefined) {
    position = bodyAt;
    section = sectionAt(page, bodyAt);
  } else if (bestHeading) {
    section = bestHeading.section;
    position = section.offset;
  } else if (descriptionAt !== undefined) {
    position = descriptionAt;
    source = page.description;
  }

  return {
    url: section?.id ? `${page.url}#${section.id}` : page.url,
    title: page.title,
    collection: page.collection,
    heading: section?.text ?? "",
    anchor: section?.id ?? "",
    snippet: snippetAround(source, position, words),
    score,
  };
}

/**
 * Search the index. Each word of the query must match somewhere on a page, as the start of a word or inside one,
 * ignoring case. The best place a word matches sets its weight: title, then heading, then body. Results are sorted
 * by score, then by title and address, so equal results keep a fixed order. An empty query has no results.
 */
export function searchPages(index: SearchIndex, query: string, limit = 50): SearchHit[] {
  const words = [...new Set(queryWords(query))];
  if (words.length === 0) return [];
  return index.pages
    .map((page) => scorePage(page, words))
    .filter((hit): hit is SearchHit => hit !== null)
    .sort(
      (a, b) => b.score - a.score || a.title.localeCompare(b.title) || a.url.localeCompare(b.url),
    )
    .slice(0, limit);
}
