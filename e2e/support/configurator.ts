import type { Locator, Page } from "@playwright/test";

/** The placeholder of each field of an agent card, which is all the markup gives to find it by. */
const FIELD = {
	name: "Agent name e.g. Customer Service",
	phone: "WhatsApp phone number",
	hours: "Working hours",
	cta: "Click button text",
	message: "Message to start the chat",
} as const;

export type AgentField = keyof typeof FIELD;

export const card = (page: Page, agent: number): Locator => page.locator("#agents-container .agent-card").nth(agent);

/** Types in a field of an agent card. The page reads it on `change`, so the field loses the focus after. */
export async function setAgentField(page: Page, agent: number, field: AgentField, value: string): Promise<void> {
	const input = card(page, agent).getByPlaceholder(FIELD[field]);
	await input.fill(value);
	await input.blur();
}

/** The switch of a day of an agent's schedule. */
export const daySwitch = (page: Page, agent: number, day: number): Locator =>
	page.locator(`#time-${agent}-${day}`).locator("xpath=preceding-sibling::*[1]");

export async function setTime(page: Page, agent: number, day: number, which: "open" | "close", value: string) {
	const input = page.locator(`#time-${agent}-${day} input[type=time]`).nth(which === "open" ? 0 : 1);
	await input.fill(value);
	await input.blur();
}

export const addAgent = (page: Page) => page.getByRole("button", { name: /Add Agent/ }).click();

/** The integration code the page shows, as plain text. */
export const generatedCode = async (page: Page): Promise<string> => (await page.locator("#code-output").textContent()) ?? "";

export type WidgetOptions = {
	title: string;
	description: string;
	agents: Array<{
		name: string;
		phone: string;
		hours: string;
		cta: string;
		message?: string;
		schedule?: Array<[string, string] | null>;
	}>;
};

/**
 * What the generated code gives to `new whatsapp(...)`, read by running the object literal. The text is code the page
 * hands to a visitor, and here it is run to see what it means.
 */
export function optionsOf(code: string): WidgetOptions {
	const literal = code.match(/new whatsapp\((\{[\s\S]*\})\);\s*\}\);\s*<\/script>/)?.[1];
	if (!literal) throw new Error("The generated code has no options object");
	return new Function(`return ${literal}`)() as WidgetOptions;
}

/**
 * Three ways to fill in the configurator. The text each one generates was taken from the page of the `docs` branch
 * before the move to docs-sitekit, and is kept in `e2e/fixtures`. A test compares the page with those files.
 */
export const INPUTS: Record<string, (page: Page) => Promise<void>> = {
	/** The page as it opens. */
	default: async () => {},

	/** Quotes and backslashes in every text, which the code has to escape. */
	escapes: async page => {
		await page.locator("#widget-title").fill(`It's "Help" \\ now`);
		await page.locator("#widget-description").fill(`Chat with us \\ on 'WhatsApp'`);
		await setAgentField(page, 0, "name", `Ana "Support" \\ Sales`);
		await setAgentField(page, 0, "phone", "+57 300 111 2233");
		await setAgentField(page, 0, "hours", `Mon\\Fri "9 to 5"`);
		await setAgentField(page, 0, "cta", `Click "here" \\ now`);
		await setAgentField(page, 0, "message", `Hi \\ "there", it's me`);
	},

	/** Two agents, a day off, new times, and a schedule built from nothing. */
	schedule: async page => {
		await addAgent(page);
		await daySwitch(page, 0, 0).click();
		await setTime(page, 0, 1, "open", "08:30");
		await setTime(page, 0, 1, "close", "17:45");
		await setAgentField(page, 1, "name", "Night desk");
		await daySwitch(page, 1, 5).click();
		await setTime(page, 1, 5, "close", "21:15");
		await daySwitch(page, 1, 2).click();
		await daySwitch(page, 1, 2).click();
	},
};
