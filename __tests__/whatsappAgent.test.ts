import { describe, expect, test } from "@jest/globals";
import { WhatsappAgent } from "../src/ts/whatsappAgent";
import { type agent } from "../src/types/agent";

describe("WhatsappAgent", () => {
    const defaultArgs : agent = {
        cta : "test cta",
        hours : "test hours",
        message : "test message",
        name : "test name",
        phone : "test phone",
        schedule : [
            ["9:00", "18:00"],
            ["9:00", "20:00"],
            ["9:00", "20:00"],
            ["9:00", "20:00"],
            ["9:00", "20:00"],
            ["9:00", "22:00"],
            ["10:00", "23:30"] // Saturday
        ]
    };
    const args = defaultArgs;

    const argsNoShedule = {...defaultArgs};
    delete argsNoShedule.schedule;

    const scheduleAllwaysOpen = [
		["0:00", "23:59"],
		["0:00", "23:59"],
		["0:00", "23:59"],
		["0:00", "23:59"],
		["0:00", "23:59"],
		["0:00", "23:59"],
		["0:00", "23:59"] // Saturday
	];

    const argsAllwaysOpen = {...defaultArgs};
    argsAllwaysOpen.schedule = scheduleAllwaysOpen;

    test("constructor method", () => {
        const whatsappAgent = new WhatsappAgent(args);
        expect(whatsappAgent).toBeInstanceOf(WhatsappAgent);
    });

    test("defines render()", () => {
        const whatsappAgent = new WhatsappAgent(args);
        expect(typeof whatsappAgent.render).toBe("function");
    });

    test("render() returns a valid DocumentFragment", () => {
		const whatsappAgent = new WhatsappAgent(args);
		const fragment = whatsappAgent.render();

		const container = document.createElement("div");
		container.appendChild(fragment);

		// Verifica si el contenedor tiene los elementos esperados
		expect(container.querySelector(".wa-w_a_a_i")).toBeDefined();
		expect(container.querySelector(".wa-w_a_a_c")).toBeDefined();
	});

    test("defines isEnabled", () => {
        const whatsappAgent = new WhatsappAgent(args);
        expect(typeof whatsappAgent.isEnabled).toBe("boolean");
    });

    test("isEnabled returns true when schedule is not defined", () => {
        const failAgent = new WhatsappAgent(argsNoShedule);
        expect(failAgent.isEnabled).toBe(true);
    });

    test("isEnabled returns true for valid schedule", () => {
		const validAgent = new WhatsappAgent(argsAllwaysOpen);
		expect(validAgent.isEnabled).toBe(true);
	});
});
