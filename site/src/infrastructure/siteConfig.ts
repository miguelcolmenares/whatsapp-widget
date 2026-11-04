import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseSiteConfig } from "../domain";
import type { SiteConfig } from "../domain";

/** Read and validate `sitekit.config.json` from a site folder. */
export function loadSiteConfig(siteDir: string): SiteConfig {
  const file = join(siteDir, "sitekit.config.json");
  let raw: string;
  try {
    raw = readFileSync(file, "utf8");
  } catch {
    throw new Error(`Missing ${file}. Run \`npx docs-sitekit init\` to create it.`);
  }
  try {
    return parseSiteConfig(JSON.parse(raw));
  } catch (error) {
    if (error instanceof SyntaxError)
      throw new Error(`${file} is not valid JSON: ${error.message}`, { cause: error });
    throw error;
  }
}
