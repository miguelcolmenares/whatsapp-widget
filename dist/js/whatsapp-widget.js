(()=>{"use strict";var t={726:function(t,e,a){var n;!function(s){if("function"!=typeof i){var i=function(t){return t};i.nonNative=!0}const r=i("plaintext"),c=i("html"),o=i("comment"),l=/<(\w*)>/g,h=/<\/?([^\s\/>]+)/;function d(t,e,a){return u(t=t||"",p(e=e||[],a=a||""))}function p(t,e){return{allowable_tags:t=function(t){let e=new Set;if("string"==typeof t){let a;for(;a=l.exec(t);)e.add(a[1])}else i.nonNative||"function"!=typeof t[i.iterator]?"function"==typeof t.forEach&&t.forEach(e.add,e):e=new Set(t);return e}(t),tag_replacement:e,state:r,tag_buffer:"",depth:0,in_quote_char:""}}function u(t,e){if("string"!=typeof t)throw new TypeError("'html' parameter must be a string");let a=e.allowable_tags,n=e.tag_replacement,s=e.state,i=e.tag_buffer,l=e.depth,h=e.in_quote_char,d="";for(let e=0,p=t.length;e<p;e++){let p=t[e];if(s===r)"<"===p?(s=c,i+=p):d+=p;else if(s===c)switch(p){case"<":if(h)break;l++;break;case">":if(h)break;if(l){l--;break}h="",s=r,i+=">",a.has(w(i))?d+=i:d+=n,i="";break;case'"':case"'":h=p===h?"":h||p,i+=p;break;case"-":"<!-"===i&&(s=o),i+=p;break;case" ":case"\n":if("<"===i){s=r,d+="< ",i="";break}i+=p;break;default:i+=p}else s===o&&(">"===p?("--"==i.slice(-2)&&(s=r),i=""):i+=p)}return e.state=s,e.tag_buffer=i,e.depth=l,e.in_quote_char=h,d}function w(t){let e=h.exec(t);return e?e[1].toLowerCase():null}d.init_streaming_mode=function(t,e){let a=p(t=t||[],e=e||"");return function(t){return u(t||"",a)}},void 0===(n=function(){return d}.call(e,a,e,t))||(t.exports=n)}()}},e={};function a(n){var s=e[n];if(void 0!==s)return s.exports;var i=e[n]={exports:{}};return t[n].call(i.exports,i,i.exports,a),i.exports}a.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return a.d(e,{a:e}),e},a.d=(t,e)=>{for(var n in e)a.o(e,n)&&!a.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},a.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),(()=>{var t=a(726),e=a.n(t);class n{constructor(t){this.cta=t.cta,this.hours=t.hours,this.message=t.message,this.name=t.name,this.phone=t.phone,this.schedule=t.schedule}get isEnabled(){var t,e;const a=new Date;if(!(null===(t=null==this?void 0:this.schedule)||void 0===t?void 0:t.length)||!(null===(e=null==this?void 0:this.schedule[a.getDay()])||void 0===e?void 0:e.length))return!0;const[n,s]=[this.schedule[a.getDay()][0].split(":"),this.schedule[a.getDay()][1].split(":")],[i,r]=[new Date(a.getFullYear(),a.getMonth(),a.getDate()<10?0+a.getDate():a.getDate(),+n[0],+n[1]),new Date(a.getFullYear(),a.getMonth(),a.getDate()<10?0+a.getDate():a.getDate(),+s[0],+s[1])];return a.getTime()>=i.getTime()&&a.getTime()<=r.getTime()}render(){return document.createRange().createContextualFragment(`<a href="#" data-phone="${e()(this.phone)}" data-title="${e()(this.name)}" data-message="${e()(this.message)}" class="wa-w_a_a js-owaa" title="${e()(this.name)} ${e()(this.phone)}">\n\t\t\t<span class="wa-w_a_a_i"><span class="wa-w-i wa-w-i-cc"></span></span>\n\t\t\t<span class="wa-w_a_a_c">\n\t\t\t\t<span class="a_t">${e()(this.name)}</span>\n\t\t\t\t<span class="a_s">${this.hours}</span>\n\t\t\t\t<span class="a_c">${e()(this.cta)}<span class="a_c_i wa-w-i wa-w-i-e"></span></span>\n\t\t\t</span>\n\t\t</a>`)}}var s,i,r,c,o,l,h,d,p=function(t,e,a,n){if("a"===a&&!n)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof e?t!==e||!n:!e.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===a?n:"a"===a?n.call(t):n?n.value:e.get(t)};s=new WeakSet,i=function(){let t=0;return this.agents.forEach((e=>{new n(e).isEnabled&&t++})),t},r=function(){const t=document.createElement("section");return t.classList.add("wa-w_a"),this.agents.forEach((e=>{new n(e).isEnabled&&t.append(new n(e).render())})),t},c=function(){return document.createRange().createContextualFragment(`<button class="wa-w_b" title="${e()(this.title)}">\n\t\t\t<span class="wa-w-i wa-w-i-w"></span>\n\t\t</button>`)},o=function(){var t;"dataLayer"in window&&(null===(t=window.dataLayer)||void 0===t||t.push({event:"ga_event",category:"Widget WhatsApp",action:"Click WhatsApp",label:"Click Icono"})),this.widget.classList.toggle("open")},l=function({message:t="",phone:a="",title:n=""}){var s;"dataLayer"in window&&(null===(s=window.dataLayer)||void 0===s||s.push({event:"ga_event",category:"Widget WhatsApp",action:"Click WhatsApp",label:n}));const i=t.length?`?text=${e()(t)}`:"";window.open(`https://wa.me/${a.replace(/ /g,"").replace("+","")}${e()(i)}`,"_blank")},h=function(){return document.createRange().createContextualFragment(`<header class="wa-w_h">\n\t\t\t<span class="wa-w_h_t">${e()(this.title)}</span>\n\t\t\t<span class="wa-w_h_s">\n\t\t\t\t<span class="wa-w_h_i wa-w-i wa-w-i-w"></span>\n\t\t\t\t${e()(this.description)}\n\t\t\t</span>\n\t\t</header>`)},d=function(){if(!document.getElementById(this.package)){const t=document.head,e=document.createElement("link");e.id=this.package,e.rel="stylesheet",e.type="text/css",e.href=`${this.url}@${this.version}/dist/css/${this.package}.css`,e.media="all",t.appendChild(e)}},window.whatsapp=class{constructor(t){s.add(this),this.package="whatsapp-widget",this.url="https://cdn.jsdelivr.net/gh/miguelcolmenares/whatsapp-widget",this.version="3.2.4",this.agents=t.agents||[],this.description=t.description||"Chatea con nosotros por Whatsapp",this.title=t.title||"¿Necesitas ayuda?",this.agents.length&&0!==p(this,s,"m",i).call(this)&&this.render()}get widget(){return this.$widget}set widget(t){this.$widget=t}render(){var t;p(this,s,"m",d).call(this);const e=document.createElement("div");e.classList.add("wa-w"),e.append(p(this,s,"m",h).call(this)),e.append(p(this,s,"m",r).call(this)),e.append(p(this,s,"m",c).call(this)),document.body.append(e),null===(t=e.querySelector(".wa-w_b"))||void 0===t||t.addEventListener("click",(()=>{p(this,s,"m",o).call(this)}));const a=e.querySelectorAll(".js-owaa");return a&&a.forEach((t=>{t.addEventListener("click",(e=>{e.preventDefault();const{message:a,phone:n,title:i}=t.dataset;p(this,s,"m",l).call(this,{message:a,phone:n,title:i})}))})),this.widget=e}}})()})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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S0FBYSxJQUlSLE1BQU04RCxFQUFrQnhCLEVBQU95QixpQkFBaUIsWUFhdEQsT0FaQUQsR0FBbUJBLEVBQWdCM0csU0FBUTZHLElBQzFDQSxFQUFPSCxpQkFBaUIsU0FBU0ksSUFDaENBLEVBQUVDLGlCQUNVLE1BQU0sUUFBQy9ELEVBQU8sTUFBRUMsRUFBSyxNQUFFMEIsR0FBU2tDLEVBQU9HLFFBQ25ELEVBQUFuRSxLQUFJLFNBQVksS0FBaEJBLEtBQWlCLENBQ0RHLFVBQ0FDLFFBQ0EwQixTQUNGLEdBQ2IsSUFHSTlCLEtBQUtzQyxPQUFTQSxDQUNuQixFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2hhdHNhcHAtd2lkZ2V0Ly4vbm9kZV9tb2R1bGVzL3N0cmlwdGFncy9zcmMvc3RyaXB0YWdzLmpzIiwid2VicGFjazovL3doYXRzYXBwLXdpZGdldC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly93aGF0c2FwcC13aWRnZXQvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vd2hhdHNhcHAtd2lkZ2V0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93aGF0c2FwcC13aWRnZXQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly93aGF0c2FwcC13aWRnZXQvLi9zcmMvdHMvd2hhdHNhcHBBZ2VudC50cyIsIndlYnBhY2s6Ly93aGF0c2FwcC13aWRnZXQvLi9zcmMvdHMvd2hhdHNhcHBXaWRnZXQudHMiLCJ3ZWJwYWNrOi8vd2hhdHNhcHAtd2lkZ2V0Ly4vc3JjL3RzL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uIChnbG9iYWwpIHtcblxuICAgIC8vIG1pbmltYWwgc3ltYm9sIHBvbHlmaWxsIGZvciBJRTExIGFuZCBvdGhlcnNcbiAgICBpZiAodHlwZW9mIFN5bWJvbCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2YXIgU3ltYm9sID0gZnVuY3Rpb24obmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgICAgIH1cblxuICAgICAgICBTeW1ib2wubm9uTmF0aXZlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBTVEFURV9QTEFJTlRFWFQgPSBTeW1ib2woJ3BsYWludGV4dCcpO1xuICAgIGNvbnN0IFNUQVRFX0hUTUwgICAgICA9IFN5bWJvbCgnaHRtbCcpO1xuICAgIGNvbnN0IFNUQVRFX0NPTU1FTlQgICA9IFN5bWJvbCgnY29tbWVudCcpO1xuXG4gICAgY29uc3QgQUxMT1dFRF9UQUdTX1JFR0VYICA9IC88KFxcdyopPi9nO1xuICAgIGNvbnN0IE5PUk1BTElaRV9UQUdfUkVHRVggPSAvPFxcLz8oW15cXHNcXC8+XSspLztcblxuICAgIGZ1bmN0aW9uIHN0cmlwdGFncyhodG1sLCBhbGxvd2FibGVfdGFncywgdGFnX3JlcGxhY2VtZW50KSB7XG4gICAgICAgIGh0bWwgICAgICAgICAgICA9IGh0bWwgfHwgJyc7XG4gICAgICAgIGFsbG93YWJsZV90YWdzICA9IGFsbG93YWJsZV90YWdzIHx8IFtdO1xuICAgICAgICB0YWdfcmVwbGFjZW1lbnQgPSB0YWdfcmVwbGFjZW1lbnQgfHwgJyc7XG5cbiAgICAgICAgbGV0IGNvbnRleHQgPSBpbml0X2NvbnRleHQoYWxsb3dhYmxlX3RhZ3MsIHRhZ19yZXBsYWNlbWVudCk7XG5cbiAgICAgICAgcmV0dXJuIHN0cmlwdGFnc19pbnRlcm5hbChodG1sLCBjb250ZXh0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbml0X3N0cmlwdGFnc19zdHJlYW0oYWxsb3dhYmxlX3RhZ3MsIHRhZ19yZXBsYWNlbWVudCkge1xuICAgICAgICBhbGxvd2FibGVfdGFncyAgPSBhbGxvd2FibGVfdGFncyB8fCBbXTtcbiAgICAgICAgdGFnX3JlcGxhY2VtZW50ID0gdGFnX3JlcGxhY2VtZW50IHx8ICcnO1xuXG4gICAgICAgIGxldCBjb250ZXh0ID0gaW5pdF9jb250ZXh0KGFsbG93YWJsZV90YWdzLCB0YWdfcmVwbGFjZW1lbnQpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBzdHJpcHRhZ3Nfc3RyZWFtKGh0bWwpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHJpcHRhZ3NfaW50ZXJuYWwoaHRtbCB8fCAnJywgY29udGV4dCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgc3RyaXB0YWdzLmluaXRfc3RyZWFtaW5nX21vZGUgPSBpbml0X3N0cmlwdGFnc19zdHJlYW07XG5cbiAgICBmdW5jdGlvbiBpbml0X2NvbnRleHQoYWxsb3dhYmxlX3RhZ3MsIHRhZ19yZXBsYWNlbWVudCkge1xuICAgICAgICBhbGxvd2FibGVfdGFncyA9IHBhcnNlX2FsbG93YWJsZV90YWdzKGFsbG93YWJsZV90YWdzKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYWxsb3dhYmxlX3RhZ3MgOiBhbGxvd2FibGVfdGFncyxcbiAgICAgICAgICAgIHRhZ19yZXBsYWNlbWVudDogdGFnX3JlcGxhY2VtZW50LFxuXG4gICAgICAgICAgICBzdGF0ZSAgICAgICAgIDogU1RBVEVfUExBSU5URVhULFxuICAgICAgICAgICAgdGFnX2J1ZmZlciAgICA6ICcnLFxuICAgICAgICAgICAgZGVwdGggICAgICAgICA6IDAsXG4gICAgICAgICAgICBpbl9xdW90ZV9jaGFyIDogJydcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdHJpcHRhZ3NfaW50ZXJuYWwoaHRtbCwgY29udGV4dCkge1xuICAgICAgICBpZiAodHlwZW9mIGh0bWwgIT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIidodG1sJyBwYXJhbWV0ZXIgbXVzdCBiZSBhIHN0cmluZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBhbGxvd2FibGVfdGFncyAgPSBjb250ZXh0LmFsbG93YWJsZV90YWdzO1xuICAgICAgICBsZXQgdGFnX3JlcGxhY2VtZW50ID0gY29udGV4dC50YWdfcmVwbGFjZW1lbnQ7XG5cbiAgICAgICAgbGV0IHN0YXRlICAgICAgICAgPSBjb250ZXh0LnN0YXRlO1xuICAgICAgICBsZXQgdGFnX2J1ZmZlciAgICA9IGNvbnRleHQudGFnX2J1ZmZlcjtcbiAgICAgICAgbGV0IGRlcHRoICAgICAgICAgPSBjb250ZXh0LmRlcHRoO1xuICAgICAgICBsZXQgaW5fcXVvdGVfY2hhciA9IGNvbnRleHQuaW5fcXVvdGVfY2hhcjtcbiAgICAgICAgbGV0IG91dHB1dCAgICAgICAgPSAnJztcblxuICAgICAgICBmb3IgKGxldCBpZHggPSAwLCBsZW5ndGggPSBodG1sLmxlbmd0aDsgaWR4IDwgbGVuZ3RoOyBpZHgrKykge1xuICAgICAgICAgICAgbGV0IGNoYXIgPSBodG1sW2lkeF07XG5cbiAgICAgICAgICAgIGlmIChzdGF0ZSA9PT0gU1RBVEVfUExBSU5URVhUKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChjaGFyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJzwnOlxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUgICAgICAgPSBTVEFURV9IVE1MO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFnX2J1ZmZlciArPSBjaGFyO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dCArPSBjaGFyO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbHNlIGlmIChzdGF0ZSA9PT0gU1RBVEVfSFRNTCkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoY2hhcikge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICc8JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlnbm9yZSAnPCcgaWYgaW5zaWRlIGEgcXVvdGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbl9xdW90ZV9jaGFyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdlJ3JlIHNlZWluZyBhIG5lc3RlZCAnPCdcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcHRoKys7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBjYXNlICc+JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlnbm9yZSAnPicgaWYgaW5zaWRlIGEgcXVvdGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbl9xdW90ZV9jaGFyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNvbWV0aGluZyBsaWtlIHRoaXMgaXMgaGFwcGVuaW5nOiAnPDw+PidcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkZXB0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlcHRoLS07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcyBpcyBjbG9zaW5nIHRoZSB0YWcgaW4gdGFnX2J1ZmZlclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5fcXVvdGVfY2hhciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUgICAgICAgICA9IFNUQVRFX1BMQUlOVEVYVDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZ19idWZmZXIgICArPSAnPic7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbGxvd2FibGVfdGFncy5oYXMobm9ybWFsaXplX3RhZyh0YWdfYnVmZmVyKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gdGFnX2J1ZmZlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0ICs9IHRhZ19yZXBsYWNlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdGFnX2J1ZmZlciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnXCInOlxuICAgICAgICAgICAgICAgICAgICBjYXNlICdcXCcnOlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2F0Y2ggYm90aCBzaW5nbGUgYW5kIGRvdWJsZSBxdW90ZXNcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoYXIgPT09IGluX3F1b3RlX2NoYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbl9xdW90ZV9jaGFyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluX3F1b3RlX2NoYXIgPSBpbl9xdW90ZV9jaGFyIHx8IGNoYXI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZ19idWZmZXIgKz0gY2hhcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhZ19idWZmZXIgPT09ICc8IS0nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUgPSBTVEFURV9DT01NRU5UO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWdfYnVmZmVyICs9IGNoYXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBjYXNlICcgJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnXFxuJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWdfYnVmZmVyID09PSAnPCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZSAgICAgID0gU1RBVEVfUExBSU5URVhUO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dCAgICArPSAnPCAnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhZ19idWZmZXIgPSAnJztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWdfYnVmZmVyICs9IGNoYXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgdGFnX2J1ZmZlciArPSBjaGFyO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbHNlIGlmIChzdGF0ZSA9PT0gU1RBVEVfQ09NTUVOVCkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoY2hhcikge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICc+JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWdfYnVmZmVyLnNsaWNlKC0yKSA9PSAnLS0nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2xvc2UgdGhlIGNvbW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZSA9IFNUQVRFX1BMQUlOVEVYVDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdGFnX2J1ZmZlciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZ19idWZmZXIgKz0gY2hhcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNhdmUgdGhlIGNvbnRleHQgZm9yIGZ1dHVyZSBpdGVyYXRpb25zXG4gICAgICAgIGNvbnRleHQuc3RhdGUgICAgICAgICA9IHN0YXRlO1xuICAgICAgICBjb250ZXh0LnRhZ19idWZmZXIgICAgPSB0YWdfYnVmZmVyO1xuICAgICAgICBjb250ZXh0LmRlcHRoICAgICAgICAgPSBkZXB0aDtcbiAgICAgICAgY29udGV4dC5pbl9xdW90ZV9jaGFyID0gaW5fcXVvdGVfY2hhcjtcblxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlX2FsbG93YWJsZV90YWdzKGFsbG93YWJsZV90YWdzKSB7XG4gICAgICAgIGxldCB0YWdfc2V0ID0gbmV3IFNldCgpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgYWxsb3dhYmxlX3RhZ3MgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBsZXQgbWF0Y2g7XG5cbiAgICAgICAgICAgIHdoaWxlICgobWF0Y2ggPSBBTExPV0VEX1RBR1NfUkVHRVguZXhlYyhhbGxvd2FibGVfdGFncykpKSB7XG4gICAgICAgICAgICAgICAgdGFnX3NldC5hZGQobWF0Y2hbMV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZWxzZSBpZiAoIVN5bWJvbC5ub25OYXRpdmUgJiZcbiAgICAgICAgICAgICAgICAgdHlwZW9mIGFsbG93YWJsZV90YWdzW1N5bWJvbC5pdGVyYXRvcl0gPT09ICdmdW5jdGlvbicpIHtcblxuICAgICAgICAgICAgdGFnX3NldCA9IG5ldyBTZXQoYWxsb3dhYmxlX3RhZ3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIGFsbG93YWJsZV90YWdzLmZvckVhY2ggPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIC8vIElFMTEgY29tcGF0aWJsZVxuICAgICAgICAgICAgYWxsb3dhYmxlX3RhZ3MuZm9yRWFjaCh0YWdfc2V0LmFkZCwgdGFnX3NldCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGFnX3NldDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBub3JtYWxpemVfdGFnKHRhZ19idWZmZXIpIHtcbiAgICAgICAgbGV0IG1hdGNoID0gTk9STUFMSVpFX1RBR19SRUdFWC5leGVjKHRhZ19idWZmZXIpO1xuXG4gICAgICAgIHJldHVybiBtYXRjaCA/IG1hdGNoWzFdLnRvTG93ZXJDYXNlKCkgOiBudWxsO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgLy8gQU1EXG4gICAgICAgIGRlZmluZShmdW5jdGlvbiBtb2R1bGVfZmFjdG9yeSgpIHsgcmV0dXJuIHN0cmlwdGFnczsgfSk7XG4gICAgfVxuXG4gICAgZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgLy8gTm9kZVxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IHN0cmlwdGFncztcbiAgICB9XG5cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gQnJvd3NlclxuICAgICAgICBnbG9iYWwuc3RyaXB0YWdzID0gc3RyaXB0YWdzO1xuICAgIH1cbn0odGhpcykpO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsImltcG9ydCBzdHJpcHRhZ3MgZnJvbSBcInN0cmlwdGFnc1wiO1xuaW1wb3J0IHsgYWdlbnQgfSBmcm9tIFwiLi4vdHlwZXMvYWdlbnRcIjtcbmV4cG9ydCBjbGFzcyBXaGF0c2FwcEFnZW50IHtcbiAgICBwdWJsaWMgY3RhIDogc3RyaW5nXG4gICAgcHVibGljIGhvdXJzIDogc3RyaW5nXG4gICAgcHVibGljIG1lc3NhZ2UgOiBzdHJpbmdcbiAgICBwdWJsaWMgbmFtZSA6IHN0cmluZ1xuICAgIHB1YmxpYyBwaG9uZSA6IHN0cmluZ1xuICAgIHB1YmxpYyBzY2hlZHVsZSA/OiBzdHJpbmdbXVtdXG4gICAgY29uc3RydWN0b3IoYXJncyA6IGFnZW50KSB7XG4gICAgICAgIHRoaXMuY3RhID0gYXJncy5jdGFcbiAgICAgICAgdGhpcy5ob3VycyA9IGFyZ3MuaG91cnNcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gYXJncy5tZXNzYWdlXG4gICAgICAgIHRoaXMubmFtZSA9IGFyZ3MubmFtZVxuICAgICAgICB0aGlzLnBob25lID0gYXJncy5waG9uZVxuICAgICAgICB0aGlzLnNjaGVkdWxlID0gYXJncy5zY2hlZHVsZVxuICAgIH1cblxuICAgIGdldCBpc0VuYWJsZWQoKSB7XG4gICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuXHRcdGlmICghdGhpcz8uc2NoZWR1bGU/Lmxlbmd0aFxuICAgICAgICAgICAgfHwgIXRoaXM/LnNjaGVkdWxlW2RhdGUuZ2V0RGF5KCldPy5sZW5ndGhcbiAgICAgICAgKVxuICAgICAgICByZXR1cm4gITA7XG5cdFx0Y29uc3QgW19zdGFydCwgX2VuZF0gPSBbdGhpcy5zY2hlZHVsZVtkYXRlLmdldERheSgpXVswXS5zcGxpdChcIjpcIiksIHRoaXMuc2NoZWR1bGVbZGF0ZS5nZXREYXkoKV1bMV0uc3BsaXQoXCI6XCIpXTtcblx0XHRjb25zdCBbb3BlblRpbWUsIGNsb3NlVGltZV0gPSBbbmV3IERhdGUoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCksIGRhdGUuZ2V0RGF0ZSgpIDwgMTAgPyAwICsgZGF0ZS5nZXREYXRlKCkgOiBkYXRlLmdldERhdGUoKSwgK19zdGFydFswXSwgK19zdGFydFsxXSksIG5ldyBEYXRlKGRhdGUuZ2V0RnVsbFllYXIoKSwgZGF0ZS5nZXRNb250aCgpLCBkYXRlLmdldERhdGUoKSA8IDEwID8gMCArIGRhdGUuZ2V0RGF0ZSgpIDogZGF0ZS5nZXREYXRlKCksICtfZW5kWzBdLCArX2VuZFsxXSldO1xuXHRcdGlmIChkYXRlLmdldFRpbWUoKSA+PSBvcGVuVGltZS5nZXRUaW1lKCkgJiYgZGF0ZS5nZXRUaW1lKCkgPD0gY2xvc2VUaW1lLmdldFRpbWUoKSkgcmV0dXJuICEwO1xuXHRcdHJldHVybiAhITA7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuXHRcdGNvbnN0IGFnZW50ID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoYDxhIGhyZWY9XCIjXCIgZGF0YS1waG9uZT1cIiR7c3RyaXB0YWdzKHRoaXMucGhvbmUpfVwiIGRhdGEtdGl0bGU9XCIke3N0cmlwdGFncyh0aGlzLm5hbWUpfVwiIGRhdGEtbWVzc2FnZT1cIiR7c3RyaXB0YWdzKHRoaXMubWVzc2FnZSl9XCIgY2xhc3M9XCJ3YS13X2FfYSBqcy1vd2FhXCIgdGl0bGU9XCIke3N0cmlwdGFncyh0aGlzLm5hbWUpfSAke3N0cmlwdGFncyh0aGlzLnBob25lKX1cIj5cblx0XHRcdDxzcGFuIGNsYXNzPVwid2Etd19hX2FfaVwiPjxzcGFuIGNsYXNzPVwid2Etdy1pIHdhLXctaS1jY1wiPjwvc3Bhbj48L3NwYW4+XG5cdFx0XHQ8c3BhbiBjbGFzcz1cIndhLXdfYV9hX2NcIj5cblx0XHRcdFx0PHNwYW4gY2xhc3M9XCJhX3RcIj4ke3N0cmlwdGFncyh0aGlzLm5hbWUpfTwvc3Bhbj5cblx0XHRcdFx0PHNwYW4gY2xhc3M9XCJhX3NcIj4ke3RoaXMuaG91cnN9PC9zcGFuPlxuXHRcdFx0XHQ8c3BhbiBjbGFzcz1cImFfY1wiPiR7c3RyaXB0YWdzKHRoaXMuY3RhKX08c3BhbiBjbGFzcz1cImFfY19pIHdhLXctaSB3YS13LWktZVwiPjwvc3Bhbj48L3NwYW4+XG5cdFx0XHQ8L3NwYW4+XG5cdFx0PC9hPmApO1xuXHRcdHJldHVybiBhZ2VudDtcblx0fVxufSIsImltcG9ydCB7V2hhdHNhcHBBZ2VudH0gZnJvbSBcIi4vd2hhdHNhcHBBZ2VudFwiXG5pbXBvcnQgc3RyaXB0YWdzIGZyb20gXCJzdHJpcHRhZ3NcIjtcbmltcG9ydCB7IGFnZW50IH0gZnJvbSBcIi4uL3R5cGVzL2FnZW50XCJcblxuZXhwb3J0IGNsYXNzIFdoYXRzYXBwV2lkZ2V0IHtcbiAgICBwdWJsaWMgYWdlbnRzOiBhZ2VudFtdXG4gICAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmdcbiAgICBwdWJsaWMgdGl0bGU6IHN0cmluZ1xuICAgIHByaXZhdGUgcGFja2FnZTogc3RyaW5nID0gXCJ3aGF0c2FwcC13aWRnZXRcIlxuICAgIHByaXZhdGUgdXJsIDogc3RyaW5nID0gXCJodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvZ2gvbWlndWVsY29sbWVuYXJlcy93aGF0c2FwcC13aWRnZXRcIlxuICAgIHByaXZhdGUgdmVyc2lvbiA6IHN0cmluZyA9IFwiMy4yLjRcIlxuICAgIHByaXZhdGUgJHdpZGdldCE6IEhUTUxFbGVtZW50XG4gICAgY29uc3RydWN0b3IoYXJncyA6IHtcbiAgICAgICAgdGl0bGUgOiBzdHJpbmcsXG4gICAgICAgIGRlc2NyaXB0aW9uIDogc3RyaW5nLFxuICAgICAgICBhZ2VudHMgOiBhZ2VudFtdXG4gICAgfSkge1xuICAgICAgICB0aGlzLmFnZW50cyA9IGFyZ3MuYWdlbnRzIHx8IFtdO1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gYXJncy5kZXNjcmlwdGlvbiB8fCBcIkNoYXRlYSBjb24gbm9zb3Ryb3MgcG9yIFdoYXRzYXBwXCI7XG4gICAgICAgIHRoaXMudGl0bGUgPSBhcmdzLnRpdGxlIHx8IFwiwr9OZWNlc2l0YXMgYXl1ZGE/XCI7XG4gICAgICAgIGlmICghdGhpcy5hZ2VudHMubGVuZ3RoKSByZXR1cm47XG5cdFx0aWYgKHRoaXMuI2FjdGl2ZUFnZW50cygpID09PSAwKSByZXR1cm47XG5cdFx0dGhpcy5yZW5kZXIoKTtcbiAgICB9XG5cbiAgICBnZXQgd2lkZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy4kd2lkZ2V0O1xuICAgIH1cblxuICAgIHNldCB3aWRnZXQoJGVsZW1lbnQgOiBIVE1MRWxlbWVudCkge1xuICAgICAgICB0aGlzLiR3aWRnZXQgPSAkZWxlbWVudDtcbiAgICB9XG5cbiAgICAjYWN0aXZlQWdlbnRzKCkgOiBudW1iZXJ7XG5cdFx0bGV0IGFnZW50c0FjdGl2ZSA6IG51bWJlciA9IDA7XG5cdFx0dGhpcy5hZ2VudHMuZm9yRWFjaChhZ2VudCAgPT4ge1xuXHRcdFx0Y29uc3QgX2FnZW50ID0gbmV3IFdoYXRzYXBwQWdlbnQoYWdlbnQpO1xuXHRcdFx0X2FnZW50LmlzRW5hYmxlZCA/IGFnZW50c0FjdGl2ZSsrIDogXCJcIjtcblx0XHR9KTtcblx0XHRyZXR1cm4gYWdlbnRzQWN0aXZlO1xuXHR9XG5cbiAgICAjYWdlbnRzKCkgOiBIVE1MRWxlbWVudCB7XG4gICAgICAgIGNvbnN0IGFnZW50c0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzZWN0aW9uXCIpO1xuXHRcdGFnZW50c0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwid2Etd19hXCIpO1xuXHRcdHRoaXMuYWdlbnRzLmZvckVhY2goYWdlbnQgPT4ge1xuXHRcdFx0Y29uc3QgX2FnZW50ID0gbmV3IFdoYXRzYXBwQWdlbnQoYWdlbnQpO1xuXHRcdFx0X2FnZW50LmlzRW5hYmxlZCA/IGFnZW50c0NvbnRhaW5lci5hcHBlbmQobmV3IFdoYXRzYXBwQWdlbnQoYWdlbnQpLnJlbmRlcigpKSA6IFwiXCI7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGFnZW50c0NvbnRhaW5lcjtcbiAgICB9XG5cbiAgICAjYnV0dG9uKCkgOiBEb2N1bWVudEZyYWdtZW50IHtcblx0XHRjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChcblx0XHRgPGJ1dHRvbiBjbGFzcz1cIndhLXdfYlwiIHRpdGxlPVwiJHtzdHJpcHRhZ3ModGhpcy50aXRsZSl9XCI+XG5cdFx0XHQ8c3BhbiBjbGFzcz1cIndhLXctaSB3YS13LWktd1wiPjwvc3Bhbj5cblx0XHQ8L2J1dHRvbj5gKTtcblx0XHRyZXR1cm4gYnV0dG9uO1xuXHR9XG5cbiAgICAjY2xpY2soKSA6IHZvaWQge1xuXHRcdGlmIChcImRhdGFMYXllclwiIGluIHdpbmRvdykge1xuXHRcdFx0d2luZG93LmRhdGFMYXllcj8ucHVzaCh7XG5cdFx0XHRcdGV2ZW50OiBcImdhX2V2ZW50XCIsXG5cdFx0XHRcdGNhdGVnb3J5OiBcIldpZGdldCBXaGF0c0FwcFwiLFxuXHRcdFx0XHRhY3Rpb246IFwiQ2xpY2sgV2hhdHNBcHBcIixcblx0XHRcdFx0bGFiZWw6IFwiQ2xpY2sgSWNvbm9cIlxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdHRoaXMud2lkZ2V0LmNsYXNzTGlzdC50b2dnbGUoXCJvcGVuXCIpO1xuXHR9XG5cbiAgICAjY2xpY2tBZ2VudCh7XG4gICAgICAgIG1lc3NhZ2UgPSBcIlwiLFxuICAgICAgICBwaG9uZSA9IFwiXCIsXG4gICAgICAgIHRpdGxlID0gXCJcIlxuICAgIH0gOiB7XG4gICAgICAgIG1lc3NhZ2UgOiBzdHJpbmcgfCB1bmRlZmluZWQsXG4gICAgICAgIHBob25lIDogc3RyaW5nIHwgdW5kZWZpbmVkLFxuICAgICAgICB0aXRsZSA6IHN0cmluZyB8IHVuZGVmaW5lZFxuICAgIH0pIDogdm9pZCB7XG5cdFx0aWYgKFwiZGF0YUxheWVyXCIgaW4gd2luZG93KSB7XG5cdFx0XHR3aW5kb3cuZGF0YUxheWVyPy5wdXNoKHtcblx0XHRcdFx0ZXZlbnQ6IFwiZ2FfZXZlbnRcIixcblx0XHRcdFx0Y2F0ZWdvcnk6IFwiV2lkZ2V0IFdoYXRzQXBwXCIsXG5cdFx0XHRcdGFjdGlvbjogXCJDbGljayBXaGF0c0FwcFwiLFxuXHRcdFx0XHRsYWJlbDogdGl0bGUsXG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0Y29uc3QgdGV4dCA6IHN0cmluZyA9IG1lc3NhZ2UubGVuZ3RoID8gYD90ZXh0PSR7c3RyaXB0YWdzKG1lc3NhZ2UpfWAgOiBcIlwiO1xuXHRcdHdpbmRvdy5vcGVuKFxuXHRcdFx0YGh0dHBzOi8vd2EubWUvJHtwaG9uZS5yZXBsYWNlKC8gL2csIFwiXCIpLnJlcGxhY2UoXCIrXCIsIFwiXCIpfSR7c3RyaXB0YWdzKHRleHQpfWAsXG5cdFx0XHRcIl9ibGFua1wiXG5cdFx0KTtcblx0fVxuXG4gICAgI2hlYWRlcigpIDogRG9jdW1lbnRGcmFnbWVudCB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChcblx0XHRcdGA8aGVhZGVyIGNsYXNzPVwid2Etd19oXCI+XG5cdFx0XHQ8c3BhbiBjbGFzcz1cIndhLXdfaF90XCI+JHtzdHJpcHRhZ3ModGhpcy50aXRsZSl9PC9zcGFuPlxuXHRcdFx0PHNwYW4gY2xhc3M9XCJ3YS13X2hfc1wiPlxuXHRcdFx0XHQ8c3BhbiBjbGFzcz1cIndhLXdfaF9pIHdhLXctaSB3YS13LWktd1wiPjwvc3Bhbj5cblx0XHRcdFx0JHtzdHJpcHRhZ3ModGhpcy5kZXNjcmlwdGlvbil9XG5cdFx0XHQ8L3NwYW4+XG5cdFx0PC9oZWFkZXI+YCk7XG4gICAgfVxuXG4gICAgI3N0eWxlcygpIDogdm9pZCB7XG4gICAgICAgIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5wYWNrYWdlKSkge1xuICAgICAgICAgICAgY29uc3QgaGVhZCAgPSBkb2N1bWVudC5oZWFkO1xuICAgICAgICAgICAgY29uc3QgbGluayAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJyk7XG4gICAgICAgICAgICBsaW5rLmlkICAgPSB0aGlzLnBhY2thZ2U7XG4gICAgICAgICAgICBsaW5rLnJlbCAgPSAnc3R5bGVzaGVldCc7XG4gICAgICAgICAgICBsaW5rLnR5cGUgPSAndGV4dC9jc3MnO1xuICAgICAgICAgICAgbGluay5ocmVmID0gYCR7dGhpcy51cmx9QCR7dGhpcy52ZXJzaW9ufS9kaXN0L2Nzcy8ke3RoaXMucGFja2FnZX0uY3NzYDtcbiAgICAgICAgICAgIGxpbmsubWVkaWEgPSAnYWxsJztcbiAgICAgICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXIgKCkge1xuICAgICAgICB0aGlzLiNzdHlsZXMoKTtcbiAgICAgICAgY29uc3Qgd2lkZ2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHR3aWRnZXQuY2xhc3NMaXN0LmFkZChcIndhLXdcIik7XG5cdFx0d2lkZ2V0LmFwcGVuZCh0aGlzLiNoZWFkZXIoKSk7XG5cdFx0d2lkZ2V0LmFwcGVuZCh0aGlzLiNhZ2VudHMoKSk7XG5cdFx0d2lkZ2V0LmFwcGVuZCh0aGlzLiNidXR0b24oKSk7XG5cdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmQod2lkZ2V0KTtcblxuICAgICAgICAvL2J1dHRvbiBjbGlja1xuXHRcdHdpZGdldC5xdWVyeVNlbGVjdG9yKFwiLndhLXdfYlwiKT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblx0XHRcdHRoaXMuI2NsaWNrKCk7XG5cdFx0fSk7XG5cblx0XHQvL2FnZW50IGNsaWNrXG4gICAgICAgIGNvbnN0ICR3aGF0c2FwcEFnZW50cyA9IHdpZGdldC5xdWVyeVNlbGVjdG9yQWxsKFwiLmpzLW93YWFcIikgYXMgTm9kZUxpc3RPZjxIVE1MRWxlbWVudD5cblx0XHQkd2hhdHNhcHBBZ2VudHMgJiYgJHdoYXRzYXBwQWdlbnRzLmZvckVhY2goJGFnZW50ID0+IHtcblx0XHRcdCRhZ2VudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBjb25zdCB7bWVzc2FnZSwgcGhvbmUsIHRpdGxlfSA9ICRhZ2VudC5kYXRhc2V0XG5cdFx0XHRcdHRoaXMuI2NsaWNrQWdlbnQoe1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICBwaG9uZSxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGVcbiAgICAgICAgICAgICAgICB9KTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHRoaXMud2lkZ2V0ID0gd2lkZ2V0O1xuICAgIH1cbn0iLCJpbXBvcnQge1doYXRzYXBwV2lkZ2V0fSBmcm9tIFwiLi93aGF0c2FwcFdpZGdldFwiO1xuXG53aW5kb3cud2hhdHNhcHAgID0gV2hhdHNhcHBXaWRnZXQ7Il0sIm5hbWVzIjpbImdsb2JhbCIsIlN5bWJvbCIsIm5hbWUiLCJub25OYXRpdmUiLCJTVEFURV9QTEFJTlRFWFQiLCJTVEFURV9IVE1MIiwiU1RBVEVfQ09NTUVOVCIsIkFMTE9XRURfVEFHU19SRUdFWCIsIk5PUk1BTElaRV9UQUdfUkVHRVgiLCJzdHJpcHRhZ3MiLCJodG1sIiwiYWxsb3dhYmxlX3RhZ3MiLCJ0YWdfcmVwbGFjZW1lbnQiLCJzdHJpcHRhZ3NfaW50ZXJuYWwiLCJpbml0X2NvbnRleHQiLCJ0YWdfc2V0IiwiU2V0IiwibWF0Y2giLCJleGVjIiwiYWRkIiwiaXRlcmF0b3IiLCJmb3JFYWNoIiwicGFyc2VfYWxsb3dhYmxlX3RhZ3MiLCJzdGF0ZSIsInRhZ19idWZmZXIiLCJkZXB0aCIsImluX3F1b3RlX2NoYXIiLCJjb250ZXh0IiwiVHlwZUVycm9yIiwib3V0cHV0IiwiaWR4IiwibGVuZ3RoIiwiY2hhciIsImhhcyIsIm5vcm1hbGl6ZV90YWciLCJzbGljZSIsInRvTG93ZXJDYXNlIiwiaW5pdF9zdHJlYW1pbmdfbW9kZSIsIl9fd2VicGFja19tb2R1bGVfY2FjaGVfXyIsIl9fd2VicGFja19yZXF1aXJlX18iLCJtb2R1bGVJZCIsImNhY2hlZE1vZHVsZSIsInVuZGVmaW5lZCIsImV4cG9ydHMiLCJtb2R1bGUiLCJfX3dlYnBhY2tfbW9kdWxlc19fIiwiY2FsbCIsIm4iLCJnZXR0ZXIiLCJfX2VzTW9kdWxlIiwiZCIsImEiLCJkZWZpbml0aW9uIiwia2V5IiwibyIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZW51bWVyYWJsZSIsImdldCIsIm9iaiIsInByb3AiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsIldoYXRzYXBwQWdlbnQiLCJjb25zdHJ1Y3RvciIsImFyZ3MiLCJ0aGlzIiwiY3RhIiwiaG91cnMiLCJtZXNzYWdlIiwicGhvbmUiLCJzY2hlZHVsZSIsImlzRW5hYmxlZCIsImRhdGUiLCJEYXRlIiwiZ2V0RGF5IiwiX3N0YXJ0IiwiX2VuZCIsInNwbGl0Iiwib3BlblRpbWUiLCJjbG9zZVRpbWUiLCJnZXRGdWxsWWVhciIsImdldE1vbnRoIiwiZ2V0RGF0ZSIsImdldFRpbWUiLCJyZW5kZXIiLCJkb2N1bWVudCIsImNyZWF0ZVJhbmdlIiwiY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50IiwiYWdlbnRzQWN0aXZlIiwiYWdlbnRzIiwiYWdlbnQiLCJhZ2VudHNDb250YWluZXIiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NMaXN0IiwiYXBwZW5kIiwidGl0bGUiLCJ3aW5kb3ciLCJkYXRhTGF5ZXIiLCJwdXNoIiwiZXZlbnQiLCJjYXRlZ29yeSIsImFjdGlvbiIsImxhYmVsIiwid2lkZ2V0IiwidG9nZ2xlIiwidGV4dCIsIm9wZW4iLCJyZXBsYWNlIiwiZGVzY3JpcHRpb24iLCJnZXRFbGVtZW50QnlJZCIsInBhY2thZ2UiLCJoZWFkIiwibGluayIsImlkIiwicmVsIiwidHlwZSIsImhyZWYiLCJ1cmwiLCJ2ZXJzaW9uIiwibWVkaWEiLCJhcHBlbmRDaGlsZCIsIndoYXRzYXBwIiwiJHdpZGdldCIsIiRlbGVtZW50IiwiYm9keSIsInF1ZXJ5U2VsZWN0b3IiLCJhZGRFdmVudExpc3RlbmVyIiwiJHdoYXRzYXBwQWdlbnRzIiwicXVlcnlTZWxlY3RvckFsbCIsIiRhZ2VudCIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImRhdGFzZXQiXSwic291cmNlUm9vdCI6IiJ9