import { defineConfig, devices } from "@playwright/test";
import { join } from "node:path";

const PORT = Number(process.env.E2E_PORT ?? 4410);

/**
 * Tests of the documentation site and of the configurator. They run against the site as it is built (`npm run site:build`),
 * served with the base path it has on GitHub Pages. The clock is the UTC one, so that the schedule tests do not depend
 * on where they run.
 */
export default defineConfig({
	testDir: __dirname,
	testMatch: "*.spec.ts",
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
	use: {
		baseURL: `http://127.0.0.1:${PORT}`,
		timezoneId: "UTC",
		locale: "en-US",
		trace: "on-first-retry",
	},
	projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
	webServer: {
		command: `node e2e/serve.mjs --dist site/dist --base /whatsapp-widget/ --port ${PORT}`,
		cwd: join(__dirname, ".."),
		url: `http://127.0.0.1:${PORT}/whatsapp-widget/`,
		reuseExistingServer: !process.env.CI,
	},
});
