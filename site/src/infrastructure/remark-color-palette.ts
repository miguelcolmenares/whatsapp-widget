import { COLOR_PALETTE_MARKER, colorPalette } from "@/domain";
import type { PaletteEntry, PaletteGroup, TokenColors } from "@/domain";

interface Node {
  type: string;
  value?: string;
  children?: Node[];
  data?: object;
}

/** An mdast node that the renderer turns into the HTML element `tag`, through `data.hName`. */
const element = (tag: string, properties: Record<string, unknown>, children: Node[]): Node => ({
  type: "palette",
  children,
  data: { hName: tag, hProperties: properties },
});
const text = (value: string): Node => ({ type: "text", value });

/**
 * One value of a token: a chip in the color, its set and hex code under it, and a copy button. The chip is drawn with
 * the value read from the token file, so it cannot disagree with it. The button is hidden here, because without
 * JavaScript it would do nothing: the page script shows it, as it shows the copy buttons of the code blocks.
 */
function valueNode(entry: PaletteEntry, set: "dark" | "light"): Node {
  const value = entry[set];
  const setName = set === "dark" ? "Dark" : "Light";
  const name = `${value}, ${entry.name}, ${set}`;
  return element("div", { className: ["palette-item"] }, [
    element(
      "div",
      { className: ["palette-chip"], style: `background-color: ${value}`, ariaHidden: "true" },
      [],
    ),
    element("p", { className: ["palette-value"] }, [
      element("span", { className: ["palette-set"] }, [text(setName)]),
      element("code", {}, [text(value)]),
    ]),
    element(
      "button",
      {
        type: "button",
        className: ["palette-copy"],
        ariaLabel: `Copy ${name}`,
        dataPaletteCopy: value,
        dataPaletteName: name,
        dataCopy: "Copy",
        dataCopied: "Copied",
        hidden: true,
      },
      [text("Copy")],
    ),
  ]);
}

/** A token with its two values side by side, and its name on top. */
function tokenNode(entry: PaletteEntry): Node {
  return element("li", { className: ["palette-token"] }, [
    element("p", { className: ["palette-name"] }, [element("code", {}, [text(entry.name)])]),
    element("div", { className: ["palette-pair"] }, [
      valueNode(entry, "dark"),
      valueNode(entry, "light"),
    ]),
  ]);
}

/**
 * The whole palette: one block with a polite status region for the copy messages, then a group per title. The block
 * loads its script itself, from the site's base, so only a page with a palette downloads it.
 */
function paletteNode(groups: PaletteGroup[], base: string): Node {
  return element("div", { className: ["color-palette"], dataColorPalette: "" }, [
    element("script", { type: "module", src: `${base}palette-copy.js` }, []),
    element("p", { className: ["palette-status"], role: "status" }, []),
    ...groups.map((group) =>
      element("section", { className: ["palette-group"] }, [
        element("h3", { className: ["palette-title"] }, [text(group.title)]),
        element("ul", { className: ["palette-list"] }, group.entries.map(tokenNode)),
      ]),
    ),
  ]);
}

/**
 * Remark plugin: a line that holds only `<!-- sitekit:color-palette -->` becomes the color palette of the site, read
 * from its `design/tokens.json`. GitHub hides the comment, so the same file reads there as a page with its tables.
 * Any other HTML is left as it is. A page that asks for the palette in a site with no tokens fails the build.
 */
export function remarkColorPalette(options: { tokens?: TokenColors; base: string }) {
  const visit = (node: Node) => {
    if (!node.children) return;
    node.children = node.children.map((child) => {
      if (child.type === "html" && child.value?.trim() === COLOR_PALETTE_MARKER) {
        if (!options.tokens)
          throw new Error(
            `A page asks for the color palette, but this site has no design/tokens.json to read it from.`,
          );
        return paletteNode(colorPalette(options.tokens), options.base);
      }
      visit(child);
      return child;
    });
  };
  return (tree: Node) => visit(tree);
}
