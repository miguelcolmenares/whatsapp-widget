/*! whatsapp-widget - v3.2.0 - 2021-02-15 */
"use strict";class WhatsappWidget{constructor({title:t="¿Necesitas ayuda?",description:e="Chatea con nosotros por Whatsapp",agents:a=[]}){this.agents=a,this.description=e,this.package="whatsapp-widget",this.title=t,this.url="https://cdn.jsdelivr.net/gh/miguelcolmenares/whatsapp-widget@3.2.0",this.version="3.2.0",this.$widget,this.agents.length&&this.render()}_agents(){const t=document.createElement("section");return t.classList.add("wa-w_a"),this.agents.forEach(e=>{new WhatsappAgent(e).isEnabled&&t.append(new WhatsappAgent(e).render())}),t}_button(){return document.createRange().createContextualFragment(`<button class="wa-w_b" title="${this.title}">\n\t\t\t<span class="wa-w-i wa-w-i-w"></span>\n\t\t</button>`)}_click(){"dataLayer"in window&&dataLayer.push({event:"ga_event",category:"Widget WhatsApp",action:"Click WhatsApp",label:"Click Icono"}),this.widget.classList.toggle("open")}_clickAgent({phone:t="",title:e=""}){"dataLayer"in window&&dataLayer.push({event:"ga_event",category:"Widget WhatsApp",action:"Click WhatsApp",label:e}),window.open(`https://wa.me/${t.replace(/ /g,"").replace("+","")}`,"_blank")}_header(){return document.createRange().createContextualFragment(`<header class="wa-w_h">\n\t\t\t<span class="wa-w_h_t">${this.title}</span>\n\t\t\t<span class="wa-w_h_s">\n\t\t\t\t<span class="wa-w_h_i wa-w-i wa-w-i-w"></span>\n\t\t\t\t${this.description}\n\t\t\t</span>\n\t\t</header>`)}async _styles(){const t=document.createElement("style");return await fetch(`${this.url}/dist/css/${this.package}.css`).then(t=>t.text()).then(e=>t.append(e)),document.head.append(t)}async render(){await this._styles();const t=document.createElement("div");return t.classList.add("wa-w"),t.append(this._header()),t.append(this._agents()),t.append(this._button()),document.body.append(t),t.querySelector(".wa-w_b").addEventListener("click",()=>{this._click()}),t.querySelectorAll(".js-owaa").forEach(t=>{t.addEventListener("click",e=>{e.preventDefault(),this._clickAgent(t.dataset)})}),this.widget=t}get widget(){return this.$widget}set widget(t){this.$widget=t}}class WhatsappAgent{constructor({cta:t="",hours:e="",name:a="",phone:s="",schedule:n=[]}){this.cta=t,this.description=e,this.name=a,this.phone=s,this.schedule=n}get isEnabled(){const t=new Date;if(!this.schedule.length||!this.schedule[t.getDay()].length)return!0;const[e,a]=[this.schedule[t.getDay()][0].split(":"),this.schedule[t.getDay()][1].split(":")],[s,n]=[new Date(t.getFullYear(),t.getMonth(),t.getDate()<10?"0"+t.getDate():t.getDate(),+e[0],+e[1]),new Date(t.getFullYear(),t.getMonth(),t.getDate()<10?"0"+t.getDate():t.getDate(),+a[0],+a[1])];return t.getTime()>=s.getTime()&&t.getTime()<=n.getTime()}render(){return document.createRange().createContextualFragment(`<a href="#" data-phone="${this.phone}" data-title="${this.name}" class="wa-w_a_a js-owaa" title="${this.name} ${this.phone}">\n\t\t\t<span class="wa-w_a_a_i"><span class="wa-w-i wa-w-i-cc"></span></span>\n\t\t\t<span class="wa-w_a_a_c">\n\t\t\t\t<span class="a_t">${this.name}</span>\n\t\t\t\t<span class="a_s">${this.description}</span>\n\t\t\t\t<span class="a_c">${this.cta}<span class="a_c_i wa-w-i wa-w-i-e"></span></span>\n\t\t\t</span>\n\t\t</a>`)}}window.whatsapp=WhatsappWidget;