/** Wire native example controls without reading or modifying the isolated frame's document. */
for (const host of document.querySelectorAll<HTMLElement>("[data-demo-preview]")) {
  const frame = host.querySelector<HTMLIFrameElement>("[data-demo-frame]")!;
  const variant = host.querySelector<HTMLSelectElement>("[data-demo-variant]");
  const viewport = host.querySelector<HTMLSelectElement>("[data-demo-viewport]");
  const controls = host.querySelector<HTMLElement>("[data-demo-controls]")!;
  if (variant || viewport) controls.hidden = false;
  variant?.addEventListener("change", () => {
    const option = variant.selectedOptions[0]!;
    frame.src = option.dataset.preview!;
    frame.title = `${option.dataset.title} preview`;
    for (const panel of host.querySelectorAll<HTMLElement>("[data-demo-sources]"))
      panel.hidden = panel.dataset.demoSources !== variant.value;
  });
  viewport?.addEventListener("change", () => {
    frame.style.width = viewport.value ? `${viewport.value}px` : "100%";
    frame.height = viewport.selectedOptions[0]!.dataset.height!;
  });
}
