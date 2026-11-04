import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { configIcons, parseCustomSvg, parseIconName } from "../domain";
import type { BrandGlyph, SiteConfig } from "../domain";

/** The folder of the site, next to `sitekit.config.json`, where `brand:custom/<name>` reads `<name>.svg`. */
export const CUSTOM_BRANDS_DIR = "brands";

/**
 * Read the custom logos the config uses, keyed by the icon value (`brand:custom/my-logo`). A name with
 * no file fails the build and lists the files that are there. Files nobody uses are not read.
 */
export function readCustomBrands(siteDir: string, config: SiteConfig): Record<string, BrandGlyph> {
  const used = [...new Set(configIcons(config))].flatMap((value) => {
    const ref = parseIconName(value);
    return ref?.kind === "custom" ? [{ value, name: ref.name }] : [];
  });
  const folder = join(siteDir, CUSTOM_BRANDS_DIR);
  const available = existsSync(folder)
    ? readdirSync(folder)
        .filter((file) => file.endsWith(".svg"))
        .map((file) => file.slice(0, -".svg".length))
        .sort()
    : [];
  const glyphs: Record<string, BrandGlyph> = {};
  for (const { value, name } of used) {
    if (!available.includes(name)) {
      throw new Error(
        `The icon "${value}" has no file: add ${CUSTOM_BRANDS_DIR}/${name}.svg to the site folder. ` +
          (available.length
            ? `Files there now: ${available.join(", ")}.`
            : `The folder ${CUSTOM_BRANDS_DIR}/ does not have any .svg file yet.`),
      );
    }
    const file = join(CUSTOM_BRANDS_DIR, `${name}.svg`);
    glyphs[value] = parseCustomSvg(readFileSync(join(siteDir, file), "utf8"), file);
  }
  return glyphs;
}
