import { searchPages } from "../../domain/search";
import type { SearchHit, SearchIndex } from "../../domain/search";

/** What the trigger needs from the dialog once it has loaded: a way to open it. */
export interface SearchController {
  open(): void;
}

const IDLE = "Type to search the docs.";

/**
 * Wire the search dialog to its markup. It is loaded on demand, by the first focus of the search button or the
 * first open, and it fetches the index once, from the site's own address. The combobox follows the WAI-ARIA
 * pattern: the input owns the list, and the active result is named by `aria-activedescendant`.
 */
export function attachSearch(dialog: HTMLDialogElement): SearchController {
  const input = dialog.querySelector<HTMLInputElement>("[data-search-input]")!;
  const listbox = dialog.querySelector<HTMLElement>("[data-search-results]")!;
  const status = dialog.querySelector<HTMLElement>("[data-search-status]")!;
  const close = dialog.querySelector<HTMLButtonElement>("[data-search-close]")!;
  const indexUrl = dialog.dataset.indexUrl ?? "search-index.json";

  let index: Promise<SearchIndex> | undefined;
  let hits: SearchHit[] = [];
  let flat: SearchHit[] = [];
  let active = 0;
  let opener: HTMLElement | null = null;

  const loadIndex = (): Promise<SearchIndex> => {
    index ??= fetch(indexUrl).then((response) => {
      if (!response.ok) throw new Error(`search-index.json answered ${response.status}`);
      return response.json() as Promise<SearchIndex>;
    });
    return index;
  };

  const setActive = (position: number) => {
    if (flat.length === 0) {
      input.removeAttribute("aria-activedescendant");
      return;
    }
    active = (position + flat.length) % flat.length;
    for (const option of listbox.querySelectorAll<HTMLElement>("[role=option]")) {
      const selected = option.id === optionId(active);
      option.setAttribute("aria-selected", String(selected));
      if (selected) option.scrollIntoView({ block: "nearest" });
    }
    input.setAttribute("aria-activedescendant", optionId(active));
  };

  const optionId = (position: number) => `search-option-${position}`;

  const go = (hit: SearchHit) => {
    dialog.close();
    window.location.assign(hit.url);
  };

  /** One group per collection, in the order the index lists them, each with its results. */
  const render = (index: SearchIndex) => {
    listbox.replaceChildren();
    flat = [];
    const groups = new Map<string, SearchHit[]>();
    for (const id of Object.keys(index.collections)) groups.set(id, []);
    for (const hit of hits) groups.get(hit.collection)?.push(hit);

    for (const [id, group] of groups) {
      if (group.length === 0) continue;
      const labelId = `search-group-${id}`;
      const section = document.createElement("div");
      section.setAttribute("role", "group");
      section.setAttribute("aria-labelledby", labelId);
      const label = document.createElement("div");
      label.id = labelId;
      label.setAttribute("role", "presentation");
      label.className =
        "px-3 pt-3 pb-1 font-mono text-[11px] tracking-[0.14em] text-fg-dim uppercase";
      label.textContent = index.collections[id] ?? id;
      section.append(label);
      for (const hit of group) {
        section.append(option(hit, flat.length));
        flat.push(hit);
      }
      listbox.append(section);
    }
    input.setAttribute("aria-expanded", String(flat.length > 0));
    if (flat.length > 0) setActive(0);
    else input.removeAttribute("aria-activedescendant");
  };

  const option = (hit: SearchHit, position: number): HTMLElement => {
    const element = document.createElement("div");
    element.id = optionId(position);
    element.setAttribute("role", "option");
    element.setAttribute("aria-selected", "false");
    element.className =
      "flex min-h-11 cursor-pointer flex-col justify-center gap-0.5 rounded-md px-3 py-2 aria-selected:bg-surface-2";
    element.addEventListener("mousemove", () => {
      if (active !== position) setActive(position);
    });
    element.addEventListener("click", () => go(hit));

    const head = document.createElement("span");
    head.className = "flex min-w-0 flex-wrap items-baseline gap-x-2 text-sm";
    const title = document.createElement("span");
    title.className = "font-medium text-fg-bright";
    title.textContent = hit.title;
    head.append(title);
    if (hit.heading) {
      const heading = document.createElement("span");
      heading.className = "min-w-0 text-fg-muted";
      heading.textContent = `› ${hit.heading}`;
      head.append(heading);
    }
    element.append(head);

    const snippet = document.createElement("span");
    snippet.className = "text-xs leading-relaxed text-fg-muted";
    const { text, marks, leading, trailing } = hit.snippet;
    if (leading) snippet.append("… ");
    let offset = 0;
    for (const mark of marks) {
      snippet.append(text.slice(offset, mark.start));
      const highlighted = document.createElement("mark");
      highlighted.className =
        "rounded-sm bg-brand/25 px-0.5 text-fg-bright underline decoration-brand underline-offset-2";
      highlighted.textContent = text.slice(mark.start, mark.end);
      snippet.append(highlighted);
      offset = mark.end;
    }
    snippet.append(text.slice(offset));
    if (trailing) snippet.append(" …");
    element.append(snippet);
    return element;
  };

  const search = async () => {
    const query = input.value;
    const data = await loadIndex().catch(() => null);
    if (!data) {
      status.textContent = "Search is not available right now.";
      return;
    }
    if (query.trim() === "") {
      hits = [];
      listbox.replaceChildren();
      flat = [];
      input.setAttribute("aria-expanded", "false");
      status.textContent = IDLE;
      return;
    }
    hits = searchPages(data, query);
    render(data);
    status.textContent =
      flat.length === 0
        ? `No results for "${query}".`
        : `${flat.length} ${flat.length === 1 ? "result" : "results"}.`;
  };

  input.addEventListener("input", () => void search());
  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive(active + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(active - 1);
    } else if (event.key === "Home" && flat.length > 0) {
      event.preventDefault();
      setActive(0);
    } else if (event.key === "End" && flat.length > 0) {
      event.preventDefault();
      setActive(flat.length - 1);
    } else if (event.key === "Enter") {
      const hit = flat[active];
      if (!hit) return;
      event.preventDefault();
      go(hit);
    }
  });

  close.addEventListener("click", () => dialog.close());
  // A click on the backdrop is a click on the dialog itself, since its content fills the panel.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  // Escape closes the dialog natively; the focus goes back to whatever opened it.
  dialog.addEventListener("close", () => {
    opener?.focus();
    opener = null;
  });

  return {
    open() {
      if (dialog.open) {
        input.focus();
        return;
      }
      opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
      input.focus();
      input.select();
      void loadIndex().catch(() => undefined);
      if (input.value.trim() === "") status.textContent = IDLE;
      else void search();
    },
  };
}
