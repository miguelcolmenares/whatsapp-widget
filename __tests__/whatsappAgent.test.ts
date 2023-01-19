import { describe, expect, test } from "@jest/globals";
import { WhatsappAgent } from "../src/ts/whatsappAgent";
import { agent } from "../src/types/agent";

describe("WhatsappAgent", () => {
    const args : agent = {
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

    const whatsappAgent = new WhatsappAgent(args);

    test("defines render()", () => {
        expect(typeof whatsappAgent.render).toBe("function");
    });

    test("defines isEnabled", () => {
        expect(typeof whatsappAgent.isEnabled).toBe("boolean");
    })
});
