/** Compile a glob (`**`, `*`, `?`) to a regular expression over forward-slash paths. */
export function globToRegExp(glob: string): RegExp {
  let source = "";
  for (let i = 0; i < glob.length; i++) {
    const char = glob[i]!;
    if (char === "*") {
      if (glob[i + 1] === "*") {
        i++;
        if (glob[i + 1] === "/") {
          i++;
          source += "(?:.*/)?";
        } else source += ".*";
      } else source += "[^/]*";
    } else if (char === "?") source += "[^/]";
    else source += char.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  }
  return new RegExp(`^${source}$`);
}

/** True when the path matches at least one glob. */
export function matchesAny(path: string, globs: readonly string[]): boolean {
  return globs.some((glob) => globToRegExp(glob).test(path));
}

/** Replace each key of the map with its value, everywhere, as literal text. */
export function applyReplacements(
  text: string,
  replacements: Readonly<Record<string, string>>,
): string {
  let result = text;
  for (const [from, to] of Object.entries(replacements)) {
    if (from !== "") result = result.split(from).join(to);
  }
  return result;
}
