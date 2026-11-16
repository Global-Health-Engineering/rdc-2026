// Screenshots of every slide of a rendered reveal.js deck, taken in headless
// Chrome over the DevTools protocol with real waiting time, so animations are
// captured in their settled state.
//
// Usage: node tools/shot.mjs <deck.html> <output folder> [--early]
//   NN.png        every slide after all fragments are shown and 3.5 s have passed
//   NN-early.png  with --early: the same slide 350 ms after it is entered,
//                 before fragments, to judge the first frame of an animation
//   sheet.png     contact sheet of all settled slides
//   report.json   per slide: text overflow beyond the slide, console errors
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, mkdtempSync } from "node:fs";
import { resolve, join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";

const [deck, outDir, ...flags] = process.argv.slice(2);
if (!deck || !outDir) {
  console.error("usage: node shot.mjs <deck.html> <output folder> [--early]");
  process.exit(1);
}
const early = flags.includes("--early");
const out = resolve(outDir);
mkdirSync(out, { recursive: true });
const port = 9300 + Math.floor(Math.random() * 600);
const chrome = spawn(
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${mkdtempSync(join(tmpdir(), "shot-"))}`,
    "--window-size=1920,1080",
    "--hide-scrollbars",
    "--allow-file-access-from-files",
    "--autoplay-policy=no-user-gesture-required",
    "about:blank",
  ],
  { stdio: "ignore" }
);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function target() {
  for (let i = 0; i < 50; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
      const page = list.find((t) => t.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(200);
  }
  throw new Error("Chrome did not start");
}

const ws = new WebSocket(await target());
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
const errors = [];
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) {
    pending.get(d.id)(d.result ?? d);
    pending.delete(d.id);
  }
  if (d.method === "Runtime.exceptionThrown")
    errors.push(d.params.exceptionDetails?.exception?.description ?? "exception");
  if (d.method === "Runtime.consoleAPICalled" && d.params.type === "error")
    errors.push(d.params.args.map((a) => a.value ?? a.description).join(" "));
};
const send = (method, params = {}) =>
  new Promise((r) => {
    pending.set(++id, r);
    ws.send(JSON.stringify({ id, method, params }));
  });
const evaluate = async (expression) =>
  (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }))
    .result?.value;
const shot = async (file) => {
  const { data } = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(join(out, file), Buffer.from(data, "base64"));
};

await send("Runtime.enable");
await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false,
});
await send("Page.navigate", { url: pathToFileURL(resolve(deck)).href });
for (let i = 0; i < 60; i++) {
  if (await evaluate("typeof Reveal !== 'undefined' && Reveal.isReady && Reveal.isReady()")) break;
  await sleep(250);
}
await sleep(1500);
const total = await evaluate("Reveal.getSlides().length");
const report = [];
for (let n = 0; n < total; n++) {
  await evaluate(`(() => { const s = Reveal.getSlides()[${n}]; const i = Reveal.getIndices(s); Reveal.slide(i.h, i.v, -1); })()`);
  const name = String(n + 1).padStart(2, "0");
  if (early) {
    await sleep(350);
    await shot(`${name}-early.png`);
  }
  await evaluate(`(() => { let k = 0; while (Reveal.availableFragments().next && k++ < 40) Reveal.nextFragment(); })()`);
  await sleep(3500);
  await shot(`${name}.png`);
  const info = await evaluate(`(() => {
    const s = Reveal.getCurrentSlide();
    const box = document.querySelector('.reveal .slides').getBoundingClientRect();
    let over = 0;
    s.querySelectorAll('*').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      if (getComputedStyle(el).position === 'fixed') return;
      over = Math.max(over, r.right - box.right, r.bottom - box.bottom, box.left - r.left, box.top - r.top);
    });
    return { words: (s.innerText || '').trim().split(/\\s+/).filter(Boolean).length, overflow_px: Math.round(over) };
  })()`);
  report.push({ slide: n + 1, ...info });
}
// contact sheet
const sheet = `<html><body style="margin:0;background:#222;display:grid;grid-template-columns:repeat(4,1fr);gap:12px;padding:12px;font:20px sans-serif;color:#fff">${
  Array.from({ length: total }, (_, n) => {
    const name = String(n + 1).padStart(2, "0");
    return `<div><img src="${pathToFileURL(join(out, name + ".png")).href}" style="width:100%;display:block"><div>${name}</div></div>`;
  }).join("")
}</body></html>`;
writeFileSync(join(out, "sheet.html"), sheet);
await send("Page.navigate", { url: pathToFileURL(join(out, "sheet.html")).href });
await sleep(1500);
const rows = Math.ceil(total / 4);
const h = Math.round(rows * (1896 / 4 * 9 / 16 + 40) + 24);
await send("Emulation.setDeviceMetricsOverride", { width: 1920, height: h, deviceScaleFactor: 1, mobile: false });
await sleep(500);
await shot("sheet.png");
writeFileSync(join(out, "report.json"), JSON.stringify({ slides: report, errors }, null, 2));
console.log(`${total} slides captured in ${out}`);
if (errors.length) console.log("console errors:\n" + errors.join("\n"));
report.filter((r) => r.overflow_px > 4).forEach((r) => console.log(`slide ${r.slide}: content ${r.overflow_px}px outside the slide`));
ws.close();
chrome.kill();
process.exit(0);
