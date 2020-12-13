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
			<span class="wa-w_a_a_i"><span class="icon-customerContact"></span></span>
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
		return `<style>.wa-w{background:#fff;border-top-left-radius:4px;border-bottom-left-radius:4px;box-shadow:#00000029 -2px 0 6px;font-family:Arial,sans-serif;font-size:18px;line-height:21px;position:fixed;right:0;transform:translate(100%,-50%);transition:.25s all ease-in-out;top:70%;width:278px;z-index:8}.wa-w *{box-sizing: border-box;-webkit-box-sizing: border-box;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-smooth:always;text-rendering:optimizeLegibility;letter-spacing:0;}.wa-w.open{transform:translate(0,-50%)}.wa-w_h{align-items:center;background:#12a85b;background:linear-gradient(120deg,#12a85b 10%,#17e27a 39%,#17e27a 100%);border-top-left-radius:4px;color:#fff;display:flex;flex-direction:column;justify-content:center;padding:12px 18px}.wa-w_h_t{font-weight:700;margin-bottom:7px}.wa-w_h_s{align-items:center;display:flex;font-size:14px;line-height:16px}.wa-w_h_i{background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjguMDY1IiB2aWV3Qm94PSIwIDAgOCA4LjA2NSI+PGRlZnM+PHN0eWxlPi5he2ZpbGw6I2ZmZjt9PC9zdHlsZT48L2RlZnM+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEuNjkgMCkiPjxwYXRoIGNsYXNzPSJhIiBkPSJNNS40OTUsMEE0LDQsMCwwLDAsMi4xMjUsNS44MTdMMS43LDcuODc4YS4xNTYuMTU2LDAsMCwwLC4xODguMTgzbDIuMDItLjQ3OUE0LDQsMCwxLDAsNS40OTUsMFpNNy45LDYuMjE1QTMuMTM0LDMuMTM0LDAsMCwxLDQuMyw2LjgwNmwtLjI4MS0uMTQtMS4yMzguMjkzLjI2MS0xLjI2NUwyLjksNS40MjJhMy4xMzUsMy4xMzUsMCwwLDEsLjU3Ny0zLjYzNkEzLjEzMiwzLjEzMiwwLDEsMSw3LjksNi4yMTVaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDApIi8+PHBhdGggY2xhc3M9ImEiIGQ9Ik0xMDguNTM3LDExMC4yMTNsLS43NzUtLjIyMmEuMjg5LjI4OSwwLDAsMC0uMjg2LjA3NWwtLjE4OS4xOTNhLjI4Mi4yODIsMCwwLDEtLjMwNy4wNjUsNC4xMzYsNC4xMzYsMCwwLDEtMS4zMzQtMS4xNzcuMjgyLjI4MiwwLDAsMSwuMDIyLS4zMTNsLjE2NS0uMjE0YS4yODkuMjg5LDAsMCwwLC4wMzYtLjI5M2wtLjMyNi0uNzM3YS4yODkuMjg5LDAsMCwwLS40NTEtLjEsMS4zLDEuMywwLDAsMC0uNS43NjksMi41NDMsMi41NDMsMCwwLDAsMS4wNTgsMi4wNDksMi42NCwyLjY0LDAsMCwwLDIuMzYyLjk0NiwxLjMsMS4zLDAsMCwwLC42OTMtLjZBLjI4OS4yODksMCwwLDAsMTA4LjUzNywxMTAuMjEzWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEwMC45MDYgLTEwNS4zNDUpIi8+PC9nPjwvc3ZnPg==) no-repeat center;background-size:contain;display:inline-block;height:14px;margin-right:8px;width:13px}.wa-w_a{display:flex;flex-direction:column;padding:8px}.wa-w_a_a{align-items:center;background:#ebeaea;border:1px solid transparent;border-radius:4px;color:#707070;display:flex;flex:1;margin-bottom:8px;padding:8px 16px;transition: .2s all ease-in-out;text-decoration:none}.wa-w_a_a:last-child{margin-bottom:0}.wa-w_a_a:hover{border-color:#17E27A;color:#444}.wa-w_a_a_i{flex-basis:32px;font-size:30px;height:32px;margin-right:14px;width:32px}.wa-w_a_a_c{display:flex;flex-direction:column;font-size:18px;line-height:21px}.wa-w_a_a .a_t{font-weight:700}.wa-w_a_a .a_s{font-size:14px;line-height:16px}.wa-w_a_a .a_c{font-size:12px;line-height:14px}.wa-w_a_a .a_c_i{background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4LjAyNSIgaGVpZ2h0PSI4IiB2aWV3Qm94PSIwIDAgOC4wMjUgOCI+PGRlZnM+PHN0eWxlPi5he2ZpbGw6IzcwNzA3MDt9PC9zdHlsZT48L2RlZnM+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE3LjggLTE3LjkpIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNy44IDE3LjkpIj48cGF0aCBjbGFzcz0iYSIgZD0iTTE5LjE3MSwzMS4zMjdoNC40ODZhMS4zNjcsMS4zNjcsMCwwLDAsMS4zNzEtMS4zNzFWMjcuMjE1YS4xMTguMTE4LDAsMCwwLS4xMjUtLjEyNWgwYS4xMTguMTE4LDAsMCwwLS4xMjUuMTI1djIuNzQxYTEuMTE3LDEuMTE3LDAsMCwxLTEuMTIxLDEuMTIxSDE5LjE3MWExLjExNywxLjExNywwLDAsMS0xLjEyMS0xLjEyMVYyNS40NzFhMS4xMTcsMS4xMTcsMCwwLDEsMS4xMjEtMS4xMjFoMi43NDFhLjEyNS4xMjUsMCwxLDAsMC0uMjQ5SDE5LjE3MUExLjM2NywxLjM2NywwLDAsMCwxNy44LDI1LjQ3MXY0LjQ4NkExLjM2NywxLjM2NywwLDAsMCwxOS4xNzEsMzEuMzI3WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE3LjggLTIzLjMyNykiLz48cGF0aCBjbGFzcz0iYSIgZD0iTTUxLjYxMiwyMC40M2gwYS4xMTguMTE4LDAsMCwwLC4xMjUtLjEyNXYtMi4yOGEuMTE4LjExOCwwLDAsMC0uMTI1LS4xMjVINDkuMzE5YS4xMjUuMTI1LDAsMCwwLDAsLjI0OUg1MS4zTDQ3LjQzNywyMmEuMTIzLjEyMywwLDEsMCwuMTc0LjE3NGwzLjg2My0zLjg1VjIwLjNBLjE0Ni4xNDYsMCwwLDAsNTEuNjEyLDIwLjQzWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQzLjcxMiAtMTcuOSkiLz48L2c+PC9nPjwvc3ZnPg==) no-repeat center;background-size:12px;display:inline-block;height:12px;margin-left:6px;margin-top:2px;width:12px}.wa-w_b{background:#fff url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjMTdFMjdBIiBkPSJNLjA1NyAyNGwxLjY4Ny02LjE2M2MtMS4wNDEtMS44MDQtMS41ODgtMy44NDktMS41ODctNS45NDYuMDAzLTYuNTU2IDUuMzM4LTExLjg5MSAxMS44OTMtMTEuODkxIDMuMTgxLjAwMSA2LjE2NyAxLjI0IDguNDEzIDMuNDg4IDIuMjQ1IDIuMjQ4IDMuNDgxIDUuMjM2IDMuNDggOC40MTQtLjAwMyA2LjU1Ny01LjMzOCAxMS44OTItMTEuODkzIDExLjg5Mi0xLjk5LS4wMDEtMy45NTEtLjUtNS42ODgtMS40NDhsLTYuMzA1IDEuNjU0em02LjU5Ny0zLjgwN2MxLjY3Ni45OTUgMy4yNzYgMS41OTEgNS4zOTIgMS41OTIgNS40NDggMCA5Ljg4Ni00LjQzNCA5Ljg4OS05Ljg4NS4wMDItNS40NjItNC40MTUtOS44OS05Ljg4MS05Ljg5Mi01LjQ1MiAwLTkuODg3IDQuNDM0LTkuODg5IDkuODg0LS4wMDEgMi4yMjUuNjUxIDMuODkxIDEuNzQ2IDUuNjM0bC0uOTk5IDMuNjQ4IDMuNzQyLS45ODF6bTExLjM4Ny01LjQ2NGMtLjA3NC0uMTI0LS4yNzItLjE5OC0uNTctLjM0Ny0uMjk3LS4xNDktMS43NTgtLjg2OC0yLjAzMS0uOTY3LS4yNzItLjA5OS0uNDctLjE0OS0uNjY5LjE0OS0uMTk4LjI5Ny0uNzY4Ljk2Ny0uOTQxIDEuMTY1LS4xNzMuMTk4LS4zNDcuMjIzLS42NDQuMDc0LS4yOTctLjE0OS0xLjI1NS0uNDYyLTIuMzktMS40NzUtLjg4My0uNzg4LTEuNDgtMS43NjEtMS42NTMtMi4wNTktLjE3My0uMjk3LS4wMTgtLjQ1OC4xMy0uNjA2LjEzNC0uMTMzLjI5Ny0uMzQ3LjQ0Ni0uNTIxLjE1MS0uMTcyLjItLjI5Ni4zLS40OTUuMDk5LS4xOTguMDUtLjM3Mi0uMDI1LS41MjEtLjA3NS0uMTQ4LS42NjktMS42MTEtLjkxNi0yLjIwNi0uMjQyLS41NzktLjQ4Ny0uNTAxLS42NjktLjUxbC0uNTctLjAxYy0uMTk4IDAtLjUyLjA3NC0uNzkyLjM3MnMtMS4wNCAxLjAxNi0xLjA0IDIuNDc5IDEuMDY1IDIuODc2IDEuMjEzIDMuMDc0Yy4xNDkuMTk4IDIuMDk1IDMuMiA1LjA3NiA0LjQ4Ny43MDkuMzA2IDEuMjYzLjQ4OSAxLjY5NC42MjYuNzEyLjIyNiAxLjM2LjE5NCAxLjg3Mi4xMTguNTcxLS4wODUgMS43NTgtLjcxOSAyLjAwNi0xLjQxMy4yNDgtLjY5NS4yNDgtMS4yOS4xNzMtMS40MTR6Ii8+PC9zdmc+) no-repeat center;background-size:33px 33px;border:0;border-top-left-radius:4px;border-bottom-left-radius:4px;top:50px;box-shadow:#00000029 -4px 0 5px;content:"";cursor:pointer;display:flex;height:60px;left:-60px;outline:0;position:absolute;width:60px}</style>`;
	}
	isEnabled(time = []) {
		const date = new Date()
		if (!time.length) return !0
		const [_start, _end] = [time[0].split(":"), time[1].split(":")]
		if (date.getTime() >= new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), +_end[0], +_end[1]).getTime()) return !!0
		if (date.getTime() <= new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), +_start[0], +_start[1]).getTime()) return !!0
		return !0
	}
	render() {
		if (!this.agents.length) return
		let agents = ""
		for (const agent of this.agents) agents += this.getAgent(agent)
		document.body.insertAdjacentHTML("beforeend",
			`${this.getStyles()}
			<div class="wa-w">
				${this.getHeader()}
				<section class="wa-w_a">${agents}</section>
				<button class="wa-w_b" title="${this.title}"></button>
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