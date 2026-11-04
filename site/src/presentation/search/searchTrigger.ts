import type { SearchController } from "./searchDialog";

/**
 * The small script every page with search carries. It does not search: it waits for the first focus of a search
 * button or the first shortcut, then loads the dialog module, which loads the index. Until then a page costs
 * this listener and nothing else.
 */
const dialog = document.querySelector<HTMLDialogElement>("[data-search-dialog]");

if (dialog) {
  let controller: Promise<SearchController> | undefined;
  const ready = () =>
    (controller ??= import("./searchDialog").then((module) => module.attachSearch(dialog)));
  const open = () => void ready().then((search) => search.open());

  // The shortcut label follows the platform, decided after the page loads, so the header does not change width.
  const platform =
    (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ??
    navigator.platform ??
    "";
  const label = /Mac|iPhone|iPad|iPod/i.test(platform) ? "⌘K" : "Ctrl K";
  for (const key of document.querySelectorAll("[data-search-key]")) key.textContent = label;

  for (const button of document.querySelectorAll<HTMLButtonElement>("[data-search-open]")) {
    button.addEventListener("focus", () => void ready());
    button.addEventListener("click", open);
  }

  const typing = (target: EventTarget | null) =>
    target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

  document.addEventListener("keydown", (event) => {
    if (
      event.key.toLowerCase() === "k" &&
      (event.metaKey || event.ctrlKey) &&
      !event.altKey &&
      !event.shiftKey
    ) {
      event.preventDefault();
      open();
    } else if (
      event.key === "/" &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.altKey &&
      !typing(event.target)
    ) {
      event.preventDefault();
      open();
    }
  });
}
