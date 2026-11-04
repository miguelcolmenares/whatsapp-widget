import {
  filterSummary,
  isFiltering,
  matchesFilter,
  parseFilterState,
  serializeFilterState,
  tagKey,
} from "../../domain/filter";
import type { FilterState } from "../../domain/filter";

/** How long the status line waits after the last key, so a screen reader is not read a count per letter. */
const STATUS_DELAY = 300;

/** A card of the page, with what the filter needs to decide whether it is shown. */
interface Card {
  element: HTMLElement;
  tags: string[];
  text: string;
}

function readCard(element: HTMLElement): Card {
  let tags: string[] = [];
  try {
    const parsed: unknown = JSON.parse(element.dataset.filterTags ?? "[]");
    if (Array.isArray(parsed))
      tags = parsed.filter((tag): tag is string => typeof tag === "string");
  } catch {
    // A card whose tags cannot be read has none, and still takes part in the text search.
  }
  return { element, tags, text: element.dataset.filterText ?? "" };
}

/**
 * Make the filter bar work. The cards are already in the page, so nothing is fetched: a card that does not match
 * gets the `hidden` attribute, and a group with no card left is hidden with its heading. The state is the query
 * string of the address. A tag button adds a history entry, so the back button undoes it, and typing replaces the
 * current one. A tag in the address that no card has narrows to nothing, and the clear button is the way out.
 * The bar is shown by an inline script at its own place, so this module only wires it.
 */
export function attachCatalogFilter(root: HTMLElement): void {
  const input = root.querySelector<HTMLInputElement>("[data-filter-input]")!;
  const status = root.querySelector<HTMLElement>("[data-filter-status]")!;
  const clear = root.querySelector<HTMLButtonElement>("[data-filter-clear]")!;
  const buttons = [...root.querySelectorAll<HTMLButtonElement>("[data-filter-tag]")];
  const cards = [...document.querySelectorAll<HTMLElement>("[data-filter-item]")].map(readCard);
  const groups = [...document.querySelectorAll<HTMLElement>("[data-filter-group]")];

  let state: FilterState = parseFilterState(window.location.search);
  let timer: number | undefined;

  const announce = () => {
    window.clearTimeout(timer);
    const shown = cards.filter((card) => !card.element.hidden).length;
    status.textContent = filterSummary(shown, cards.length);
    clear.hidden = !isFiltering(state);
  };

  const apply = () => {
    for (const card of cards) card.element.hidden = !matchesFilter(card, state);
    for (const group of groups) {
      group.hidden = ![...group.querySelectorAll<HTMLElement>("[data-filter-item]")].some(
        (element) => !element.hidden,
      );
    }
    for (const button of buttons) {
      button.setAttribute("aria-pressed", String(state.tags.includes(button.dataset.filterTag!)));
    }
    if (input.value !== state.query) input.value = state.query;
    clear.hidden = !isFiltering(state);
  };

  const address = () =>
    `${window.location.pathname}${serializeFilterState(state)}${window.location.hash}`;

  apply();
  announce();

  for (const button of buttons) {
    button.addEventListener("click", () => {
      const key = tagKey(button.dataset.filterTag!);
      state = {
        ...state,
        tags: state.tags.includes(key)
          ? state.tags.filter((tag) => tag !== key)
          : [...state.tags, key],
      };
      history.pushState(null, "", address());
      apply();
      announce();
    });
  }

  input.addEventListener("input", () => {
    state = { ...state, query: input.value };
    history.replaceState(null, "", address());
    apply();
    window.clearTimeout(timer);
    timer = window.setTimeout(announce, STATUS_DELAY);
  });

  clear.addEventListener("click", () => {
    state = { tags: [], query: "" };
    history.pushState(null, "", address());
    apply();
    announce();
    input.focus();
  });

  window.addEventListener("popstate", () => {
    state = parseFilterState(window.location.search);
    apply();
    announce();
  });
}
