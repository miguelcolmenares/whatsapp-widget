/**
 * The script of the copy buttons. The server writes every button hidden, because without JavaScript it would do
 * nothing. This shows them, and one listener on the page copies the text of the code of the block that was
 * clicked: the text exactly as it is on the page, which has no `[!code ++]` comment, since the server took them out.
 * It shows the button only where the browser allows clipboard writes, and it makes no request.
 * After a copy the button is named "Copied" and shows its check icon (`data-state="copied"`), and a polite status
 * region says "Copied", for a moment. The names come from the `data-copy` and `data-copied` attributes.
 */
if (navigator.clipboard) {
  const timers = new WeakMap<Element, number>();
  document.querySelectorAll<HTMLButtonElement>(".copy-code").forEach((button) => {
    button.hidden = false;
  });
  document.addEventListener("click", (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>(".copy-code");
    const block = button?.closest(".code-block");
    const code = block?.querySelector("code");
    const status = block?.querySelector(".code-status");
    if (!button || !code || !status) return;
    status.textContent = "";
    navigator.clipboard.writeText(code.textContent ?? "").then(
      () => {
        button.setAttribute("aria-label", button.dataset.copied ?? "");
        button.dataset.state = "copied";
        status.textContent = button.dataset.copied ?? "";
        clearTimeout(timers.get(button));
        timers.set(
          button,
          window.setTimeout(() => {
            button.setAttribute("aria-label", button.dataset.copy ?? "");
            delete button.dataset.state;
            status.textContent = "";
          }, 1600),
        );
      },
      () => {},
    );
  });
}
