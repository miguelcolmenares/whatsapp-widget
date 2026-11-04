import type { DocumentGroup, Tone } from "./document";

/** A group as written in `sitekit.config.json`. */
export interface GroupConfig {
  name: string;
  tone: Tone;
  items: readonly string[];
}

/**
 * Put pages in the order the groups give them and say which group each belongs to.
 * It is strict on purpose: a page that is in no group, a group that names a page that does not
 * exist, or a page named twice is an error. A new page cannot land unclassified, and a typo cannot hide a page.
 */
export function applyGroups<T extends { slug: string }>(
  items: readonly T[],
  groups: readonly GroupConfig[],
  label: string,
): Array<T & { group: DocumentGroup }> {
  const placement = new Map<string, { group: GroupConfig; index: number }>();
  groups.forEach((group, groupIndex) => {
    group.items.forEach((slug, itemIndex) => {
      const clash = placement.get(slug);
      if (clash)
        throw new Error(
          `"${slug}" is in two groups of ${label}: "${clash.group.name}" and "${group.name}".`,
        );
      placement.set(slug, { group, index: groupIndex * 10_000 + itemIndex });
    });
  });

  const slugs = new Set(items.map((item) => item.slug));
  for (const group of groups) {
    for (const slug of group.items) {
      if (!slugs.has(slug)) {
        throw new Error(
          `The group "${group.name}" of ${label} lists "${slug}", which is not a page. Pages are: ${[...slugs].sort().join(", ")}.`,
        );
      }
    }
  }
  const unclassified = items.filter((item) => !placement.has(item.slug)).map((item) => item.slug);
  if (unclassified.length > 0) {
    throw new Error(
      `${unclassified.join(", ")} ${unclassified.length === 1 ? "is" : "are"} in no group of ${label}. Add ${unclassified.length === 1 ? "it" : "them"} to a group, or remove the groups to sort by name.`,
    );
  }

  return items
    .map((item) => {
      const found = placement.get(item.slug)!;
      return {
        item: { ...item, group: { name: found.group.name, tone: found.group.tone } },
        index: found.index,
      };
    })
    .sort((a, b) => a.index - b.index)
    .map((entry) => entry.item);
}
