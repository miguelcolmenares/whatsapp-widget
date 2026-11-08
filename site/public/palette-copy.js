/* global clearTimeout, document, navigator, window */
/*
 * The script of the color palette, loaded only by a page that has one (the page writes the tag). Without it the palette
 * shows its colors and values and its copy buttons stay hidden. This shows the buttons where the browser allows clipboard
 * writes, and one listener on the page copies the value of the button that was clicked. After a copy the button says
 * "Copied" for a moment, and the polite status region of the palette says the value, its token and its set, so a screen
 * reader hears the result. A failed copy is announced the same way. It makes no request.
 */
if (navigator.clipboard) {
  const timers = new WeakMap();
  document.querySelectorAll(".palette-copy").forEach((button) => {
    button.hidden = false;
  });
  document.addEventListener("click", (event) => {
    const button = event.target.closest(".palette-copy");
    const status = button?.closest("[data-color-palette]")?.querySelector(".palette-status");
    const value = button?.dataset.paletteCopy;
    const name = button?.dataset.paletteName ?? "";
    if (!button || !value || !status) return;
    status.textContent = "";
    navigator.clipboard.writeText(value).then(
      () => {
        button.textContent = button.dataset.copied ?? "";
        status.textContent = `Copied ${name}`;
        clearTimeout(timers.get(button));
        timers.set(
          button,
          window.setTimeout(() => {
            button.textContent = button.dataset.copy ?? "";
          }, 1600),
        );
      },
      () => {
        status.textContent = `Could not copy ${name}`;
      },
    );
  });
}
