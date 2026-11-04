/**
 * The script of the copy buttons. The server writes every button hidden, because without JavaScript it would do
 * nothing. This shows them, and one listener on the page copies the text of the code of the block that was
 * clicked: the text exactly as it is on the page, which has no `[!code ++]` comment, since the server took them out.
 * It shows the button only where the browser allows clipboard writes, and it makes no request.
 * After a copy the button and a polite status region say "Copied" for a moment.
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
        button.textContent = status.textContent = button.dataset.copied ?? "";
        clearTimeout(timers.get(button));
        timers.set(
          button,
          window.setTimeout(() => {
            button.textContent = button.dataset.copy ?? "";
            status.textContent = "";
          }, 1600),
        );
      },
      () => {},
    );
  });
}
