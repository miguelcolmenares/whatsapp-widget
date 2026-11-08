/* global clearTimeout, document, getComputedStyle, innerHeight, IntersectionObserver, localStorage, location, scrollY, window */
/*
 * The script of a documentation page, loaded only by the pages that have sidebars or an "On this page" list (the layout
 * writes the tag, with `defer`). It is kept out of the page script, so the copy buttons and the card keep their small
 * script. Without it both sidebars are shown, the buttons stay hidden and the list does not mark a section. Two parts:
 *
 * - The buttons that hide the docs menu and "On this page". The head script of the layout has already set
 *   `data-docs-menu` or `data-docs-toc` to "hidden" on <html> from the choice saved in the browser. This shows the
 *   buttons, keeps their name and `aria-expanded` in step with that attribute, and saves each click. With storage
 *   blocked the choice holds for the page only.
 * - "On this page" marks the section the reader is in. The headings are watched with `IntersectionObserver`, not a scroll
 *   listener. A one pixel band at the line (the `scroll-padding-top` of the page) catches a heading that scrolls past it,
 *   a band from the line to the bottom of the viewport catches a heading that a jump moves past it in one frame, and a
 *   one pixel mark at the end of the document says when the page cannot scroll further. On each callback the current
 *   heading is recomputed from the heading positions. A click, or a `#hash`, holds its link until the heading reaches
 *   the line, for at most 1.5 s. The list scrolls inside its own box with `scrollTo`, never with `scrollIntoView`.
 */

const HOLD_MS = 1500;

/**
 * Whether the value of a sidebar's attribute on <html> hides it.
 *
 * @param {string | null | undefined} value - The attribute's value, or null when it is not set.
 * @returns {boolean} True only for "hidden".
 */
export function isHidden(value) {
  return value === "hidden";
}

/**
 * The attribute on <html> that hides a sidebar.
 *
 * @param {"menu" | "toc"} name - The sidebar.
 * @returns {string} `data-docs-menu` or `data-docs-toc`.
 */
export function attributeOf(name) {
  return `data-docs-${name}`;
}

/**
 * The key in localStorage that keeps the choice of a sidebar. The head script of the layout reads it too.
 *
 * @param {"menu" | "toc"} name - The sidebar.
 * @returns {string} `docs-menu` or `docs-toc`.
 */
export function storageKey(name) {
  return `docs-${name}`;
}

/**
 * The accessible name of a sidebar's button: what a click does from the state the sidebar is in now.
 *
 * @param {"menu" | "toc"} name - The sidebar.
 * @param {boolean} expanded - True while the sidebar is shown.
 * @returns {string} "Hide the docs menu" or "Show the docs menu", and the same for the table of contents.
 */
export function labelFor(name, expanded) {
  const sidebar = name === "menu" ? "the docs menu" : "the table of contents";
  return `${expanded ? "Hide" : "Show"} ${sidebar}`;
}

/**
 * The heading that is current: the last one whose top has reached the line, or the last one at the bottom of the page.
 * Above the first heading that has reached the line nothing is current.
 *
 * @param {{ id: string, top: number }[]} headings - The headings in the order of the document.
 * @param {number} line - The distance from the top of the viewport at which a heading becomes current.
 * @param {boolean} atBottom - True when the page cannot scroll any further.
 * @returns {string | undefined} The id of the current heading, or undefined when none is.
 */
export function activeHeadingId(headings, line, atBottom) {
  if (atBottom) return headings.at(-1)?.id;
  let active;
  for (const heading of headings) {
    if (heading.top <= line) active = heading.id;
  }
  return active;
}

function remember(key, hide) {
  try {
    if (hide) localStorage.setItem(key, "hidden");
    else localStorage.removeItem(key);
  } catch {
    // Storage is blocked: the choice still holds on this page.
  }
}

/**
 * Wires the buttons `[data-sidebar-toggle]` of the page. Each button is shown, its name and `aria-expanded` follow the
 * attribute on <html>, and a click sets the attribute and saves the choice.
 *
 * @param {HTMLElement} [root] - The element that carries the attributes. The document element by default.
 */
export function attachSidebarToggles(root = document.documentElement) {
  document.querySelectorAll("[data-sidebar-toggle]").forEach((button) => {
    const name = button.dataset.sidebarToggle;
    if (name !== "menu" && name !== "toc") return;
    const attribute = attributeOf(name);
    const shown = () => !isHidden(root.getAttribute(attribute));
    const sync = () => {
      button.setAttribute("aria-expanded", String(shown()));
      button.setAttribute("aria-label", labelFor(name, shown()));
    };
    sync();
    button.hidden = false;
    button.addEventListener("click", () => {
      const hide = shown();
      if (hide) root.setAttribute(attribute, "hidden");
      else root.removeAttribute(attribute);
      remember(storageKey(name), hide);
      sync();
    });
  });
}

