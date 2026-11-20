import { existsSync, readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { extname, isAbsolute, relative, resolve, sep } from "node:path";
import { applyReplacements, matchesAny, parseDemoManifest } from "@/domain";
import type { DemoManifest, Document, SiteConfig } from "@/domain";

/** A local text file that publication checks must scan, including displayed server-language source. */
export interface DemoFile {
  path: string;
  text: string;
}

/** A prebuilt, static asset served under the site's base-aware demo route. */
export interface DemoAsset {
  path: string;
  text: string;
  contentType: string;
}

/** Validated examples, their source text and the assets a generated site may publish. */
export interface DemoCatalog {
  manifest: DemoManifest;
  sources: Record<string, string>;
  files: DemoFile[];
  assets: DemoAsset[];
}

const STATIC_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
};

const within = (root: string, path: string) => path === root || path.startsWith(`${root}${sep}`);
const posix = (path: string) => path.split(sep).join("/");

/**
 * Read a dedicated directory of prebuilt demo files. Resolve real paths before reading, fail on missing or escaping
 * files, and never execute source files. Every text destined for publication follows the site's anonymization rules.
 */
export function readDemoCatalog(
  siteDir: string,
  config: SiteConfig,
  documents: readonly Document[] = [],
): DemoCatalog {
  const empty: DemoCatalog = {
    manifest: { schemaVersion: 1, examples: [] },
    sources: {},
    files: [],
    assets: [],
  };
  if (!config.demos) {
    if (documents.some((document) => document.demo))
      throw new Error('A page selects a demo, but sitekit.config.json has no "demos.dir".');
    return empty;
  }
  if (isAbsolute(config.demos.dir) || /^[a-z][a-z0-9+.-]*:/i.test(config.demos.dir))
    throw new Error('"demos.dir" must be a relative local directory.');
  const lexicalRoot = resolve(siteDir, config.sources.root);
  const root = realpathSync(lexicalRoot);
  const directory = resolve(siteDir, config.demos.dir);
  if (!existsSync(directory) || !statSync(directory).isDirectory())
    throw new Error(`Demo directory does not exist: ${config.demos.dir}.`);
  const realDirectory = realpathSync(directory);
  if (!within(lexicalRoot, directory) || !within(root, realDirectory))
    throw new Error('"demos.dir" must stay inside sources.root.');

  const checkedPath = (file: string) => {
    const absolute = resolve(directory, file);
    if (!within(directory, absolute) || !existsSync(absolute))
      throw new Error(`Missing demo file: ${file}.`);
    const real = realpathSync(absolute);
    if (!within(realDirectory, real) || !within(root, real))
      throw new Error(`Demo symlink leaves its directory: ${file}.`);
    const repositoryPath = posix(relative(lexicalRoot, absolute));
    if (
      [repositoryPath, posix(relative(root, real))].some((path) =>
        matchesAny(path, config.anonymize.excludePaths),
      )
    )
      throw new Error(`Demo file is excluded from publication: ${repositoryPath}.`);
    return { absolute, real, repositoryPath };
  };
  const read = (file: string) => {
    const { absolute, repositoryPath } = checkedPath(file);
    if (!statSync(absolute).isFile()) throw new Error(`Demo path is not a file: ${file}.`);
    return {
      path: repositoryPath,
      text: applyReplacements(readFileSync(absolute, "utf8"), config.anonymize.replace),
    };
  };
  const manifestFile = read("manifest.json");
  let parsed: unknown;
  try {
    parsed = JSON.parse(manifestFile.text);
  } catch {
    throw new Error("Demo manifest.json is not valid JSON.");
  }
  const manifest = parseDemoManifest(parsed);
  const known = new Set(manifest.examples.map((example) => example.id));
  for (const document of documents)
    if (document.demo && !known.has(document.demo))
      throw new Error(`${document.path} selects unknown demo "${document.demo}".`);

  const sourcePaths = new Set(
    manifest.examples.flatMap((example) => [
      ...example.sources.map((source) => source.path),
      ...(example.variants ?? []).flatMap((variant) =>
        (variant.sources ?? []).map((source) => source.path),
      ),
    ]),
  );
  const previewPaths = manifest.examples.flatMap((example) => [
    example.preview,
    ...(example.variants ?? []).map((variant) => variant.preview),
  ]);
  const sources = Object.fromEntries([...sourcePaths].map((path) => [path, read(path).text]));
  for (const path of previewPaths) read(path);

  const files: DemoFile[] = [manifestFile];
  const assets: DemoAsset[] = [];
  const walk = (folder: string, ancestors: ReadonlySet<string>) => {
    const { absolute, real } = checkedPath(folder);
    if (ancestors.has(real)) throw new Error(`Demo directory has a circular symlink: ${folder}.`);
    const next = new Set([...ancestors, real]);
    for (const entry of readdirSync(absolute, { withFileTypes: true })) {
      const path = folder ? `${folder}/${entry.name}` : entry.name;
      const { absolute: entryPath } = checkedPath(path);
      if (statSync(entryPath).isDirectory()) {
        walk(path, next);
        continue;
      }
      if (path === "manifest.json") continue;
      const file = read(path);
      files.push(file);
      const contentType = STATIC_TYPES[extname(path).toLowerCase()];
      if (contentType) assets.push({ path, text: file.text, contentType });
      else if (!sourcePaths.has(path))
        throw new Error(
          `Unsupported demo asset "${path}". Declare it as displayed source, or use HTML, CSS, JavaScript, JSON, SVG or text.`,
        );
    }
  };
  walk("", new Set());
  return { manifest, sources, files, assets };
}
