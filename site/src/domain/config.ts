import { z } from "zod";
import { iconProblem } from "./brands";
import { DEFAULT_SEVERITY, FINDING_DESCRIPTIONS, FINDING_KINDS, isFindingKind } from "./findings";
import { EDIT_HOSTS } from "./editLink";

const link = z.strictObject({
  label: z.string().min(1).describe("The text of the link."),
  href: z
    .string()
    .min(1)
    .describe("Where the link goes: a path of the site such as `/docs/`, or a full URL."),
});

/**
 * An icon: the name of a lucide icon in kebab-case (`shield-check`), a brand logo that ships with the
 * kit (`brand:github`), or a logo the author added to the brands folder (`brand:custom/my-logo`).
 * An unknown brand fails with its slug and the closest ones.
 */
export const iconName = z
  .string()
  .superRefine((value, context) => {
    const problem = iconProblem(value);
    if (problem) context.addIssue({ code: "custom", message: problem });
  })
  .describe(
    "A lucide icon in kebab-case, such as `shield-check`, or a brand logo, such as `brand:github` or `brand:custom/my-logo`.",
  );

const feature = z.strictObject({
  icon: iconName,
  eyebrow: z.string().min(1).describe("A short mono label above the title."),
  title: z.string().min(1).describe("The title of the card."),
  text: z.string().min(1).describe("The text of the card."),
});

const stat = z.strictObject({
  value: z.string().min(1).describe("The number or short value, shown as the large text."),
  label: z.string().min(1).describe("What the value counts."),
  note: z.string().min(1).optional().describe("A line of text under the value."),
});

const tone = z.enum(["neutral", "brand", "success", "warn"]);

const group = z.strictObject({
  name: z.string().min(1).describe("The heading of the group."),
  tone: tone.default("neutral").describe("The tone of the badge on the cards of the group."),
  /** Slugs of the pages in the group, in the order they appear. */
  items: z
    .array(z.string().min(1))
    .min(1)
    .describe("Slugs of the pages in the group, in the order they appear."),
});

/**
 * The keys that `check` accepts, with what each one looks for and its default severity. They are metadata of the
 * schema, so the configuration reference lists them and a new kind cannot be left out.
 */
function checkKeys(): Record<string, { default: string; description: string }> {
  return Object.fromEntries(
    FINDING_KINDS.map((kind) => [
      kind,
      { default: DEFAULT_SEVERITY[kind], description: FINDING_DESCRIPTIONS[kind] },
    ]),
  );
}

/** Ids that already mean something in the site's routes. */
const RESERVED_IDS = ["changelog", "gallery", "404", "_astro"];

const collection = z.strictObject({
  /** Route segment and menu key, for example `docs`. */
  id: z
    .string()
    .regex(/^[a-z0-9-]+$/, "id must be lowercase letters, digits and hyphens")
    .describe(
      "The route segment and the menu key, unique in the site. `changelog`, `gallery`, `404` and `_astro` are reserved.",
    ),
  label: z.string().min(1).describe("The name of the collection in the menu and as its title."),
  /** Folder to read, relative to the site folder. A page belongs to the collection with the deepest folder. */
  dir: z
    .string()
    .min(1)
    .describe(
      "The folder to read, relative to the site folder. A page belongs to the collection with the deepest folder.",
    ),
  /** One sentence under the collection title. */
  lede: z.string().min(1).optional().describe("One sentence under the title of the collection."),
  /** Optional. When present, every page must be in a group. */
  groups: z
    .array(group)
    .default([])
    .describe(
      "Headings that sort the pages of the collection. When there is any group, every page must be in one.",
    ),
});

/**
 * The closed contract of `sitekit.config.json`. A key that is not declared here is an error,
 * so nothing reaches a published page by accident.
 */
