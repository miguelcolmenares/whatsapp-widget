import {WhatsappAgent} from "./whatsappAgent"
import striptags from "striptags";
import { agent } from "../types/agent"

export class WhatsappWidget {
    public agents: agent[]
    public description: string
    public title: string
    private package: string = "{{package}}"
    private url : string = "{{url}}"
    private $widget!: HTMLElement
    constructor(args : {
        title : string,
        description : string,
        agents : agent[]
    }) {
        this.agents = args.agents || [];
        this.description = args.description || "Chatea con nosotros por Whatsapp";
        this.title = args.title || "¿Necesitas ayuda?";
        if (!this.agents.length) return;
		if (this.#activeAgents() === 0) return;
		this.render();
    }

    get widget() {
        return this.$widget;
    }

    set widget($element : HTMLElement) {
        this.$widget = $element;
    }

    #activeAgents() : number{
		let agentsActive : number = 0;
		this.agents.forEach(agent  => {
			const _agent = new WhatsappAgent(agent);
			_agent.isEnabled ? agentsActive++ : "";
		});
		return agentsActive;
	}

    #agents() : HTMLElement {
        const agentsContainer = document.createElement("section");
		agentsContainer.classList.add("wa-w_a");
		this.agents.forEach(agent => {
			const _agent = new WhatsappAgent(agent);
			_agent.isEnabled ? agentsContainer.append(new WhatsappAgent(agent).render()) : "";
		});
		return agentsContainer;
    }

    #button() : DocumentFragment {
		const button = document.createRange().createContextualFragment(
		`<button class="wa-w_b" title="${striptags(this.title)}">
			<span class="wa-w-i wa-w-i-w"></span>
		</button>`);
		return button;
	}

    #click() : void {
		if ("dataLayer" in window) {
			window.dataLayer?.push({
				event: "ga_event",
				category: "Widget WhatsApp",
				action: "Click WhatsApp",
				label: "Click Icono"
			});
		}
		this.widget.classList.toggle("open");
	}

    #clickAgent({
        message = "",
        phone = "",
        title = ""
    } : {
        message : string | undefined,
        phone : string | undefined,
        title : string | undefined
    }) : void {
		if ("dataLayer" in window) {
			window.dataLayer?.push({
				event: "ga_event",
				category: "Widget WhatsApp",
				action: "Click WhatsApp",
				label: title,
			});
		}
		const text : string = message.length ? `?text=${striptags(message)}` : "";
		window.open(
			`https://wa.me/${phone.replace(/ /g, "").replace("+", "")}${striptags(text)}`,
			"_blank"
		);
	}

    #header() : DocumentFragment {
        return document.createRange().createContextualFragment(
			`<header class="wa-w_h">
			<span class="wa-w_h_t">${striptags(this.title)}</span>
			<span class="wa-w_h_s">
				<span class="wa-w_h_i wa-w-i wa-w-i-w"></span>
				${striptags(this.description)}
			</span>
		</header>`);
    }

    async #styles() : Promise<HTMLStyleElement> {
		const styles = document.createElement("style");
		await fetch(`${this.url}/dist/css/${this.package}.css`)
			.then(res => res.text())
			.then(style => styles.append(style));
		return document.head.appendChild(styles);
    }

    async render () {
        await this.#styles();
        const widget = document.createElement("div");
		widget.classList.add("wa-w");
		widget.append(this.#header());
		widget.append(this.#agents());
		widget.append(this.#button());
		document.body.append(widget);

        //button click
		widget.querySelector(".wa-w_b")?.addEventListener("click", () => {
			this.#click();
		});

		//agent click
        const $whatsappAgents = widget.querySelectorAll(".js-owaa") as NodeListOf<HTMLElement>
		$whatsappAgents && $whatsappAgents.forEach($agent => {
			$agent.addEventListener("click", e => {
				e.preventDefault();
                const {message, phone, title} = $agent.dataset
				this.#clickAgent({
                    message,
                    phone,
                    title
                });
			});
		});

		return this.widget = widget;
    }
}