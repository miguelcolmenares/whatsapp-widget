import { describe, expect, it, test } from "@jest/globals";
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
};

const emptyDescriptionArgs = {
    ...args,
    description : ""
};

const emptyTitleArgs = {
    ...args,
    title : ""
};

const emptyAgentsArgs = {
    ...args,
    agents : []
};

it("works", () => {
    expect(typeof args).toBe("object");
    expect(typeof args.agents).toBe("object");
    expect(typeof args.description).toBe("string");
    expect(typeof args.title).toBe("string");
});

describe("WhatsappWidget", () => {
    const whatsappWidget = new WhatsappWidget(args);
    const emptyDescriptionWidget = new WhatsappWidget(emptyDescriptionArgs);
    const emptyTitleWidget = new WhatsappWidget(emptyTitleArgs);

    test("constructor method", () => {
        expect(whatsappWidget).toBeInstanceOf(WhatsappWidget);
    });

    test("defines render()", () => {
        expect(typeof whatsappWidget.render).toBe("function");
    });

    test("defines agents", () => {
        expect(typeof whatsappWidget.agents).toBe("object");
    });

    test("renders correctly with active agents", () => {
		const activeAgent: agent = {
			name: "Active Agent",
			phone: "123456789",
			hours: "9:00 - 17:00",
			cta: "Chat Now",
			message: "Hello!",
		};

		const widgetWithActiveAgent = new WhatsappWidget({
			title: "Test Title",
			description: "Test description",
			agents: [activeAgent],
		});

		expect(widgetWithActiveAgent.render()).toMatchSnapshot();
	});

    test("empty description get default description", () => {
        expect(emptyDescriptionWidget.description).toBe("Chatea con nosotros por Whatsapp");
    });

    test("empty description don't return an empty string", () => {
        expect(emptyDescriptionWidget.description).not.toBe("");
    });

    test("empty title get default title", () => {
        expect(emptyTitleWidget.title).toBe("¿Necesitas ayuda?");
    });

    test("empty title don't return an empty string", () => {
        expect(emptyTitleWidget.title).not.toBe("");
    });

    test("empty agents get an empty array", () => {
        expect(emptyAgentsArgs.agents).toStrictEqual([]);
    });

    test("define set and get widget", () => {
        const widget = whatsappWidget.widget;
        expect(widget).toBe(whatsappWidget.widget);
    });

    test("define get widget should be an HTMLElement", () => {
        const widget = document.createElement("div");
        whatsappWidget.widget = widget;
        expect(whatsappWidget.widget).toBeInstanceOf(HTMLElement);
    });
});