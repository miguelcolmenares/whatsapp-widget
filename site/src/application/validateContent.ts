import {
  CALLOUT_KINDS,
  KNOWN_FRONTMATTER_KEYS,
  anchorHeadings,
  cardProblemLine,
  dropLeadingTitle,
  explicitAnchors,
  extractHeadings,
  hrefTarget,
  inlineLinks,
  isRelativeHref,
  matchesAny,
  maskInlineCode,
  nearest,
  proseLines,
  readSideCard,
  resolveCardLinks,
  resolveLink,
  resolveSeverities,
  unknownCalloutMarker,
} from "../domain";
import type {
  ContentFinding,
  Document,
  FindingKind,
  HeadingAnchor,
  LinkContext,
  SiteConfig,
  SourceFile,
} from "../domain";
import { publishedRoutes } from "./buildDocuments";

/** What the validation needs besides the files and the pages: the config, and every file of the repository. */
export interface ValidateContentOptions {
  config: SiteConfig;
  /** Every repository-relative path that exists, published or not. */
  existing: ReadonlySet<string>;
}

/** The anchors a page answers to, and the headings that make them. */
interface PageAnchors {
  anchors: Set<string>;
  headings: HeadingAnchor[];
}

const escapePattern = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** The lines of the page's own source that hold a frontmatter key. Line 1 is the opening `---`. */
function keyLine(file: SourceFile, key: string): number {
  const lines = (file.frontmatterText ?? "").split(/\r?\n/);
  const index = lines.findIndex((line) =>
    new RegExp(`^["']?${escapePattern(key)}["']?\\s*:`).test(line),
  );
  return index === -1 ? 1 : 1 + index;
}

/**
 * Read the markdown of every page as data and report what is wrong with it: links to files that do not
 * exist or are excluded, links to headings that are not there, images that do not exist, frontmatter the kit
 * does not read or cannot use, a side card that the frontmatter got wrong (`meta`, `links`) and its links that lead
 * nowhere, headings that make the same anchor, callout markers it does not know, and
 * variables and snippets that could not be expanded when the files were read.
 * Each finding has a severity (the default of its kind, or what `check` in the config says) and the file and
 * line where the problem is written. Code is never read: a fenced block and a code span hold no links, no
 * headings and no markers. A kind set to `off` is not looked for. Anchors are checked only against pages that
 * are on the site, so a link into an excluded page or a file that is only in the repository is not.
 */
