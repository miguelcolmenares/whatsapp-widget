/** The number of single-character edits that turn `a` into `b`. */
function distance(a: string, b: string): number {
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    const row = [i];
    for (let j = 1; j <= b.length; j += 1) {
      row[j] = Math.min(
        previous[j]! + 1,
        row[j - 1]! + 1,
        previous[j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    previous = row;
  }
  return previous[b.length]!;
}

/**
 * The candidate closest to `name`, when it is only a typo away (two edits or fewer, and fewer than the
 * length of the word). Used to say `Did you mean "title"?` for `titel`.
 */
export function nearest(name: string, candidates: readonly string[]): string | null {
  const word = name.toLowerCase();
  let best: { candidate: string; edits: number } | null = null;
  for (const candidate of candidates) {
    const edits = distance(word, candidate);
    if (edits <= 2 && edits < candidate.length && (best === null || edits < best.edits))
      best = { candidate, edits };
  }
  return best?.candidate ?? null;
}
