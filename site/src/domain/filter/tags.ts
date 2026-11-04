/** The key of a tag: what two spellings of the same tag have in common. Case and surrounding space do not count. */
export function tagKey(tag: string): string {
  return tag.trim().toLowerCase();
}

/**
 * The tags of a page, from the `tags` key of its frontmatter. It takes a list or one comma separated string,
 * keeps the first spelling of a tag that appears twice, and drops what is empty or not text. A list item that
 * is a number is kept as text, because `tags: [2024]` is a tag a writer meant.
 */
export function normalizeTags(value: unknown): string[] {
  const raw: unknown[] = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : [];
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const item of raw) {
    const text = typeof item === "number" && Number.isFinite(item) ? String(item) : item;
    if (typeof text !== "string") continue;
    const tag = text.trim();
    const key = tagKey(tag);
    if (key === "" || seen.has(key)) continue;
    seen.add(key);
    tags.push(tag);
  }
  return tags;
}
