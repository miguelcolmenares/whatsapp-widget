import striptags from "striptags";
import { agent } from "../types/agent";
export class WhatsappAgent {
    public cta : string
    public hours : string
    public message : string
    public name : string
    public phone : string
    public schedule ?: string[][]
    constructor(args : agent) {
        this.cta = args.cta
        this.hours = args.hours
        this.message = args.message
        this.name = args.name
        this.phone = args.phone
        this.schedule = args.schedule
    }

    get isEnabled() {
        const date = new Date();
		if (!this?.schedule?.length
            || !this?.schedule[date.getDay()]?.length
        )
        return !0;
		const [_start, _end] = [this.schedule[date.getDay()][0].split(":"), this.schedule[date.getDay()][1].split(":")];
		const [openTime, closeTime] = [new Date(date.getFullYear(), date.getMonth(), date.getDate() < 10 ? 0 + date.getDate() : date.getDate(), +_start[0], +_start[1]), new Date(date.getFullYear(), date.getMonth(), date.getDate() < 10 ? 0 + date.getDate() : date.getDate(), +_end[0], +_end[1])];
		if (date.getTime() >= openTime.getTime() && date.getTime() <= closeTime.getTime()) return !0;
		return !!0;
    }

    render() {
		const agent = document.createRange().createContextualFragment(`<a href="#" data-phone="${striptags(this.phone)}" data-title="${striptags(this.name)}" data-message="${striptags(this.message)}" class="wa-w_a_a js-owaa" title="${striptags(this.name)} ${striptags(this.phone)}">
			<span class="wa-w_a_a_i"><span class="wa-w-i wa-w-i-cc"></span></span>
			<span class="wa-w_a_a_c">
				<span class="a_t">${striptags(this.name)}</span>
				<span class="a_s">${striptags(this.hours)}</span>
				<span class="a_c">${striptags(this.cta)}<span class="a_c_i wa-w-i wa-w-i-e"></span></span>
			</span>
		</a>`);
		return agent;
	}
}