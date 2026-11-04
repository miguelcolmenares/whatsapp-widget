// A small static server for the built site, the way GitHub Pages serves it: under the base path, a folder answers with
// its index.html, and a missing page answers with 404.html. It stays in the foreground, so Playwright can stop it.
import { existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const argument = name => process.argv[process.argv.indexOf(name) + 1];
const dist = join(import.meta.dirname, "..", argument("--dist") ?? "site/dist");
const base = argument("--base") ?? "/whatsapp-widget/";
const port = Number(argument("--port") ?? 4410);

const TYPES = {
	".html": "text/html; charset=utf-8",
	".css": "text/css",
	".js": "text/javascript",
	".json": "application/json",
	".svg": "image/svg+xml",
	".txt": "text/plain; charset=utf-8",
	".xml": "application/xml",
	".woff": "font/woff",
	".woff2": "font/woff2",
};

createServer((request, response) => {
	const { pathname } = new URL(request.url, "http://localhost");
	const send = (status, file) => {
		response.writeHead(status, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
		response.end(readFileSync(file));
	};
	if (!pathname.startsWith(base)) return send(404, join(dist, "404.html"));
	let file = normalize(join(dist, pathname.slice(base.length)));
	if (!file.startsWith(dist)) return send(404, join(dist, "404.html"));
	if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
	return existsSync(file) ? send(200, file) : send(404, join(dist, "404.html"));
}).listen(port, "127.0.0.1", () => console.log(`Serving ${dist} at http://127.0.0.1:${port}${base}`));
