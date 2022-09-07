import { agent } from "./agent";
export declare class WhatsappWidget {
    #private;
    agents: agent[];
    description: string;
    title: string;
    private package;
    private url;
    private version;
    private $widget;
    constructor(args: {
        title: string;
        description: string;
        agents: agent[];
    });
    get widget(): HTMLElement;
    set widget($element: HTMLElement);
    render(): HTMLDivElement;
}
