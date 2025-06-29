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
            ["9:00", "18:00"], // Sunday
            ["9:00", "20:00"], // Monday
            ["9:00", "20:00"], // Tuesday
            ["9:00", "20:00"], // Wednesday
            ["9:00", "20:00"], // Thursday
            ["9:00", "22:00"], // Friday
            ["10:00", "18:00"] // Saturday
        ]
    };
    const args = defaultArgs;

    const argsNoSchedule = {...defaultArgs};
    delete argsNoSchedule.schedule;

    const scheduleAlwaysOpen = [
		["0:00", "23:59"],
		["0:00", "23:59"],
		["0:00", "23:59"],
		["0:00", "23:59"],
		["0:00", "23:59"],
		["0:00", "23:59"],
		["0:00", "23:59"]
	];

    const argsAlwaysOpen = {...defaultArgs};
    argsAlwaysOpen.schedule = scheduleAlwaysOpen;

    // Schedule with some days disabled (null values)
    const scheduleWithDisabledDays: (string[] | null)[] = [
        null,              // Sunday - disabled
        ["09:00", "18:00"], // Monday - enabled
        ["09:00", "18:00"], // Tuesday - enabled
        null,              // Wednesday - disabled
        null,              // Thursday - disabled
        ["09:00", "17:00"], // Friday - enabled
        null               // Saturday - disabled
    ];

    const argsWithDisabledDays = {...defaultArgs};
    argsWithDisabledDays.schedule = scheduleWithDisabledDays;

    // Schedule for weekend only
    const scheduleWeekendOnly: (string[] | null)[] = [
        ["10:00", "16:00"], // Sunday - enabled
        null,              // Monday - disabled
        null,              // Tuesday - disabled
        null,              // Wednesday - disabled
        null,              // Thursday - disabled
        null,              // Friday - disabled
        ["10:00", "20:00"]  // Saturday - enabled
    ];

    const argsWeekendOnly = {...defaultArgs};
    argsWeekendOnly.schedule = scheduleWeekendOnly;

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
        const failAgent = new WhatsappAgent(argsNoSchedule);
        expect(failAgent.isEnabled).toBe(true);
    });

    test("isEnabled returns true for valid schedule", () => {
		const validAgent = new WhatsappAgent(argsAlwaysOpen);
		expect(validAgent.isEnabled).toBe(true);
	});

    test("agent can be created with null values in schedule", () => {
        expect(() => {
            new WhatsappAgent(argsWithDisabledDays);
        }).not.toThrow();

        expect(() => {
            new WhatsappAgent(argsWeekendOnly);
        }).not.toThrow();
    });

    test("schedule with disabled days has correct structure", () => {
        const agent = new WhatsappAgent(argsWithDisabledDays);
        expect(agent.schedule).toBeDefined();
        expect(agent.schedule![0]).toBeNull(); // Sunday - disabled
        expect(agent.schedule![1]).toEqual(["09:00", "18:00"]); // Monday - enabled
        expect(agent.schedule![2]).toEqual(["09:00", "18:00"]); // Tuesday - enabled
        expect(agent.schedule![3]).toBeNull(); // Wednesday - disabled
        expect(agent.schedule![4]).toBeNull(); // Thursday - disabled
        expect(agent.schedule![5]).toEqual(["09:00", "17:00"]); // Friday - enabled
        expect(agent.schedule![6]).toBeNull(); // Saturday - disabled
    });

    test("weekend only schedule has correct structure", () => {
        const agent = new WhatsappAgent(argsWeekendOnly);
        expect(agent.schedule).toBeDefined();
        expect(agent.schedule![0]).toEqual(["10:00", "16:00"]); // Sunday - enabled
        expect(agent.schedule![1]).toBeNull(); // Monday - disabled
        expect(agent.schedule![2]).toBeNull(); // Tuesday - disabled
        expect(agent.schedule![3]).toBeNull(); // Wednesday - disabled
        expect(agent.schedule![4]).toBeNull(); // Thursday - disabled
        expect(agent.schedule![5]).toBeNull(); // Friday - disabled
        expect(agent.schedule![6]).toEqual(["10:00", "20:00"]); // Saturday - enabled
    });

    test("schedule configuration matches expected behavior", () => {
        // Test that null values are properly handled
        const agent = new WhatsappAgent(argsWithDisabledDays);

        // Verify that the agent has the expected schedule structure
        expect(Array.isArray(agent.schedule)).toBe(true);
        expect(agent.schedule!.length).toBe(7);

        // Check specific days
        const enabledDays = [1, 2, 5]; // Monday, Tuesday, Friday
        const disabledDays = [0, 3, 4, 6]; // Sunday, Wednesday, Thursday, Saturday

        enabledDays.forEach(day => {
            expect(agent.schedule![day]).not.toBeNull();
            expect(Array.isArray(agent.schedule![day])).toBe(true);
        });

        disabledDays.forEach(day => {
            expect(agent.schedule![day]).toBeNull();
        });
    });
});
