"use strict";
class WhatsappWidget {
	constructor({
		title       = "¿Necesitas ayuda?",
		description = "Chatea con nosotros por Whatsapp",
		agents      = []
	}) {
		this.agents      = agents,
		this.description = description,
		this.package     = "{{package}}",
		this.title       = title,
		this.url         = "{{url}}@{{version}}",
		this.version     = "{{version}}",
		this.$widget;
		if (!this.agents.length) return;
		if (this._activeAgents() === 0) return;
		this.render();
	}
	_activeAgents(){
		let agentsActive = 0;
		this.agents.forEach(agent => {
			const _agent = new WhatsappAgent(agent);
			_agent.isEnabled ? agentsActive++ : "";
		});
		return agentsActive;
	}
	_agents() {
		const agentsContainer = document.createElement("section");
		agentsContainer.classList.add("wa-w_a");
		this.agents.forEach(agent => {
			const _agent = new WhatsappAgent(agent);
			_agent.isEnabled ? agentsContainer.append(new WhatsappAgent(agent).render()) : "";
		});
		return agentsContainer;
	}
	_button() {
		const button = document.createRange().createContextualFragment(
		`<button class="wa-w_b" title="${this.title}">
			<span class="wa-w-i wa-w-i-w"></span>
		</button>`);
		return button;
	}
	_click() {
		if ("dataLayer" in window) {
			// eslint-disable-next-line no-undef
			dataLayer.push({
				event: "ga_event",
				category: "Widget WhatsApp",
				action: "Click WhatsApp",
				label: "Click Icono"
			});
		}
		this.widget.classList.toggle("open");
	}
	_clickAgent({ message = "", phone = "", title = "" }) {
		if ("dataLayer" in window) {
			// eslint-disable-next-line no-undef
			dataLayer.push({
				event: "ga_event",
				category: "Widget WhatsApp",
				action: "Click WhatsApp",
				label: title,
			});
		}
		const text = message.length ? `?text=${message}` : "";
		window.open(
			`https://wa.me/${phone.replace(/ /g, "").replace("+", "")}${text}`,
			"_blank"
		);
	}
	_header() {
		return document.createRange().createContextualFragment(
			`<header class="wa-w_h">
			<span class="wa-w_h_t">${this.title}</span>
			<span class="wa-w_h_s">
				<span class="wa-w_h_i wa-w-i wa-w-i-w"></span>
				${this.description}
			</span>
		</header>`);
	}
	async _styles() {
		const styles = document.createElement("style");
		await fetch(`${this.url}/dist/css/${this.package}.css`)
			.then(res => res.text())
			.then(style => styles.append(style));
		return document.head.append(styles);
	}
	async render() {
		await this._styles();

		const widget = document.createElement("div");
		widget.classList.add("wa-w");
		widget.append(this._header());
		widget.append(this._agents());
		widget.append(this._button());
		document.body.append(widget);

		//button click
		widget.querySelector(".wa-w_b").addEventListener("click", () => {
			this._click();
		});

		//agent click
		widget.querySelectorAll(".js-owaa").forEach(agent => {
			agent.addEventListener("click", e => {
				e.preventDefault();
				this._clickAgent(agent.dataset);
			});
		});

		return this.widget = widget;
	}
	get widget() {
		return this.$widget;
	}
	set widget($element) {
		this.$widget = $element;
	}
}
class WhatsappAgent {
	constructor({
		cta = "",
		hours = "",
		message = "",
		name = "",
		phone = "",
		schedule = []
	}) {
		this.cta = cta,
		this.description = hours,
		this.message = message,
		this.name = name,
		this.phone = phone,
		this.schedule = schedule;
	}
	get isEnabled() {
		const date = new Date();
		if (!this.schedule.length || !this.schedule[date.getDay()].length) return !0;
		const [_start, _end] = [this.schedule[date.getDay()][0].split(":"), this.schedule[date.getDay()][1].split(":")];
		const [openTime, closeTime] = [new Date(date.getFullYear(), date.getMonth(), date.getDate() < 10 ? "0" + date.getDate() : date.getDate(), +_start[0], +_start[1]), new Date(date.getFullYear(), date.getMonth(), date.getDate() < 10 ? "0" + date.getDate() : date.getDate(), +_end[0], +_end[1])];
		if (date.getTime() >= openTime.getTime() && date.getTime() <= closeTime.getTime()) return !0;
		return !!0;
	}
	render() {
		const agent = document.createRange().createContextualFragment(`<a href="#" data-phone="${this.phone}" data-title="${this.name}" data-message="${this.message}" class="wa-w_a_a js-owaa" title="${this.name} ${this.phone}">
			<span class="wa-w_a_a_i"><span class="wa-w-i wa-w-i-cc"></span></span>
			<span class="wa-w_a_a_c">
				<span class="a_t">${this.name}</span>
				<span class="a_s">${this.description}</span>
				<span class="a_c">${this.cta}<span class="a_c_i wa-w-i wa-w-i-e"></span></span>
			</span>
		</a>`);
		return agent;
	}
}

window.whatsapp = WhatsappWidget;