import {
  applyGroups,
  dropLeadingTitle,
  extractDescription,
  extractTitle,
  humanize,
  kebab,
  normalizeTags,
  readSideCard,
} from "../domain";
import type { CollectionConfig, Document, SourceFile } from "../domain";

/** Name of the page that a folder's own README or index becomes. */
const OVERVIEW = "overview";

function slugFor(file: SourceFile): string {
  if (file.collection === "changelog") return "changelog";
  const parts = file.collectionPath.split("/");
  const stem = kebab(parts[parts.length - 1]!);
  if (stem === "readme" || stem === "index") {
    // docs/guide/README.md is the page "guide". A README at the top of the collection is its overview.
    return parts.length > 1 ? kebab(parts[parts.length - 2]!) : OVERVIEW;
  }
  return stem;
}

function text(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

function orderOf(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function toDocument(file: SourceFile, base: string): Document {
  const slug = slugFor(file);
  const title = text(file.frontmatter.title) ?? extractTitle(file.content, humanize(slug));
  const fromFrontmatter = text(file.frontmatter.description);
  const fromContent = fromFrontmatter ? "" : extractDescription(file.content);
  // What the card's frontmatter got wrong is reported by `validateContent`, which reads it again with the lines.
  const { card } = readSideCard(file.frontmatter);
  return {
    collection: file.collection,
    path: file.path,
    slug,
    route:
      file.collection === "changelog" ? `${base}changelog/` : `${base}${file.collection}/${slug}/`,
    title,
    description: fromFrontmatter ?? fromContent,
    descriptionSource: fromFrontmatter ? "frontmatter" : fromContent ? "content" : "none",
    order: orderOf(file.frontmatter.order),
    tags: normalizeTags(file.frontmatter.tags),
    group: null,
    ...(card ? { card } : {}),
    body: dropLeadingTitle(file.content, title),
  };
}

/** Sort by explicit `order` first, then by slug. */
function byOrderThenSlug(a: Document, b: Document): number {
  if (a.order !== null && b.order !== null && a.order !== b.order) return a.order - b.order;
  if (a.order !== null && b.order === null) return -1;
  if (a.order === null && b.order !== null) return 1;
  return a.slug.localeCompare(b.slug);
}

/**
 * Turn source files into pages. Title, description, order and tags come from the frontmatter first and from the
 * content second. Two files that would get the same route are an error, not a silent skip. A collection
 * with groups orders its pages by them and fails on a page that is in no group.
 */
export function buildDocuments(
  files: readonly SourceFile[],
  options: { base: string; collections?: readonly CollectionConfig[] },
): Document[] {
  const documents = files.map((file) => toDocument(file, options.base));

  const byRoute = new Map<string, Document>();
  for (const document of documents) {
    const clash = byRoute.get(document.route);
    if (clash)
      throw new Error(
        `Two files produce the route ${document.route}: ${clash.path} and ${document.path}`,
      );
    byRoute.set(document.route, document);
  }

  const configured = options.collections ?? [];
  const order = [...configured.map((collection) => collection.id), "changelog"];
  const result: Document[] = [];

  for (const id of order) {
    const own = documents.filter((document) => document.collection === id).sort(byOrderThenSlug);
    const groups = configured.find((collection) => collection.id === id)?.groups ?? [];
    result.push(
      ...(groups.length > 0
        ? applyGroups(own, groups, `"${configured.find((c) => c.id === id)!.label}"`)
        : own),
    );
  }

  // A collection that is not in the config is still published, after the configured ones.
  for (const document of documents
    .filter((candidate) => !order.includes(candidate.collection))
    .sort(byOrderThenSlug)) {
    result.push(document);
  }
  return result;
}

/** Repository path to route, the map link rewriting needs. */
export function publishedRoutes(documents: readonly Document[]): Map<string, string> {
  return new Map(documents.map((document) => [document.path, document.route]));
}
