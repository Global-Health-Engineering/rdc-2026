// Print a rendered reveal.js deck to a 16:9 PDF, one page per slide: open
// deck.html?print-pdf in headless Chrome, wait in real time, print with the
// CSS page size. Usage: node tools/pdf.mjs <deck.html> <deck.pdf>
// Usage: node pdf.mjs deck.html deck.pdf
import { spawn } from "node:child_process";
import { writeFileSync, mkdtempSync } from "node:fs";
import { resolve, join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
const [deck, out] = process.argv.slice(2);
const port = 9300 + Math.floor(Math.random() * 600);
const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
  "--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "pdf-"))}`,
  "--window-size=1600,900", "--allow-file-access-from-files", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let wsUrl;
for (let i = 0; i < 50 && !wsUrl; i++) {
  try { wsUrl = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page")?.webSocketDebuggerUrl; } catch {}
  if (!wsUrl) await sleep(200);
}
const ws = new WebSocket(wsUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d.result ?? d); pending.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });
await send("Page.enable");
await send("Page.navigate", { url: pathToFileURL(resolve(deck)).href + "?print-pdf" });
await sleep(8000);
const { data } = await send("Page.printToPDF", { printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false });
writeFileSync(resolve(out), Buffer.from(data, "base64"));
console.log("written " + out);
ws.close(); chrome.kill(); process.exit(0);
