import { agent } from "./agent";
export declare class WhatsappAgent {
    cta: string;
    hours: string;
    message: string;
    name: string;
    phone: string;
    schedule?: string[][];
    constructor(args: agent);
    get isEnabled(): boolean;
    render(): DocumentFragment;
}