/**
 * Marks the link of `nav` that names the section on screen with `aria-current="location"`, and keeps it in view in the
 * list. A link whose target is missing from the page is left out.
 *
 * @param {HTMLElement} nav - The navigation of "On this page", whose links are `#` anchors of the headings.
 */
export function attachOnThisPage(nav) {
  const items = [...nav.querySelectorAll("a[href^='#']")].flatMap((link) => {
    const id = link.getAttribute("href").slice(1);
    const heading = document.getElementById(id);
    return heading ? [{ id, link, heading }] : [];
  });
  if (items.length === 0) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  // The mark at the end of the document. It is one pixel high and has no content, so it moves nothing.
  const end = document.createElement("div");
  end.setAttribute("aria-hidden", "true");
  end.style.height = "1px";
  document.body.append(end);

  let current;
  let hold;
  let headingWatch;
  let jumpWatch;
  let endWatch;

  // The line sits where the page puts a heading after a jump: `scroll-padding-top`, which the global styles set.
  const line = () => {
    const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
    return Number.isFinite(padding) ? padding + 1 : 77;
  };
  const atBottom = () => {
    const root = document.documentElement;
    return root.scrollHeight > innerHeight && scrollY + innerHeight >= root.scrollHeight - 2;
  };

  const keepInView = (link) => {
    if (nav.scrollHeight <= nav.clientHeight) return;
    const box = nav.getBoundingClientRect();
    const item = link.getBoundingClientRect();
    if (item.top >= box.top && item.bottom <= box.bottom) return;
    nav.scrollTo({
      top: nav.scrollTop + item.top - box.top - (box.height - item.height) / 2,
      behavior: reduceMotion.matches ? "auto" : "smooth",
    });
  };
  const show = (id) => {
    if (id === current) return;
    current = id;
    for (const item of items) {
      if (item.id === id) {
        item.link.setAttribute("aria-current", "location");
        keepInView(item.link);
      } else {
        item.link.removeAttribute("aria-current");
      }
    }
  };
  const update = () => {
    if (hold) {
      const target = items.find((item) => item.id === hold.id);
      // Still on the way to the heading: keep the link the reader chose.
      if (Math.abs(target.heading.getBoundingClientRect().top - line()) > 2) return;
      clearTimeout(hold.timer);
      hold = undefined;
    }
    show(
      activeHeadingId(
        items.map((item) => ({ id: item.id, top: item.heading.getBoundingClientRect().top })),
        line(),
        atBottom(),
      ),
    );
  };
  const holdOn = (id) => {
    if (hold) clearTimeout(hold.timer);
    show(id);
    hold = {
      id,
      timer: window.setTimeout(() => {
        hold = undefined;
        update();
      }, HOLD_MS),
    };
  };
  const observe = () => {
    headingWatch?.disconnect();
    jumpWatch?.disconnect();
    endWatch?.disconnect();
    const height = innerHeight;
    const lineAt = Math.round(line());
    // A band from the line down to the line plus one pixel: a heading that crosses the line enters or leaves it.
    headingWatch = new IntersectionObserver(update, {
      rootMargin: `-${lineAt}px 0px -${Math.max(0, height - lineAt - 1)}px 0px`,
    });
    // A heading that moves past the line in one jump (Page Down, a drag of the scroll bar) is in neither state of the
    // band above for a frame. This band is everything below the line, so a heading that was below it and is above it
    // now is seen.
    jumpWatch = new IntersectionObserver(update, { rootMargin: `-${lineAt}px 0px 0px 0px` });
    for (const item of items) {
      headingWatch.observe(item.heading);
      jumpWatch.observe(item.heading);
    }
    // The bottom one pixel of the viewport: the mark is in it when the page is at its end.
    endWatch = new IntersectionObserver(update, {
      rootMargin: `-${Math.max(0, height - 1)}px 0px 0px 0px`,
    });
    endWatch.observe(end);
  };

  for (const item of items) {
    item.link.addEventListener("click", () => holdOn(item.id));
  }
  const fromHash = items.find((item) => `#${item.id}` === location.hash);
  if (fromHash) holdOn(fromHash.id);
  observe();
  update();
  window.addEventListener("resize", () => {
    observe();
    update();
  });
}

if (typeof document !== "undefined") {
  attachSidebarToggles();
  const toc = document.querySelector("[data-on-this-page]");
  if (toc) attachOnThisPage(toc);
}
