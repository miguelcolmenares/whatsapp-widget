import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { serveCdnFromDist } from "./support/cdn";

const BASE = "/whatsapp-widget/";
const PAGES = [BASE, `${BASE}docs/getting-started/`, `${BASE}docs/options/`, `${BASE}configurator/`];

test.beforeEach(async ({ page }) => {
	await serveCdnFromDist(page);
	await page.clock.setFixedTime(new Date("2026-11-02T10:00:00Z"));
});

test.describe("the documentation", () => {
	test("the home page says what the widget is and leads to the docs and to the configurator", async ({ page }) => {
		await page.goto(BASE);
		await expect(page.getByRole("heading", { level: 1 })).toHaveText("WhatsApp Widget");
		await page.getByRole("link", { name: "Get started" }).first().click();
		await expect(page).toHaveURL(`${BASE}docs/getting-started/`);
		await expect(page.getByRole("heading", { level: 1 })).toHaveText("Getting started");
		await expect(page.locator("pre").first()).toContainText("whatsapp-widget.js");
	});

	test("the configurator is one link away from the home page", async ({ page }) => {
		await page.goto(BASE);
		await page.getByRole("link", { name: /configurator/i }).first().click();
		await expect(page).toHaveURL(`${BASE}configurator/`);
		await expect(page.getByRole("heading", { level: 1 })).toHaveText("Widget configurator");
	});

	test("each page of the docs has its address as canonical, on the personal domain", async ({ page }) => {
		for (const path of [BASE, `${BASE}docs/options/`, `${BASE}configurator/`]) {
			await page.goto(path);
			await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
				"href",
				`https://miguelcolmenares.com${path}`,
			);
		}
	});
});

test.describe("nothing leaves the site", () => {
	for (const path of PAGES) {
		test(`${path} asks only this site, and for the configurator also the CDN`, async ({ page, baseURL }) => {
			const hosts = new Set<string>();
			page.on("request", request => hosts.add(new URL(request.url()).host));
			await page.goto(path);
			await page.waitForLoadState("networkidle");
			const allowed = new Set([new URL(baseURL!).host]);
			if (path.endsWith("configurator/")) allowed.add("cdn.jsdelivr.net");
			expect([...hosts].filter(host => !allowed.has(host))).toEqual([]);
		});
	}
});

test.describe("accessibility", () => {
	// Every page has the header and the layout of the kit, and at desktop width they have two findings that belong to
	// docs-sitekit and are not fixed in this site (miguelcolmenares/docs-sitekit#69). All the other rules apply.
	const KIT_ISSUES = ["label-content-name-mismatch", "landmark-unique"];

	for (const path of PAGES) {
		for (const width of [375, 1280]) {
			test(`${path} has no violations at ${width} px`, async ({ page }) => {
				await page.setViewportSize({ width, height: 900 });
				await page.goto(path);
				await page.waitForLoadState("networkidle");
				const configurator = path.endsWith("configurator/");
				// The preview widget is drawn by the code in src/ts, which this change does not touch. It puts a header and a
				// section straight into the body, outside any landmark, and that is for the widget to fix. Its header is a
				// second banner next to the one of the site, so that rule is left out on this page.
				const axe = new AxeBuilder({ page }).disableRules(
					configurator ? [...KIT_ISSUES, "landmark-no-duplicate-banner"] : KIT_ISSUES,
				);
				if (configurator) axe.exclude(".wa-w");
				const { violations } = await axe.analyze();
				expect(
					violations.map(v => `${v.id} (${v.impact}): ${v.nodes.map(n => n.target.join(" ")).join(" | ")}`),
				).toEqual([]);
			});
		}
	}
});

test.describe("the configurator on a small screen", () => {
	for (const width of [320, 375, 1280]) {
		test(`has no horizontal scroll at ${width} px`, async ({ page }) => {
			await page.setViewportSize({ width, height: 800 });
			await page.goto(`${BASE}configurator/`);
			await page.waitForLoadState("networkidle");
			const { scroll, client } = await page.evaluate(() => ({
				scroll: document.documentElement.scrollWidth,
				client: document.documentElement.clientWidth,
			}));
			expect(scroll).toBeLessThanOrEqual(client);
		});
	}
});

test.describe("the configurator is a page of the site", () => {
	const PAGE = `${BASE}configurator/`;

	test("has the header, the footer and the search of the other pages", async ({ page }) => {
		await page.goto(PAGE);
		const header = page.locator("header").first();
		await expect(header.getByRole("link", { name: "WhatsApp Widget" }).first()).toBeVisible();
		for (const name of ["Docs", "Configurator", "Changelog"]) {
			await expect(header.getByRole("link", { name, exact: true }).first()).toBeVisible();
		}
		await expect(page.locator("[data-search-open]").first()).toBeVisible();
		await expect(page.locator("footer")).toBeVisible();
		// The same skip link, and the content in the same <main> the other pages use.
		await expect(page.locator("main#main, #main").first()).toBeAttached();
	});

	test("follows the theme of the site, in both", async ({ page }) => {
		await page.goto(PAGE);
		const surface = () => page.locator("#code-output").evaluate(el => getComputedStyle(el).backgroundColor);
		const html = page.locator("html");
		const first = await html.getAttribute("data-theme");
		const before = await surface();
		await page.getByRole("button", { name: /theme/i }).first().click();
		await expect(html).not.toHaveAttribute("data-theme", first ?? "");
		expect(await surface()).not.toBe(before);
	});

	for (const width of [375, 1280]) {
		test(`has no violations in the light theme at ${width} px`, async ({ page }) => {
			await page.addInitScript(() => localStorage.setItem("theme", "light"));
			await page.setViewportSize({ width, height: 900 });
			await page.goto(PAGE);
			await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
			await expect(page.locator(".wa-w")).toBeAttached();
			const { violations } = await new AxeBuilder({ page })
				.disableRules(["label-content-name-mismatch", "landmark-unique", "landmark-no-duplicate-banner"])
				.exclude(".wa-w")
				.analyze();
			expect(violations.map(v => `${v.id} (${v.impact}): ${v.nodes.map(n => n.target.join(" ")).join(" | ")}`)).toEqual([]);
		});
	}
});
