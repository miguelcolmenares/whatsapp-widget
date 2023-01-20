import { describe, expect, test } from "@jest/globals";
import { WhatsappAgent } from "../src/ts/whatsappAgent";
import { agent } from "../src/types/agent";

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
            ["10:00", "18:00"] // Saturday
        ]
    }
    const args = defaultArgs;

    const {schedule, ...argsNoShedule} = defaultArgs;

    test("constructor method", () => {
        const whatsappAgent = new WhatsappAgent(args);
        expect(whatsappAgent).toBeInstanceOf(WhatsappAgent);
    });

    test("defines render()", () => {
        const whatsappAgent = new WhatsappAgent(args);
        expect(typeof whatsappAgent.render).toBe("function");
    });

    test("defines isEnabled", () => {
        const whatsappAgent = new WhatsappAgent(args);
        expect(typeof whatsappAgent.isEnabled).toBe("boolean");
    })

    test("isEnabled returns true when schedule is not defined", () => {
        const failAgent = new WhatsappAgent(argsNoShedule);
        expect(failAgent.isEnabled).toBe(true);
    })
});
