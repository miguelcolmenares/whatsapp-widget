#!/usr/bin/env node
// Generate src/styles/tokens.css from design/tokens.json, in the folder you run it from (the site folder).
// The JSON is the source of truth. Run with --check to fail when the CSS is out of date.
// The dark set (the top-level groups) goes under `:root`. The light set (`themes.light.color`)
// goes under `:root[data-theme="light"]`, and under a media query for a page that has no
// `data-theme` attribute, which is what a visitor without JavaScript gets with `theme.default` "system".
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

/** The lines `--sk-<name>: <value>;` of one group of tokens. */
export const declarations = (group, values) =>
  Object.entries(values).map(
    ([name, value]) => `  --sk-${group === "color" ? "" : `${group}-`}${name}: ${value};`,
  );

/** Fail when a key is in one color set and not in the other, so a theme can never miss a token. */
export function checkThemeParity(tokens) {
  const dark = Object.keys(tokens.color ?? {});
  const light = Object.keys(tokens.themes?.light?.color ?? {});
  const onlyDark = dark.filter((key) => !light.includes(key));
  const onlyLight = light.filter((key) => !dark.includes(key));
  if (onlyDark.length || onlyLight.length)
    throw new Error(
      `The light and dark color sets differ. Only in dark: ${onlyDark.join(", ") || "none"}. Only in light: ${onlyLight.join(", ") || "none"}.`,
    );
}

/** The text of tokens.css for a tokens object. */
export function renderTokens(tokens) {
  checkThemeParity(tokens);
  const { themes, ...dark } = tokens;
  const light = themes.light.color;
  const lines = [
    "/* Generated from design/tokens.json by scripts/build-tokens.mjs. Do not edit. */",
    ":root {",
  ];
  for (const [group, values] of Object.entries(dark)) lines.push(...declarations(group, values));
  lines.push("}", ':root[data-theme="light"] {', ...declarations("color", light), "}");
  lines.push(
    "@media (prefers-color-scheme: light) {",
    ':root:not([data-theme="dark"]) {',
    ...declarations("color", light),
    "}",
    "}",
    "",
  );
  return lines.join("\n");
}

/** Write the CSS, or with `--check` compare it with the file and exit with 1 when they differ. */
function main(argv, folder) {
  const tokens = JSON.parse(readFileSync(join(folder, "design", "tokens.json"), "utf8"));
  const target = join(folder, "src", "styles", "tokens.css");
  const css = renderTokens(tokens);
  if (argv.includes("--check")) {
    let current = "";
    try {
      current = readFileSync(target, "utf8");
    } catch {
      // a missing file counts as out of date
    }
    if (current !== css) {
      console.error("src/styles/tokens.css is out of date. Run `npm run build:tokens`.");
      process.exit(1);
    }
    return;
  }
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, css);
  console.log("Wrote src/styles/tokens.css");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main(process.argv.slice(2), process.cwd());
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
