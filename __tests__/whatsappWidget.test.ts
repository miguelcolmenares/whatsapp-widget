import { describe, expect, test } from "@jest/globals";
import { WhatsappWidget } from "../src/ts/whatsappWidget";
import { agent } from "../src/types/agent";

const args : {
    agents : agent[],
    description : string,
    title : string
} = {
    agents : [],
    description : "Test description",
    title : "Test Title"
}

it("works", () => {
    expect(typeof args).toBe("object");
    expect(typeof args.agents).toBe("object");
    expect(typeof args.description).toBe("string");
    expect(typeof args.title).toBe("string");
})

describe("WhatsappWidget", () => {
    const whatsappWidget = new WhatsappWidget(args);
    test("defines render()", () => {
        expect(typeof whatsappWidget.render).toBe("function");
    });
});