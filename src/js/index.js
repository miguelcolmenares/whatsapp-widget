"use strict"
class Whatsapp {
	constructor({
		title       = "¿Necesitas ayuda?",
		description = "Chatea con nosotros por Whatsapp",
		agents      = [],
		time        = []
	}) {
		this.title       = title,
		this.description = description,
		this.agents      = agents,
		this.time        = time
		if (!this.isEnabled(this.time)) return
		this.render()
	}
	getAgent({
		cta = "",
		hours = "",
		name = "",
		phone = ""
	}) {
		return `<a href="#" data-phone="${phone}" data-title="${name}" class="wa-w_a_a js-owaa" title="${name} ${phone}">
			<span class="wa-w_a_a_i"><span class="wa-w-i wa-w-i-cc"></span></span>
			<span class="wa-w_a_a_c">
				<span class="a_t">${name}</span>
				<span class="a_s">${hours}</span>
				<span class="a_c">${cta}<span class="a_c_i"></span></span>
			</span>
		</a>`
	}
	getHeader() {
		return `<header class="wa-w_h">
			<span class="wa-w_h_t">${this.title}</span>
			<span class="wa-w_h_s">
				<span class="wa-w_h_i"></span>
				${this.description}
			</span>
		</header>`
	}
	getStyles() {
		return fetch('./dist/css/whatsapp-widget.min.css').then(res => res.text()).then(style => `<style>${style}</style>`)
	}
	isEnabled(time = []) {
		if (!time.length) return !0
		const date = new Date()
		const [_start, _end] = [time[0].split(":"), time[1].split(":")]
		if (date.getTime() >= new Date(date.getFullYear(), date.getMonth(), date.getDate(), +_end[0], +_end[1]).getTime()) return !!0
		if (date.getTime() <= new Date(date.getFullYear(), date.getMonth(), date.getDate(), +_start[0], +_start[1]).getTime()) return !!0
		return !0
	}
	async render() {
		if (!this.agents.length) return
		let agents = ""
		for (const agent of this.agents) agents += this.getAgent(agent)
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

window.whatsapp = Whatsapp