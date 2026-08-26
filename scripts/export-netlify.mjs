import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { pathToFileURL } from "node:url";

const routes = ["", "hash", "block", "blockchain", "distributed", "tokens", "coinbase", "utxo", "ethereum", "solana", "keys", "signatures", "transaction"];
const source = join(process.cwd(), "dist");
const output = join(process.cwd(), "dist-netlify");
const client = join(source, "client");
const mimeTypes = {
  ".css": "text/css; charset=utf-8", ".gif": "image/gif", ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon", ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".otf": "font/otf", ".png": "image/png", ".svg": "image/svg+xml", ".ttf": "font/ttf",
  ".webp": "image/webp", ".woff": "font/woff", ".woff2": "font/woff2",
};

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(client, output, { recursive: true });

const assetBinding = {
  async fetch(request) {
    const pathname = decodeURIComponent(new URL(request.url).pathname);
    const relativePath = pathname.replace(/^\/+/, "");
    if (!relativePath || relativePath.includes("..")) return new Response("Not found", { status: 404 });
    try {
      const body = await readFile(join(client, relativePath));
      return new Response(body, { headers: { "content-type": mimeTypes[extname(relativePath)] ?? "application/octet-stream" } });
    } catch {
      return new Response("Not found", { status: 404 });
    }
  },
};

const serverUrl = pathToFileURL(join(source, "server", "index.js")).href;
const { default: worker } = await import(`${serverUrl}?netlify-export=${Date.now()}`);

for (const route of routes) {
  const response = await worker.fetch(new Request(`https://lab.corelia.academy/${route}`), { ASSETS: assetBinding });
  if (!response.ok) throw new Error(`Unable to prerender /${route}: HTTP ${response.status}`);
  if (route) {
    const directory = join(output, route);
    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, "index.html"), await response.text());
  } else {
    await writeFile(join(output, "index.html"), await response.text());
  }
}
console.log(`Netlify export complete: ${routes.length} routes in dist-netlify`);
