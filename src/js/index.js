"use strict"
class WhatsappWidget {
	constructor({
		title       = "¿Necesitas ayuda?",
		description = "Chatea con nosotros por Whatsapp",
		agents      = []
	}) {
		this.title       = title,
		this.description = description,
		this.agents      = agents || []
		this.render()
	}
	getHeader() {
		return `<header class="wa-w_h">
			<span class="wa-w_h_t">${this.title}</span>
			<span class="wa-w_h_s">
				<span class="wa-w_h_i wa-w-i wa-w-i-w"></span>
				${this.description}
			</span>
		</header>`
	}
	getStyles() {
		return fetch('./dist/css/whatsapp-widget.css').then(res => res.text()).then(style => `<style>${style}</style>`)
	}
	async render() {
		if (!this.agents.length) return
		let agents = ""
		for (const agent of this.agents) {
			const Agent = new WhatsappAgent(agent)
			if (!Agent.isEnabled()) return
			agents += Agent.render()
		}
		document.body.insertAdjacentHTML("beforeend",
			`${await this.getStyles()}
			<div class="wa-w">
				${this.getHeader()}
				<section class="wa-w_a">${agents}</section>
				<button class="wa-w_b" title="${this.title}"><span class="wa-w-i wa-w-i-w"></span></button>
			</div>`),
			document.querySelector(".wa-w_b").addEventListener("click", () => {
				if ('dataLayer' in window) {
					dataLayer.push({
						event: "ga_event",
						category: "Widget WhatsApp",
						action: "Click WhatsApp",
						label: "Click Icono"
					})
				}
				document.querySelector(".wa-w").classList.toggle("open")
			}),
			document.querySelector(".js-owaa").addEventListener("click", e => {
				e.preventDefault(), this.openAgent(e.currentTarget.dataset)
			})
	}
	openAgent({ phone = "", title = "" }) {
		if ('dataLayer' in window) {
			dataLayer.push({
				event: "ga_event",
				category: "Widget WhatsApp",
				action: "Click WhatsApp",
				label: title,
			})
		}
		window.open(
			`https://wa.me/${phone.replace(/ /g, "").replace("+", "")}`,
			"_blank"
		)
	}
}

class WhatsappAgent {
	constructor({
		cta = "",
		hours = "",
		name = "",
		phone = "",
		schedule = []
	}) {
		this.cta = cta,
		this.description = hours,
		this.name = name,
		this.phone = phone,
		this.schedule = schedule || []
	}
	isEnabled() {
		const date = new Date()
		if (!this.schedule.length || !this.schedule[date.getDay()].length) return !!0
		const [_start, _end] = [this.schedule[date.getDay()][0].split(":"), this.schedule[date.getDay()][1].split(":")]
		const [openTime, closeTime] = [new Date(date.getFullYear(), date.getMonth(), date.getDate() < 10 ? '0' + date.getDate() : date.getDate(), +_start[0], +_start[1]), new Date(date.getFullYear(), date.getMonth(), date.getDate() < 10 ? '0' + date.getDate() : date.getDate(), +_end[0], +_end[1])]
		if (date.getTime() >= openTime.getTime() && date.getTime() <= closeTime.getTime()) return !0
		return !!0
	}
	render() {
		return `<a href="#" data-phone="${this.phone}" data-title="${this.name}" class="wa-w_a_a js-owaa" title="${this.name} ${this.phone}">
		<span class="wa-w_a_a_i"><span class="wa-w-i wa-w-i-cc"></span></span>
		<span class="wa-w_a_a_c">
			<span class="a_t">${this.name}</span>
			<span class="a_s">${this.description}</span>
			<span class="a_c">${this.cta}<span class="a_c_i wa-w-i wa-w-i-e"></span></span>
		</span>
	</a>`
	}
}

window.whatsapp = WhatsappWidget