export function validateContent(
  files: readonly SourceFile[],
  documents: readonly Document[],
  options: ValidateContentOptions,
): ContentFinding[] {
  const { config, existing } = options;
  const severities = resolveSeverities(config.check);
  const published = publishedRoutes(documents);
  const documentOf = new Map(documents.map((document) => [document.path, document]));
  const fileOf = new Map(files.map((file) => [file.path, file]));
  const pathOfRoute = new Map(documents.map((document) => [document.route, document.path]));
  const cache = new Map<string, PageAnchors>();
  const findings: ContentFinding[] = [];

  const reportAt = (kind: FindingKind, path: string, line: number, message: string) => {
    const level = severities[kind];
    if (level === "off") return;
    findings.push({ kind, severity: level, file: path, line, message });
  };
  const report = (kind: FindingKind, file: SourceFile, line: number, message: string) =>
    reportAt(kind, file.path, line, message);

  // Variables and snippets that could not be expanded when the files were read. A snippet is shared by pages, so
  // the same problem in it is reported once, and its file is the snippet, not the page that includes it.
  const reported = new Set<string>();
  for (const file of files) {
    for (const issue of file.reusableIssues ?? []) {
      const key = `${issue.kind}\u0000${issue.file}\u0000${issue.line}\u0000${issue.message}`;
      if (reported.has(key)) continue;
      reported.add(key);
      reportAt(issue.kind, issue.file, issue.line, issue.message);
    }
  }

  const contextFor = (file: SourceFile): LinkContext => ({
    file: file.path,
    published,
    existing,
    isExcluded: (path) => matchesAny(path, config.anonymize.excludePaths),
    repositoryUrl: config.site.repository,
  });

  /** The headings of a page as the site renders it: the title the layout shows is not one of them. */
  const pageAnchors = (path: string): PageAnchors | null => {
    const cached = cache.get(path);
    if (cached) return cached;
    const file = fileOf.get(path);
    const document = documentOf.get(path);
    if (!file || !document) return null;
    const lines = proseLines(file.content);
    const titleLine =
      dropLeadingTitle(file.content, document.title) !== file.content
        ? lines.findIndex((line) => line.text.trim() !== "")
        : -1;
    const headings = anchorHeadings(
      extractHeadings(file.content).filter((heading) => heading.index !== titleLine),
    );
    const page = {
      headings,
      anchors: new Set([
        ...headings.map((heading) => heading.anchor),
        ...explicitAnchors(file.content),
      ]),
    };
    cache.set(path, page);
    return page;
  };

  const hasAnchor = (path: string, fragment: string): boolean => {
    let anchor = fragment;
    try {
      anchor = decodeURIComponent(fragment);
    } catch {
      // A fragment that is not valid percent-encoding is compared as written.
    }
    if (anchor === "" || anchor === "top" || anchor.startsWith(":~:")) return true;
    return pageAnchors(path)?.anchors.has(anchor) ?? true;
  };

  for (const file of files) {
    const document = documentOf.get(file.path);
    if (!document) continue;
    const first = file.contentLine ?? 1;
    // The line of a line of `content`. A snippet adds lines, so the file's own map is used when there is one.
    const lineAt = (index: number) => file.contentLines?.[index] ?? first + index;
    const context = contextFor(file);

    // Frontmatter: a key the kit does not read, and an order it cannot use.
    for (const key of Object.keys(file.frontmatter)) {
      if ((KNOWN_FRONTMATTER_KEYS as readonly string[]).includes(key)) continue;
      const guess = nearest(key, KNOWN_FRONTMATTER_KEYS);
      report(
        "frontmatter",
        file,
        keyLine(file, key),
        `Frontmatter key "${key}" is not one the kit reads (${KNOWN_FRONTMATTER_KEYS.join(", ")}).${guess ? ` Did you mean "${guess}"?` : ""}`,
      );
    }
    const order = file.frontmatter.order;
    if (order !== undefined && !(typeof order === "number" && Number.isFinite(order))) {
      report(
        "order",
        file,
        keyLine(file, "order"),
        `Frontmatter "order" must be a number, and this is ${JSON.stringify(order)}. Write it without quotes, for example order: 2.`,
      );
    }

    // The side card: an item the frontmatter got wrong, and a link that leads nowhere, each at the line of its key.
    const read = readSideCard(file.frontmatter);
    const unresolved = read.card ? resolveCardLinks(read.card, context).problems : [];
    for (const problem of [...read.problems, ...unresolved]) {
      report(
        problem.kind,
        file,
        cardProblemLine(file.frontmatterText ?? "", problem),
        problem.message,
      );
    }

    // Links, images and callout markers, one line at a time, never inside code.
    const lines = proseLines(file.content);
    lines.forEach((line, position) => {
      if (line.fenced) return;
      const at = lineAt(line.index);

      const checkImage = (href: string) => {
        if (href.includes("\u0000") || !isRelativeHref(href)) return;
        const target = hrefTarget(file.path, href);
        if (target === null || !existing.has(target))
          report("images", file, at, `Image "${href}" does not exist`);
      };

      for (const link of inlineLinks(maskInlineCode(line.text))) {
        if (link.image) {
          checkImage(link.href);
          continue;
        }
        // A badge is an image inside a link: both are read.
        for (const inner of inlineLinks(link.label)) if (inner.image) checkImage(inner.href);
        if (link.href.includes("\u0000")) continue;
        const resolution = resolveLink(link.href, context);
        if (resolution.kind === "missing") {
          report("links", file, at, resolution.warning);
        } else if (resolution.kind === "text-only") {
          report("excludedLinks", file, at, resolution.warning);
        } else if (resolution.kind === "route") {
          const hash = resolution.href.indexOf("#");
          const target = pathOfRoute.get(
            hash === -1 ? resolution.href : resolution.href.slice(0, hash),
          );
          if (
            hash !== -1 &&
            target !== undefined &&
            !hasAnchor(target, resolution.href.slice(hash + 1))
          )
            report(
              "anchors",
              file,
              at,
              `Link "${link.href}" points to a heading that does not exist in ${target}`,
            );
        } else if (link.href.startsWith("#") && !hasAnchor(file.path, link.href.slice(1))) {
          report(
            "anchors",
            file,
            at,
            `Link "${link.href}" points to a heading that does not exist in this page`,
          );
        }
      }

      // A blockquote opens with its marker. A line of the same shape inside a quote is just text.
      const quote = /^\s*(?:>\s?)+(\[!.*)$/.exec(line.text);
      const above = lines[position - 1];
      if (quote && !(above && !above.fenced && /^\s*>/.test(above.text))) {
        const name = unknownCalloutMarker(quote[1]!);
        if (name !== null)
          report(
            "callouts",
            file,
            at,
            `"[!${name}]" is not a callout marker, so this stays a plain blockquote. The markers are ${CALLOUT_KINDS.map((kind) => `[!${kind.toUpperCase()}]`).join(", ")}`,
          );
      }
    });

    // Headings that make the same anchor. A changelog repeats "Added" and "Fixed" under every version on purpose.
    if (file.collection !== "changelog") {
      for (const heading of pageAnchors(file.path)?.headings ?? []) {
        if (heading.firstIndex === null || heading.base === "") continue;
        report(
          "duplicateHeadings",
          file,
          lineAt(heading.index),
          `Heading "${heading.text}" makes the same anchor as the one on line ${lineAt(heading.firstIndex)}, so its link is #${heading.anchor}`,
        );
      }
    }
  }

  // Findings are in the order of the files, then by line. A snippet is not a file of the list, so it comes last.
  const position = new Map(files.map((file, index) => [file.path, index]));
  const rank = (path: string) => position.get(path) ?? files.length;
  return findings.sort(
    (a, b) =>
      rank(a.file) - rank(b.file) ||
      (a.file < b.file ? -1 : a.file > b.file ? 1 : 0) ||
      a.line - b.line,
  );
}
