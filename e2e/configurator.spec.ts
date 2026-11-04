import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { serveCdnFromDist } from "./support/cdn";
import { INPUTS, addAgent, card, daySwitch, generatedCode, optionsOf, setAgentField } from "./support/configurator";

const PAGE = "/whatsapp-widget/configurator/";
/** A Monday at ten in the morning (UTC), when the agent that the page starts with is open (Monday, 9:00 to 20:00). */
const MONDAY_MORNING = new Date("2026-11-02T10:00:00Z");
const MONDAY_NIGHT = new Date("2026-11-02T21:00:00Z");

test.beforeEach(async ({ page }) => {
	await serveCdnFromDist(page);
	await page.clock.setFixedTime(MONDAY_MORNING);
});

test.describe("the code it generates", () => {
	for (const name of Object.keys(INPUTS)) {
		test(`is the same, to the letter, as the page before the move (${name})`, async ({ page }) => {
			await page.goto(PAGE);
			await INPUTS[name]!(page);
			const expected = readFileSync(join(__dirname, "fixtures", `code-${name}.txt`), "utf8");
			expect(await generatedCode(page)).toBe(expected);
		});
	}

	test("escapes quotes and backslashes, so the options give back what was typed", async ({ page }) => {
		await page.goto(PAGE);
		await INPUTS.escapes!(page);
		const parsed = optionsOf(await generatedCode(page));
		expect(parsed.title).toBe(`It's "Help" \\ now`);
		expect(parsed.description).toBe(`Chat with us \\ on 'WhatsApp'`);
		expect(parsed.agents[0]).toMatchObject({
			name: `Ana "Support" \\ Sales`,
			phone: "+57 300 111 2233",
			hours: `Mon\\Fri "9 to 5"`,
			cta: `Click "here" \\ now`,
			message: `Hi \\ "there", it's me`,
		});
	});

	test("loads the widget from the CDN address, not from the site", async ({ page }) => {
		await page.goto(PAGE);
		expect(await generatedCode(page)).toContain(
			'"https://cdn.jsdelivr.net/gh/miguelcolmenares/whatsapp-widget/dist/js/whatsapp-widget.js"',
		);
	});
});

test.describe("the agents", () => {
	test("the page starts with one, and cannot remove the last", async ({ page }) => {
		await page.goto(PAGE);
		await expect(page.locator("#agents-container .agent-card")).toHaveCount(1);
		await expect(page.getByRole("button", { name: /Remove/ })).toHaveCount(0);
	});

	test("adds an agent, shows it in the code, and removes it", async ({ page }) => {
		await page.goto(PAGE);
		await addAgent(page);
		await expect(page.locator("#agents-container .agent-card")).toHaveCount(2);
		await setAgentField(page, 1, "name", "Night desk");
		expect(await generatedCode(page)).toContain('name: "Night desk"');

		await card(page, 1).getByRole("button", { name: /Remove/ }).click();
		await expect(page.locator("#agents-container .agent-card")).toHaveCount(1);
		expect(await generatedCode(page)).not.toContain("Night desk");
	});

	test("a day switched off is null in the schedule, and switched on again it gets 9:00 to 18:00", async ({ page }) => {
		await page.goto(PAGE);
		await daySwitch(page, 0, 3).click();
		expect(optionsOf(await generatedCode(page)).agents[0]!.schedule![3]).toBeNull();

		await daySwitch(page, 0, 3).click();
		expect(optionsOf(await generatedCode(page)).agents[0]!.schedule![3]).toEqual(["09:00", "18:00"]);
	});
});

test.describe("the copy button", () => {
	test.use({ permissions: ["clipboard-read", "clipboard-write"] });

	test("copies the code and says so for two seconds", async ({ page }) => {
		await page.goto(PAGE);
		const button = page.locator(".copy-btn");
		await button.click();
		await expect(button).toHaveText("✅ Copied!");
		expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(await generatedCode(page));
		await expect(button).toHaveText("📋 Copy Code", { timeout: 5000 });
	});
});

test.describe("the preview widget", () => {
	test("is drawn, opens, and shows the agent that is open", async ({ page }) => {
		await page.goto(PAGE);
		await expect(page.locator(".wa-w")).toBeAttached();
		await expect(page.locator(".wa-w")).not.toHaveClass(/open/);

		await page.locator(".wa-w_b").click();
		await expect(page.locator(".wa-w")).toHaveClass(/open/);
		await expect(page.locator(".wa-w_h_t")).toHaveText("¿Necesitas ayuda?");
		await expect(page.locator(".wa-w_a_a")).toHaveCount(1);
		await expect(page.locator(".wa-w_a_a .a_t")).toHaveText("Servicio al cliente");
	});

	test("follows what is typed in the form", async ({ page }) => {
		await page.goto(PAGE);
		await expect(page.locator(".wa-w")).toBeAttached();
		await page.locator("#widget-title").fill("Talk to us");
		await expect(page.locator(".wa-w_h_t")).toHaveText("Talk to us");
		await setAgentField(page, 0, "name", "Ana");
		await expect(page.locator(".wa-w_a_a .a_t")).toHaveText("Ana");
	});

	test("is not drawn when no agent is open", async ({ page }) => {
		await page.clock.setFixedTime(MONDAY_NIGHT);
		await page.goto(PAGE);
		await expect(page.locator("#code-output")).not.toBeEmpty();
		// The widget draws itself after its styles load, so give it the time it would need before saying it is absent.
		await page.waitForTimeout(500);
		await expect(page.locator(".wa-w")).toHaveCount(0);
	});

	test("loads the widget from this site, and only the styles and the fonts from the CDN", async ({ page }) => {
		const requests: string[] = [];
		page.on("request", request => requests.push(request.url()));
		await page.goto(PAGE);
		await expect(page.locator(".wa-w")).toBeAttached();
		expect(requests).toContain(new URL("/whatsapp-widget/dist/js/whatsapp-widget.js", page.url()).href);
		const cdn = requests.filter(url => url.startsWith("https://cdn.jsdelivr.net/"));
		expect(cdn.length).toBeGreaterThan(0);
		expect(cdn.filter(url => !/\/dist\/(css|fonts)\//.test(url))).toEqual([]);
	});
});
