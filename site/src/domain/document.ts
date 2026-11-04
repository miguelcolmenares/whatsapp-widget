import type { ReusableIssue } from "./reusable";
import type { SideCard } from "./sideCard";

/** The four tones a group badge can have. They match the `ToneBadge` component. */
export type Tone = "neutral" | "brand" | "success" | "warn";

/** The group a page belongs to inside its collection. */
export interface DocumentGroup {
  name: string;
  tone: Tone;
}

/** A markdown file read from the repository, before it becomes a page. */
export interface SourceFile {
  /** Repository-relative path with forward slashes. */
  path: string;
  /** Id of the collection that owns the file, or `changelog`. */
  collection: string;
  /** Path of the file inside the folder of its collection, with forward slashes. */
  collectionPath: string;
  frontmatter: Record<string, unknown>;
  content: string;
  /** Line of the file where `content` begins, starting at 1. It is 1 for a file with no frontmatter. */
  contentLine?: number;
  /** The raw text between the `---` lines, to find the line of each key. Empty when there is none. */
  frontmatterText?: string;
  /**
   * The line of the file that each line of `content` came from, after the variables and the snippets were
   * expanded. A snippet adds lines, so this is how a finding on a later line points at the file. Missing when
   * the content was not expanded: line `contentLine + index` is then the line.
   */
  contentLines?: number[];
  /** Variables and snippets that could not be expanded, with the file and line where each one is written. */
  reusableIssues?: ReusableIssue[];
}

/** The frontmatter keys the kit reads. Any other key is reported by `check`. */
export const KNOWN_FRONTMATTER_KEYS = [
  "title",
  "description",
  "order",
  "tags",
  "meta",
  "links",
] as const;

/** A page of the site. */
export interface Document {
  collection: string;
  /** Repository-relative path of the source file. */
  path: string;
  slug: string;
  /** Route including the site base, with a trailing slash. */
  route: string;
  title: string;
  description: string;
  /** Where the description came from. A description taken from the body is already on the page. */
  descriptionSource: "frontmatter" | "content" | "none";
  /** Explicit position from the frontmatter, or null. */
  order: number | null;
  /** The `tags` of the frontmatter, trimmed and without repeats. The filter bar of an index page is built from them. */
  tags: string[];
  /** The group of the page, or null when its collection has no groups. */
  group: DocumentGroup | null;
  /** The side card of a detail page, from `meta`, `links` and `tags`. Absent when the page has none. */
  card?: SideCard;
  /** Markdown body, without a leading heading that repeats the title. */
  body: string;
}
