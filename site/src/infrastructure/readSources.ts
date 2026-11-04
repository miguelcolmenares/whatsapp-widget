import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import matter from "gray-matter";
import {
  SNIPPETS_DIR,
  applyReplacements,
  buildVariables,
  expandFrontmatter,
  expandReusable,
  matchesAny,
} from "../domain";
import type { ReusableIssue, SiteConfig, SourceFile } from "../domain";
import { readRepositoryVersion } from "./repositoryVersion";

const SKIPPED_FOLDERS = new Set(["node_modules", ".git", "dist", ".astro", ".next", "coverage"]);

function posix(path: string): string {
  return path.split(sep).join("/");
}

function walk(directory: string): string[] {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (SKIPPED_FOLDERS.has(entry.name)) return [];
    const full = join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

/** The text of a snippet, or undefined when there is no such file. A name that leaves the snippets folder finds nothing. */
function readSnippetFile(root: string, name: string): string | undefined {
  const folder = resolve(root, SNIPPETS_DIR);
  const file = resolve(folder, name);
  if (!file.startsWith(`${folder}${sep}`) || !existsSync(file) || !statSync(file).isFile())
    return undefined;
  return readFileSync(file, "utf8");
}

/** The markdown read from a repository, and the paths of every file in it. */
export interface RepositorySources {
  /** Absolute path of the repository root. */
  root: string;
  files: SourceFile[];
  /** Every file of the repository, as repository-relative paths, for checking links. */
  existing: Set<string>;
}

/**
 * Read the markdown the site documents. A file matched by `anonymize.excludePaths` is never read,
 * and `anonymize.replace` is applied to everything that is. A file belongs to the collection whose
 * folder is the deepest one that contains it, so `docs/tutorials/` can be its own collection
 * inside `docs/` without its pages also showing up in the parent.
 *
 * The first thing done to a file is expanding its variables and snippets (`vars` of the config and `snippets/` of the
 * repository), so the title, the description, the search index and `llms.txt` all see the final text. A problem there
 * is a `reusableIssues` entry of the file, and `check` turns it into a finding of the kind `variables` or `snippets`.
 */
export function readSources(siteDir: string, config: SiteConfig): RepositorySources {
  const root = resolve(siteDir, config.sources.root);
  const toRepoPath = (absolute: string) => posix(relative(root, absolute));
  const existing = new Set(walk(root).map(toRepoPath));
  const { excludePaths, replace } = config.anonymize;
  const variables = buildVariables(config.vars, config.site.version ?? readRepositoryVersion(root));
  const snippetsPrefix = `${toRepoPath(resolve(root, SNIPPETS_DIR))}/`;

  const folders = config.collections.map((collection) => ({
    id: collection.id,
    absolute: resolve(siteDir, collection.dir),
    path: toRepoPath(resolve(siteDir, collection.dir)),
  }));
  const ownerOf = (repoPath: string) =>
    folders
      .filter((folder) => repoPath === folder.path || repoPath.startsWith(`${folder.path}/`))
      .sort((a, b) => b.path.length - a.path.length)[0];

  const read = (
    absolute: string,
    collection: string,
    collectionPath: string,
  ): SourceFile | null => {
    const path = toRepoPath(absolute);
    if (matchesAny(path, excludePaths)) return null;
    const raw = readFileSync(absolute, "utf8");
    // Options, even empty, keep gray-matter from caching by text, and a cached result has lost its raw `matter`.
    const parsed = matter(raw, {});
    // The content is the end of the file, so the lines before it are the frontmatter and its fences.
    const before = raw.endsWith(parsed.content)
      ? raw.slice(0, raw.length - parsed.content.length)
      : "";
    const contentLine = 1 + (before.match(/\n/g)?.length ?? 0);
    const reusableIssues: ReusableIssue[] = [];
    const reusable = {
      file: path,
      variables,
      readSnippet: (name: string) => readSnippetFile(root, name),
      onIssue: (issue: ReusableIssue) => reusableIssues.push(issue),
    };
    // Variables and snippets first, then the replacements, so a value from either is anonymized too. The keys
    // are checked after this, and they are never changed by it.
    const data = expandFrontmatter(parsed.data, parsed.matter, reusable);
    const body = expandReusable(parsed.content, { ...reusable, lineOffset: contentLine - 1 });
    return {
      path,
      collection,
      collectionPath,
      frontmatter: JSON.parse(applyReplacements(JSON.stringify(data), replace)) as Record<
        string,
        unknown
      >,
      content: applyReplacements(body.text, replace),
      contentLine,
      frontmatterText: parsed.matter,
      contentLines: body.lines,
      reusableIssues,
    };
  };

  const files: SourceFile[] = [];
  for (const folder of folders) {
    for (const absolute of walk(folder.absolute)
      .filter((file) => /\.mdx?$/i.test(file))
      .sort()) {
      const repoPath = toRepoPath(absolute);
      if (ownerOf(repoPath)?.id !== folder.id) continue; // a deeper collection owns it
      if (repoPath.startsWith(snippetsPrefix)) continue; // a snippet is part of a page, not a page
      const file = read(absolute, folder.id, repoPath.slice(folder.path.length + 1));
      if (file) files.push(file);
    }
  }

  const changelog = resolve(siteDir, config.sources.changelog);
  if (existsSync(changelog) && statSync(changelog).isFile()) {
    const file = read(changelog, "changelog", toRepoPath(changelog));
    if (file) files.push(file);
  }
  return { root, files, existing };
}
