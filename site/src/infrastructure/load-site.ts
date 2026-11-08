import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { buildDocuments, buildPageMeta, publishedRoutes, validateContent } from "@/application";
import { matchesAny, resolveCardLinks } from "@/domain";
import type {
  BrandGlyph,
  ContentFinding,
  Document,
  LinkContext,
  SiteConfig,
  TokenColors,
} from "@/domain";
import type { PageMeta } from "@/application";
import { readCustomBrands } from "./custom-brands";
import { renderDemoSamples } from "./demo-samples";
import type { DemoSample } from "./demo-samples";
import { readGitHistory } from "./git-history";
import { renderMarkdown } from "./render-markdown";
import type { RenderedMarkdown } from "./render-markdown";
import { readSources } from "./read-sources";
import { readRepositoryVersion } from "./repository-version";
import { loadSiteConfig } from "./site-config";

/** A loaded site: its config, its pages, a renderer, and the problems found on the way. */
export interface Site {
  config: SiteConfig;
  /** The version to show: the one in the config if there is one, else the repository's own, read at build time. */
  version: string | undefined;
  documents: Document[];
  /** The logos the author added to the brands folder, keyed by the icon value, for `Icon` to draw. */
  customBrands: Record<string, BrandGlyph>;
  /** Problems found in the markdown, each with a severity, a file and a line, to print once at the end of a build. */
  findings: ContentFinding[];
  /** Join a path to the site base: `href("docs/")` becomes `/repo/docs/`. */
  href: (path: string) => string;
  render: (document: Document) => Promise<RenderedMarkdown>;
  /** The Markdown sample of the home page, rendered by the pipeline, or nothing when the config has no `demo`. */
  renderDemo: () => Promise<DemoSample[] | undefined>;
  /** What a page shows at its foot: the address to edit its source and the date of its last change. */
  pageMeta: (document: Document) => PageMeta;
  /** The link rules for one page, the same ones the page HTML and its Markdown copy use. */
  linkContext: (document: Document) => LinkContext;
  /** The link rules for a file that is not a document of its own, such as a sample of the home page. */
  linkContextFor: (file: string) => LinkContext;
}

let cached: Site | undefined;

/** The color tokens of a site, read from `design/tokens.json`. A site without that file gets none: only a palette needs it. */
function readColorTokens(siteDir: string): TokenColors | undefined {
  const file = join(siteDir, "design", "tokens.json");
  return existsSync(file) ? (JSON.parse(readFileSync(file, "utf8")) as TokenColors) : undefined;
}

/** Load the whole site once per build: config, source files, documents and a renderer. */
export function loadSite(siteDir: string = process.cwd()): Site {
  if (cached) return cached;
  const config = loadSiteConfig(siteDir);
  const sources = readSources(siteDir, config);
  const built = buildDocuments(sources.files, {
    base: config.site.base,
    collections: config.collections,
  });
  const published = publishedRoutes(built);
  const findings = validateContent(sources.files, built, {
    config,
    existing: sources.existing,
  });
  const colorTokens = readColorTokens(siteDir);
  const meta = buildPageMeta(config, () => readGitHistory(sources.root));
  for (const message of meta.warnings) console.warn(`[docs-sitekit] ${message}`);

  const contextFor = (file: string): LinkContext => ({
    file,
    published,
    existing: sources.existing,
    isExcluded: (path) => matchesAny(path, config.anonymize.excludePaths),
    repositoryUrl: config.site.repository,
  });

  // The links of a side card follow the same rules as the links in the text. A link that leads nowhere is left
  // out here and reported by `validateContent`, with the rest of what the card's frontmatter got wrong.
  const documents = built.map((document) => {
    if (!document.card) return document;
    const { card } = resolveCardLinks(document.card, contextFor(document.path));
    const resolved: Document = { ...document };
    if (card) resolved.card = card;
    else delete resolved.card;
    return resolved;
  });

  cached = {
    config,
    version: config.site.version ?? readRepositoryVersion(sources.root),
    documents,
    customBrands: readCustomBrands(siteDir, config),
    findings,
    href: (path) => `${config.site.base}${path.replace(/^\//, "")}`,
    pageMeta: meta.of,
    linkContext: (document) => contextFor(document.path),
    linkContextFor: contextFor,
    render: (document) =>
      renderMarkdown(document.body, {
        context: contextFor(document.path),
        base: config.site.base,
        colorTokens,
      }),
    renderDemo: () =>
      config.demo
        ? renderDemoSamples(siteDir, config.demo, { base: config.site.base, context: contextFor })
        : Promise.resolve(undefined),
  };
  return cached;
}
