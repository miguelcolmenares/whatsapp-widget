import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The version in the repository's `package.json`, read on every build, so a site rebuilt for a release
 * shows that release. Returns undefined when there is no `package.json` or it has no version.
 */
export function readRepositoryVersion(root: string): string | undefined {
  const file = join(root, "package.json");
  if (!existsSync(file)) return undefined;
  try {
    const { version } = JSON.parse(readFileSync(file, "utf8")) as { version?: unknown };
    return typeof version === "string" && version.trim() !== "" ? version.trim() : undefined;
  } catch {
    return undefined;
  }
}
