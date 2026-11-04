import { buildLlmsText } from "../application";
import { absoluteUrl, LLMS_FILE, markdownPath, renderMarkdownPage } from "../domain";
import { loadSite } from "../infrastructure";

/**
 * Text files the build writes next to the pages, from the site content: llms.txt, and with
 * `llms.markdownPages` the Markdown copy of every page. With `llms.enabled` off there are no
 * paths, so nothing is written.
 */
export function getStaticPaths() {
  const site = loadSite();
  const { config } = site;
  if (!config.llms.enabled) return [];

  const paths: { params: { file: string }; props: { body: string } }[] = [
    { params: { file: LLMS_FILE }, props: { body: buildLlmsText(config, site.documents) } },
  ];
  if (config.llms.markdownPages) {
    for (const document of site.documents) {
      paths.push({
        params: { file: markdownPath(document.route, config.site.base) },
        props: {
          body: renderMarkdownPage(document, {
            context: site.linkContext(document),
            origin: config.site.url,
            pageUrl: absoluteUrl(config.site.url, document.route),
          }),
        },
      });
    }
  }
  return paths;
}

/** Serves the text that `getStaticPaths` prepared for this file, as plain text. */
export function GET({ props }: { props: { body: string } }) {
  return new Response(props.body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
