---
title: Files and the CDN
description: "The two files the widget loads from the CDN, which version you get, and what is in the repository."
order: 4
---

# Files and the CDN

The widget is two files, and both are served by [jsDelivr](https://www.jsdelivr.com/package/gh/miguelcolmenares/whatsapp-widget) from the `dist/` folder of the repository:

| File                                                                                    | What it is                                              |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `https://cdn.jsdelivr.net/gh/miguelcolmenares/whatsapp-widget/dist/js/whatsapp-widget.js`  | The widget. This is the one the snippet adds to your page. |
| `https://cdn.jsdelivr.net/gh/miguelcolmenares/whatsapp-widget/dist/css/whatsapp-widget.css` | Its styles. The widget loads them by itself, you do not add them. |

The fonts of the icons are in `dist/fonts/`.

## Which version you get

The address in the snippet has no version, and jsDelivr answers it with the **latest release** of the repository. A change that is on the `main` branch reaches that address when a new release is made. To try the code of the branch before that, put `@main` after the repository name in the address of the widget file, for example `.../gh/miguelcolmenares/whatsapp-widget@main/dist/js/whatsapp-widget.js`. The widget loads its styles from the address without a version, so the styles are those of the latest release.

## What the page makes

Your page makes requests to the CDN for the widget file, then for the styles. The widget draws itself after the styles are loaded. If the styles cannot be loaded, the widget is not drawn and the console shows `Error loading stylesheet`.

## The repository

- `src/` is the source of the widget.
- `dist/` is the built widget. It is committed to the repository, because the CDN reads it from there. A workflow builds it and commits it on every push to `main`.
- `site/` and `docs/` are this documentation site, and the configurator.