export const siteConfigSchema = z
  .strictObject({
    site: z
      .strictObject({
        name: z
          .string()
          .min(1)
          .describe("The name of the site, in the header, the footer and the title of every page."),
        description: z
          .string()
          .min(1)
          .describe(
            "What the site is about, in one sentence. It is the meta description of a page that has none, and the line under the name in the footer.",
          ),
        /** Origin of the published site, for example `https://user.github.io`. */
        url: z
          .url()
          .describe(
            "The origin of the published site, for example `https://user.github.io`. It is used for canonical links, the sitemap and `llms.txt`.",
          ),
        /** Path the site is served from, `/` or `/repository-name/`. */
        base: z
          .string()
          .regex(/^\/([\w.-]+\/)*$/, "base must start and end with a slash")
          .default("/")
          .describe(
            "The path the site is served from: `/`, or `/repository-name/` on GitHub Pages.",
          ),
        repository: z
          .url()
          .optional()
          .describe(
            "The address of the repository. The header, the footer and `llms.txt` link to it, and `check` asks GitHub for its visibility.",
          ),
        license: z
          .string()
          .min(1)
          .optional()
          .describe("The license of the project, shown in the footer."),
        version: z
          .string()
          .min(1)
          .optional()
          .describe(
            "A version to show in the footer. When it is missing, the site reads it from the `package.json` of the repository.",
          ),
        installCommand: z
          .string()
          .min(1)
          .optional()
          .describe(
            "The command the hero and the closing band offer to copy, for example `npm install my-package`.",
          ),
      })
      .describe("The identity of the site and where it is published."),
    hero: z
      .strictObject({
        badge: z.string().min(1).optional().describe("A short status line above the title."),
        title: z.string().min(1).describe("The headline of the home page."),
        lede: z.string().min(1).describe("The text under the headline."),
        primary: link.describe("The main action of the hero."),
        secondary: link.optional().describe("A second, quieter action."),
      })
      .describe("The top of the home page."),
    features: z
      .array(feature)
      .default([])
      .describe(
        "The cards of the features section of the home page. Without any, the section is left out.",
      ),
    /** Two to five numbers under the hero, each with a label. Written by hand: the kit fetches nothing. */
    stats: z
      .array(stat)
      .refine((stats) => stats.length === 0 || (stats.length >= 2 && stats.length <= 5), {
        message: "stats takes two to five items, or none",
      })
      .default([])
      .describe(
        "Two to five numbers under the hero, each with a label. They are written by hand: the kit fetches nothing. Without any, the row is left out.",
      ),
    nav: z
      .array(link)
      .default([])
      .describe(
        "The links of the header menu. A path that starts with `/` gets the site base. When it is empty, the header lists the collections and the changelog.",
      ),
    footer: z
      .strictObject({
        links: z
          .array(link)
          .default([])
          .describe(
            "Extra links in the Project column of the footer, after the repository and the issues. A path that starts with `/` gets the site base.",
          ),
      })
      .default({ links: [] })
      .describe("The footer of every page."),
    /** The color theme a visitor sees first. A visitor's own choice, saved in the browser, wins over it. */
    theme: z
      .strictObject({
        /** `dark` (the default), `light`, or `system`, which follows the operating system. */
        default: z
          .enum(["dark", "light", "system"])
          .default("dark")
          .describe(
            "The theme a visitor sees first. `system` follows the operating system. A choice the visitor made in the header wins.",
          ),
      })
      .default({ default: "dark" })
      .describe("The color theme a visitor sees first."),
    /** Where the repository is, relative to the site folder, and its changelog. */
    sources: z
      .strictObject({
        /** Root of the repository being documented, relative to the site folder. */
        root: z
          .string()
          .default("..")
          .describe("The root of the repository being documented, relative to the site folder."),
        changelog: z
          .string()
          .default("../CHANGELOG.md")
          .describe(
            "The changelog file, relative to the site folder. It becomes the Changelog page.",
          ),
      })
      .default({ root: "..", changelog: "../CHANGELOG.md" })
      .describe("Where the repository is, relative to the site folder."),
    /** The sets of pages: docs, tutorials, examples. Each is a menu entry with its own index. */
    collections: z
      .array(collection)
      .default([])
      .describe(
        "The sets of pages, such as docs, tutorials and examples. Each is a menu entry with its own index.",
      ),
    deploy: z
      .strictObject({
        target: z
          .enum(["github-pages", "none"])
          .default("github-pages")
          .describe(
            "Where the site is published. `none` skips the repository visibility check of `check`.",
          ),
        /** Say that a private repository's Pages site is meant to be public. */
        acknowledgePublicPages: z
          .boolean()
          .default(false)
          .describe(
            "Say that the Pages site of a private repository is meant to be public. Without it, `check` stops for a repository that is not public.",
          ),
        /** For runners where `gh` cannot tell. Otherwise the check asks GitHub. */
        repositoryVisibility: z
          .enum(["public", "private", "internal"])
          .optional()
          .describe(
            "The visibility of the repository, for a runner where `gh` cannot tell. Otherwise `check` asks GitHub.",
          ),
      })
      .default({ target: "github-pages", acknowledgePublicPages: false })
      .describe("How and where the site is published."),
    /** The search dialog and its index. Off, the site has no search button, no dialog and no `search-index.json`. */
    search: z
      .strictObject({
        enabled: z
          .boolean()
          .default(true)
          .describe(
            "Turn search on. Off, the site has no search button, no dialog and no `search-index.json`.",
          ),
      })
      .default({ enabled: true })
      .describe("The search dialog and its index."),
    anonymize: z
      .strictObject({
        excludePaths: z
          .array(z.string())
          .default([])
          .describe("Glob patterns of files that are never read, relative to `sources.root`."),
        replace: z
          .record(z.string(), z.string())
          .default({})
          .describe(
            "Literal text to swap everywhere, as the text to find and its replacement. For a client name or an internal host.",
          ),
        denyPatterns: z
          .array(z.string())
          .default([])
          .describe(
            "Regular expressions that `check` reports as a leak, besides its built-in credential patterns.",
          ),
        allow: z
          .array(z.string())
          .default([])
          .describe(
            "Exact texts that `check` accepts even though a pattern matches them, for example a public support address.",
          ),
      })
      .default({ excludePaths: [], replace: {}, denyPatterns: [], allow: [] })
      .describe("What is kept out of the site, replaced in it, and treated as a leak."),
    /**
     * How serious each kind of content finding is: `error`, `warning`, or `off`. A kind that is not set
     * keeps its default. A name that is not a kind fails with the name in the message.
     */
    check: z
      .record(z.string(), z.enum(["error", "warning", "off"]))
      .superRefine((kinds, context) => {
        for (const name of Object.keys(kinds)) {
          if (!isFindingKind(name)) {
            context.addIssue({
              code: "custom",
              path: [name],
              message: `"${name}" is not a kind of finding. The kinds are ${FINDING_KINDS.join(", ")}.`,
            });
          }
        }
      })
      .default({})
      .describe(
        "How serious each kind of content finding is. Write the kind as the key and `error`, `warning` or `off` as the value. A kind you do not write keeps its default. A name that is not a kind fails the build and `check`.",
      )
      .meta({ keys: checkKeys() }),
    /**
     * Values a page can write as `{{ name }}` in prose. `version` is read from the package of the repository when
     * it is not set here. A name starts with a letter and has letters, digits, `_` and `-`.
     */
    vars: z
      .record(
        z.string().regex(/^[A-Za-z][\w-]*$/, "a variable name starts with a letter"),
        z.string(),
      )
      .default({})
      .describe(
        "Values a page writes as `{{ name }}` in its text, as the name and its value. A name starts with a letter and has letters, digits, `_` and `-`. `version` is read from the `package.json` of the repository when it is not set here, and a value written here wins over it.",
      ),
    /** A llms.txt map of the site, and optionally a Markdown copy of each page. A site without the key gets neither. */
    llms: z
      .strictObject({
        enabled: z
          .boolean()
          .default(false)
          .describe(
            "Write `llms.txt` at the site base and a discovery link in the head of every page.",
          ),
        /** Collection ids whose pages go under `## Optional`. `changelog` is accepted too. */
        optional: z
          .array(z.string().min(1))
          .default([])
          .describe(
            "Collection ids whose pages go under `## Optional`, the part a tool may skip. `changelog` is accepted too.",
          ),
        markdownPages: z
          .boolean()
          .default(false)
          .describe(
            "Write a Markdown copy of every page and link each page to its copy. It needs `enabled`.",
          ),
      })
      .default({ enabled: false, optional: [], markdownPages: false })
      .describe(
        "A `llms.txt` map of the site, and optionally a Markdown copy of each page. A site without the key gets neither.",
      ),
    /**
     * A link at the foot of every page to its source file on the repository host. A site without the key
     * has no link. The host comes from `site.repository`, and `host` is for a repository on a domain of its own.
     */
    editLink: z
      .strictObject({
        enabled: z
          .boolean()
          .default(false)
          .describe(
            'Show an "Edit this page" link at the foot of every page. It needs `site.repository`: without it, or when the host is not known, the link is turned off with a message.',
          ),
        /** The branch the link opens the file on. */
        branch: z
          .string()
          .min(1)
          .default("main")
          .describe("The branch the link opens the file on."),
        host: z
          .enum(EDIT_HOSTS)
          .optional()
          .describe(
            "The repository host, for a repository on a domain of its own, such as a self-hosted GitLab. Otherwise the host is found from `site.repository`.",
          ),
      })
      .default({ enabled: false, branch: "main" })
      .describe(
        "A link at the foot of every page to its source file on the repository host. A site without the key has no link.",
      ),
    /** The date of the last commit that touched each page, read from git at build time. A site without the key shows none. */
    lastUpdated: z
      .strictObject({
        enabled: z
          .boolean()
          .default(false)
          .describe(
            "Show the date of the last commit that changed the file, read from git at build time. It needs the full history: a shallow clone shows no dates.",
          ),
      })
      .default({ enabled: false })
      .describe(
        "The date of the last change of each page, at the foot of the page. A site without the key shows none.",
      ),
  })
  .superRefine((config, context) => {
    const known = new Set([...config.collections.map((entry) => entry.id), "changelog"]);
    config.llms.optional.forEach((id, index) => {
      if (!known.has(id)) {
        context.addIssue({
          code: "custom",
          path: ["llms", "optional", index],
          message: `llms.optional names "${id}", which is not a collection of this site.`,
        });
      }
    });

    const seen = new Set<string>();
    config.collections.forEach((entry, index) => {
      if (RESERVED_IDS.includes(entry.id)) {
        context.addIssue({
          code: "custom",
          path: ["collections", index, "id"],
          message: `"${entry.id}" is reserved. Pick another id.`,
        });
      }
      if (seen.has(entry.id)) {
        context.addIssue({
          code: "custom",
          path: ["collections", index, "id"],
          message: `Two collections have the id "${entry.id}".`,
        });
      }
      seen.add(entry.id);
    });
  });

/** A validated `sitekit.config.json`. */
export type SiteConfig = z.infer<typeof siteConfigSchema>;
/** A set of pages, as written in the config. */
export type CollectionConfig = z.infer<typeof collection>;
/** A labelled link, used in the navigation and the footer. */
export type NavLink = z.infer<typeof link>;
/** The color theme a site starts with. */
export type ThemeDefault = SiteConfig["theme"]["default"];
/** One card of the home page features section. */
export type Feature = z.infer<typeof feature>;
/** One number of the home page stat row. */
export type Stat = z.infer<typeof stat>;

/** Validate a parsed `sitekit.config.json`. Throws a readable error listing every problem. */
export function parseSiteConfig(input: unknown): SiteConfig {
  const result = siteConfigSchema.safeParse(input);
  if (result.success) return result.data;
  const problems = result.error.issues.map(
    (issue) => `  ${issue.path.join(".") || "(root)"}: ${issue.message}`,
  );
  throw new Error(`Invalid sitekit.config.json:\n${problems.join("\n")}`);
}
