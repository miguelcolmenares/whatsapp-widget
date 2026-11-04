import { describeLastChange, editAddress, resolveEditHost, SHALLOW_CLONE_WARNING } from "../domain";
import type { Document, LastChange, SiteConfig } from "../domain";

/** What the page footer needs from the history of the repository. Infrastructure reads it from git. */
export interface RepositoryHistory {
  /** False when the sources are not inside a git work tree. */
  available: boolean;
  /** True for a shallow clone, where the history stops at some commit and dates cannot be trusted. */
  shallow: boolean;
  /** Path of the sources folder from the root of the git repository, with a trailing slash, or empty at the root. */
  prefix: string;
  /** The author date of the last commit that touched the file, as ISO 8601, or undefined when none did. */
  lastChange(path: string): string | undefined;
}

/** What a page shows at its foot. Either part is missing when it is off or cannot be told. */
export interface PageMeta {
  /** Address of the source file on the repository host. */
  editUrl?: string;
  updated?: LastChange;
}

/** The footer data of every page, and the reasons something was left out. */
export interface PageMetaBuilder {
  /** The footer data of a page. It is empty for both options off. */
  of(document: Document): PageMeta;
  /** Sentences for the person who owns the config. Each says what was left out and why. */
  warnings: string[];
}

/**
 * Build the "Edit this page" address and the date of the last change of each page.
 *
 * The address needs `site.repository` and a host, and an unknown host turns the link off with a
 * warning. The date is the last commit that touched the file itself. In a shallow clone it is left
 * out for every page with a warning, because the oldest commit would be the answer for all of them.
 * `history` is read only when an option needs it, so a site with both off never runs git.
 */
export function buildPageMeta(
  config: SiteConfig,
  readHistory: () => RepositoryHistory,
): PageMetaBuilder {
  const warnings: string[] = [];
  const { editLink, lastUpdated } = config;
  if (!editLink.enabled && !lastUpdated.enabled) return { of: () => ({}), warnings };

  const history = readHistory();

  const resolution = editLink.enabled
    ? resolveEditHost(config.site.repository, editLink.host)
    : undefined;
  if (resolution && !resolution.ok) warnings.push(resolution.reason);

  let datesOn = lastUpdated.enabled;
  if (datesOn && !history.available) {
    warnings.push(
      "lastUpdated is on, but the sources are not in a git repository, so no dates are shown.",
    );
    datesOn = false;
  } else if (datesOn && history.shallow) {
    warnings.push(SHALLOW_CLONE_WARNING);
    datesOn = false;
  }

  return {
    warnings,
    of(document) {
      const meta: PageMeta = {};
      const repoPath = `${history.prefix}${document.path}`;
      if (resolution?.ok && config.site.repository) {
        meta.editUrl = editAddress({
          repository: config.site.repository,
          host: resolution.host,
          branch: editLink.branch,
          path: repoPath,
        });
      }
      if (datesOn) {
        const updated = describeLastChange(history.lastChange(document.path));
        if (updated) meta.updated = updated;
      }
      return meta;
    },
  };
}
