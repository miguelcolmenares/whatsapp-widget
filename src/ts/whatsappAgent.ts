import striptags from "striptags";
import { agent } from "../types/agent";
export class WhatsappAgent {
	public cta: string;
	public hours: string;
	public message: string;
	public name: string;
	public phone: string;
	public schedule?: (string[] | null)[];
	constructor(args: agent) {
		this.cta = args.cta;
		this.hours = args.hours;
		this.message = args.message;
		this.name = args.name;
		this.phone = args.phone;
		this.schedule = args.schedule;
	}

	get isEnabled(): boolean {
		const date = new Date();
		const dayIndex = date.getDay();

		// If no schedule is defined, agent is always available
		if (!this?.schedule?.length) return true;

		// If current day has no schedule or is null, agent is not available
		const daySchedule = this.schedule[dayIndex];
		if (!daySchedule || daySchedule.length < 2) return false;

		const [_start, _end] = [daySchedule[0].split(":"), daySchedule[1].split(":")];
		const [openTime, closeTime] = [
			new Date(
				date.getFullYear(),
				date.getMonth(),
				date.getDate() < 10 ? 0 + date.getDate() : date.getDate(),
				+_start[0],
				+_start[1],
			),
			new Date(
				date.getFullYear(),
				date.getMonth(),
				date.getDate() < 10 ? 0 + date.getDate() : date.getDate(),
				+_end[0],
				+_end[1],
			),
		];

		return date.getTime() >= openTime.getTime() && date.getTime() <= closeTime.getTime();
	}

	render(): DocumentFragment {
		const agent = document.createRange().createContextualFragment(`<a href="#" data-phone="${striptags(
			this.phone,
		)}" data-title="${striptags(this.name)}" data-message="${striptags(
			this.message,
		)}" class="wa-w_a_a js-owaa" title="${striptags(this.name)} ${striptags(this.phone)}">
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
