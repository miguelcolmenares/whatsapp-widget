import { extractSearchableText, humanize } from "../domain";
import type { CollectionConfig, Document, SearchIndex, SearchPage } from "../domain";

/** Name of the collection that holds the changelog. */
const CHANGELOG = "changelog";

/**
 * Turn the pages of a built site into the search index: one entry per page, with its title, its collection,
 * its headings and its body as plain text. Pages keep the order they have on the site, and each collection
 * is labelled as the menu labels it.
 */
export function buildSearchIndex(
  documents: readonly Document[],
  options: { collections?: readonly CollectionConfig[] } = {},
): SearchIndex {
  const configured = options.collections ?? [];
  const labels: Record<string, string> = {};
  for (const collection of configured) labels[collection.id] = collection.label;
  for (const document of documents) {
    if (labels[document.collection] === undefined) {
      labels[document.collection] =
        document.collection === CHANGELOG ? "Changelog" : humanize(document.collection);
    }
  }

  const pages: SearchPage[] = documents.map((document) => {
    const { text, headings } = extractSearchableText(document.body);
    return {
      url: document.route,
      title: document.title,
      description: document.description,
      collection: document.collection,
      headings,
      text,
    };
  });
  return { collections: labels, pages };
}
