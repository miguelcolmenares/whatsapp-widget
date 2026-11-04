import { absoluteUrl, humanize } from "../domain";
import type { Document, SiteConfig } from "../domain";

/** Collapse a description onto one line, so it cannot break the list item it sits in. */
function oneLine(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/** Keep a title's brackets from closing the link text early, and its backslashes from escaping them. */
function linkText(title: string): string {
  return oneLine(title).replace(/([[\]\\])/g, "\\$1");
}

/** The heading of a collection: its label from the config, `Changelog`, or the id made readable. */
function heading(config: SiteConfig, id: string): string {
  if (id === "changelog") return "Changelog";
  return config.collections.find((collection) => collection.id === id)?.label ?? humanize(id);
}

/** One list item: `- [title](absolute url): description`, the colon part left out without a description. */
function item(config: SiteConfig, document: Document): string {
  const url = absoluteUrl(config.site.url, document.route);
  const description = oneLine(document.description);
  return `- [${linkText(document.title)}](${url})${description ? `: ${description}` : ""}`;
}

/**
 * The text of llms.txt, in the order the proposal gives: an H1 with the site name, a blockquote
 * with the description, a short paragraph with the install command and the repository, one H2 per
 * collection in the order of the documents, and `## Optional` last for the collections the config
 * marks as optional. Every address is absolute, built from `site.url` and the route of each page.
 */
export function buildLlmsText(config: SiteConfig, documents: readonly Document[]): string {
  const optional = new Set(config.llms.optional);
  const collections = [...new Set(documents.map((document) => document.collection))];
  const lines: string[] = [
    `# ${oneLine(config.site.name)}`,
    "",
    `> ${oneLine(config.site.description)}`,
    "",
  ];

  const detail: string[] = [];
  if (config.site.installCommand) detail.push(`Install: \`${config.site.installCommand}\`.`);
  if (config.site.repository) detail.push(`Repository: ${config.site.repository}.`);
  if (detail.length > 0) lines.push(detail.join(" "), "");

  for (const id of collections.filter((collection) => !optional.has(collection))) {
    lines.push(`## ${heading(config, id)}`, "");
    for (const document of documents.filter((candidate) => candidate.collection === id))
      lines.push(item(config, document));
    lines.push("");
  }

  const optionalItems = documents.filter((document) => optional.has(document.collection));
  if (optionalItems.length > 0) {
    lines.push("## Optional", "");
    for (const document of optionalItems) lines.push(item(config, document));
    lines.push("");
  }

  return `${lines.join("\n").replace(/\n+$/, "")}\n`;
}
