import type { DemoExample } from "@/domain";
import type { DemoCatalog } from "./read-demos";
import { renderMarkdown } from "./render-markdown";

/** An example ready for the presentation layer, with source safely highlighted by the ordinary Markdown pipeline. */
export interface RenderedDemo {
  example: DemoExample;
  sources: Record<string, string>;
}

/** Prepare one example without executing it or importing its source into the documentation runtime. */
export async function renderDemo(
  catalog: DemoCatalog,
  id: string | undefined,
  options: Parameters<typeof renderMarkdown>[1],
): Promise<RenderedDemo | undefined> {
  if (!id) return undefined;
  const example = catalog.manifest.examples.find((entry) => entry.id === id);
  if (!example) throw new Error(`Unknown demo "${id}".`);
  const entries = [
    ...example.sources,
    ...(example.variants ?? []).flatMap((variant) => variant.sources ?? []),
  ];
  const sources = new Map<string, string>();
  for (const source of entries) {
    if (sources.has(source.path)) continue;
    const code = catalog.sources[source.path]!;
    const fence = "`".repeat(
      Math.max(3, ...[...code.matchAll(/`+/g)].map((match) => match[0].length + 1)),
    );
    sources.set(
      source.path,
      (await renderMarkdown(`${fence}${source.language}\n${code}\n${fence}`, options)).html,
    );
  }
  return { example, sources: Object.fromEntries(sources) };
}
