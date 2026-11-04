import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Page } from "@playwright/test";

const DIST = join(__dirname, "..", "..", "dist");
const TYPES: Record<string, string> = {
	".css": "text/css",
	".js": "text/javascript",
	".svg": "image/svg+xml",
	".woff": "font/woff",
	".woff2": "font/woff2",
};

/** Every address of the CDN. The widget asks it for its styles, and the styles ask it for the icon font. */
export const CDN = /^https:\/\/cdn\.jsdelivr\.net\//;

/**
 * Answers the requests to the CDN with the files of the `dist/` folder of this checkout, so a test does not depend on
 * the network or on what the CDN has cached. Returns the list of the addresses that were asked for.
 */
export async function serveCdnFromDist(page: Page): Promise<string[]> {
	const asked: string[] = [];
	await page.route(CDN, route => {
		const url = new URL(route.request().url());
		asked.push(url.href);
		const file = url.pathname.match(/\/dist\/(.+)$/)?.[1];
		const path = file ? join(DIST, file) : "";
		if (!file || !existsSync(path)) return route.fulfill({ status: 404, body: "" });
		const extension = path.slice(path.lastIndexOf("."));
		return route.fulfill({
			status: 200,
			contentType: TYPES[extension] ?? "application/octet-stream",
			body: readFileSync(path),
		});
	});
	return asked;
}
