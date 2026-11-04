import type { APIRoute } from "astro";
import { buildSearchIndex } from "../application";
import { loadSite } from "../infrastructure";

/** The one file this route makes: `search-index.json`. The route exists only when search is on. */
const FILE = "search-index";

/** The paths of this route: the search index file when search is on, none when it is off. */
export function getStaticPaths() {
  return loadSite().config.search.enabled ? [{ params: { name: FILE } }] : [];
}

/** Builds the search index from the loaded site and serves it as JSON. */
export const GET: APIRoute = () => {
  const site = loadSite();
  const index = buildSearchIndex(site.documents, { collections: site.config.collections });
  return new Response(JSON.stringify(index), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};
