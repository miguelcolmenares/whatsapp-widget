export {};

declare global {
	interface Window {
		dataLayer?: object[];
		whatsapp: WhatsappWidget;
	}
}
