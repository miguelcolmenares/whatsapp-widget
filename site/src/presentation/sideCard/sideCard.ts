/**
 * Make the card of a detail page collapsible on a phone. The card's markup carries the rest: `SideCard` marks what a
 * phone hides with `data-extra`, and its style hides it while `data-js` is on the card and `data-expanded` is not.
 * The button is hidden in the HTML, so a visitor without JavaScript sees the whole card and no dead control.
 *
 * `data-js` is set here and again by a one line inline script right after the card, so the card is collapsed in the
 * first paint and nothing moves when this module loads.
 */
export function attachSideCard(root: HTMLElement): void {
  const toggle = root.querySelector<HTMLButtonElement>("[data-side-card-toggle]");
  if (!toggle) return;
  root.dataset.js = "";
  toggle.hidden = false;
  const sync = () => toggle.setAttribute("aria-expanded", String("expanded" in root.dataset));
  sync();
  toggle.addEventListener("click", () => {
    if ("expanded" in root.dataset) delete root.dataset.expanded;
    else root.dataset.expanded = "";
    sync();
  });
}
