import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { loadSiteConfig } from "./src/infrastructure/site-config";
import { reportFindings } from "./src/infrastructure/report-findings";

const { site } = loadSiteConfig(process.cwd());

export default defineConfig({
  site: site.url,
  base: site.base,
  trailingSlash: "always",
  build: { format: "directory" },
  integrations: [react(), sitemap(), reportFindings()],
  vite: { plugins: [tailwindcss()] },
});
