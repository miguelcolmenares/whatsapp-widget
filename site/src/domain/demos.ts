import { z } from "zod";

const id = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "use lowercase words separated by hyphens");
const text = z.string().trim().min(1);

/** A local, unencoded path inside the configured demo directory. Filesystem containment is checked when reading it. */
export const demoPathSchema = z
  .string()
  .min(1)
  .refine(
    (value) =>
      !/[\\\\:%?#]/.test(value) &&
      [...value].every((character) => character.charCodeAt(0) >= 32) &&
      value.split("/").every((part) => part !== "" && part !== "." && part !== ".."),
    "use a relative local path without URLs, encoding or traversal",
  );

const source = z.strictObject({
  path: demoPathSchema,
  language: z
    .string()
    .regex(/^[a-z][a-z0-9+-]*$/, "use a code language such as html, javascript or php"),
  label: text.optional(),
});
const preview = demoPathSchema.refine(
  (value) => value.endsWith(".html"),
  "preview must be an .html file",
);
const variant = z.strictObject({
  id,
  title: text,
  preview,
  sources: z.array(source).min(1).optional(),
});
const viewport = z.strictObject({
  label: text,
  width: z.number().int().min(240).max(2560),
  height: z.number().int().min(120).max(1600).optional(),
});
const api = z.strictObject({
  name: text,
  type: text,
  description: text,
  required: z.boolean().optional(),
  default: z.string().optional(),
});
const example = z.strictObject({
  id,
  title: text,
  preview,
  sources: z.array(source).min(1),
  variants: z.array(variant).optional(),
  viewports: z.array(viewport).optional(),
  api: z.array(api).optional(),
});

/** The closed, framework-independent contract of a directory's manifest.json. It describes prebuilt files, never executable build instructions. */
export const demoManifestSchema = z
  .strictObject({
    schemaVersion: z.literal(1),
    examples: z.array(example),
  })
  .superRefine((manifest, context) => {
    const unique = (values: readonly string[], path: (string | number)[]) => {
      const seen = new Set<string>();
      values.forEach((value, index) => {
        if (seen.has(value))
          context.addIssue({
            code: "custom",
            path: [...path, index],
            message: `Duplicate identifier "${value}".`,
          });
        seen.add(value);
      });
    };
    unique(
      manifest.examples.map((entry) => entry.id),
      ["examples"],
    );
    manifest.examples.forEach((entry, index) => {
      unique(
        (entry.variants ?? []).map((item) => item.id),
        ["examples", index, "variants"],
      );
      unique(
        (entry.viewports ?? []).map((item) => item.label),
        ["examples", index, "viewports"],
      );
      unique(
        (entry.api ?? []).map((item) => item.name),
        ["examples", index, "api"],
      );
    });
  });

/** A validated demo manifest. Optional lists remain optional so producers can use the same contract in other documentation tools. */
export type DemoManifest = z.infer<typeof demoManifestSchema>;
/** One documented example, with its initial preview, optional variants and API reference. */
export type DemoExample = DemoManifest["examples"][number];
/** A text file displayed as source code, never evaluated by the documentation site. */
export type DemoSource = DemoExample["sources"][number];

/** Validate a parsed manifest and report each problem with its field path. */
export function parseDemoManifest(value: unknown): DemoManifest {
  const result = demoManifestSchema.safeParse(value);
  if (result.success) return result.data;
  throw new Error(
    `Invalid demo manifest:\n${result.error.issues.map((issue) => `  ${issue.path.join(".") || "(root)"}: ${issue.message}`).join("\n")}`,
  );
}

/** Read the optional demo identifier from Markdown frontmatter, failing instead of silently hiding an invalid reference. */
export function readDemoId(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  const result = id.safeParse(value);
  if (result.success) return result.data;
  throw new Error(
    'Frontmatter "demo" must name an example with lowercase words separated by hyphens.',
  );
}
