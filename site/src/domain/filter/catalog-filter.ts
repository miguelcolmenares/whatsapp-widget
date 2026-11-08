import { tagKey } from "./tags";

/** What a visitor asked for: tags, which a card must all have, and words, which a card must all contain. */
export interface FilterState {
  /** Tag keys, see `tagKey`. */
  tags: string[];
  /** The text of the field, as typed. */
  query: string;
}

/** A card, reduced to what the filter reads. */
export interface FilterItem {
  /** Tag keys of the card. */
  tags: readonly string[];
  /** The searchable text of the card, from `filterText`. */
  text: string;
}

/** A tag button: its key, the spelling to show, and how many cards have it. */
export interface TagOption {
  key: string;
  label: string;
  count: number;
}

/** No tag and no text: every card matches. */
export const EMPTY_FILTER: FilterState = { tags: [], query: "" };

/** Lowercase, without accents, with single spaces. The same reduction is applied to the cards and to the query. */
export function normalizeText(text: string): string {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/\s+/g, " ").trim();
}

/** The text a query is searched in: the title, the description and the tags of a card. */
export function filterText(card: {
  title: string;
  description: string;
  tags: readonly string[];
}): string {
  return normalizeText([card.title, card.description, ...card.tags].join(" "));
}

/** The words of a query. A card must contain every one of them. */
export function filterWords(query: string): string[] {
  const text = normalizeText(query);
  return text === "" ? [] : text.split(" ");
}

/** Whether a state narrows anything down. */
export function isFiltering(state: FilterState): boolean {
  return state.tags.length > 0 || filterWords(state.query).length > 0;
}

/** Whether a card is shown: it has every selected tag, and its text contains every word of the query. */
export function matchesFilter(item: FilterItem, state: FilterState): boolean {
  const has = new Set(item.tags);
  if (!state.tags.every((key) => has.has(key))) return false;
  return filterWords(state.query).every((word) => item.text.includes(word));
}

/**
 * Read the state from the query string of the address: `?tag=ui&tag=forms&q=card`. A repeated `tag` is
 * several tags, a tag is matched by its key, and a state that cannot be read is the empty state.
 */
export function parseFilterState(search: string): FilterState {
  const params = new URLSearchParams(search);
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const value of params.getAll("tag")) {
    const key = tagKey(value);
    if (key === "" || seen.has(key)) continue;
    seen.add(key);
    tags.push(key);
  }
  return { tags, query: params.get("q") ?? "" };
}

/** The query string for a state, with its `?`, or an empty string when nothing is selected. */
export function serializeFilterState(state: FilterState): string {
  const params = new URLSearchParams();
  for (const key of state.tags) params.append("tag", key);
  const query = state.query.trim();
  if (query !== "") params.set("q", query);
  const text = params.toString();
  return text === "" ? "" : `?${text}`;
}

/** The tag buttons for a set of cards: one per tag key, with the first spelling found, sorted by label. */
export function collectTags(cards: readonly { tags: readonly string[] }[]): TagOption[] {
  const options = new Map<string, TagOption>();
  for (const card of cards) {
    const counted = new Set<string>();
    for (const tag of card.tags) {
      const key = tagKey(tag);
      if (key === "" || counted.has(key)) continue;
      counted.add(key);
      const option = options.get(key);
      if (option) option.count += 1;
      else options.set(key, { key, label: tag, count: 1 });
    }
  }
  return [...options.values()].sort((a, b) => a.label.localeCompare(b.label, "en"));
}

/** The line the status region announces: how many cards are shown, and a plain sentence when none is. */
export function filterSummary(shown: number, total: number): string {
  const count = `${shown} of ${total} shown.`;
  return shown === 0 ? `Nothing matches this filter. ${count}` : count;
}
