import type { SearchableHeading } from "./searchText";

/** A heading of an indexed page, as the client shows it and links to it. */
export type SearchIndexHeading = SearchableHeading;

/** One page in the search index. */
export interface SearchPage {
  /** Address of the page, with the site base, with a trailing slash. */
  url: string;
  title: string;
  /** The description of the page, from its frontmatter or its first paragraph, or "". */
  description: string;
  /** Id of the collection the page belongs to, for example `docs`. */
  collection: string;
  /** Headings in page order. `offset` is where the heading text starts inside `text`. */
  headings: SearchIndexHeading[];
  /** The body as plain text, code included. */
  text: string;
}

/** The file `search-index.json`, which the search dialog loads the first time it is opened. */
export interface SearchIndex {
  /** Label of each collection, by id, in the order the site shows them. */
  collections: Record<string, string>;
  pages: SearchPage[];
}
