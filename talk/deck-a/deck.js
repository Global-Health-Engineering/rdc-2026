// Deck A "Signal". Every number is read from window.TALK (../shared/data.js).
// The final state of every slide is built at load time; animation is CSS that
// runs when a slide becomes the present one, plus the count-up below.
(function () {
  const T = window.TALK;
  const isPrint = /print-pdf/.test(location.search);
  const still = isPrint || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const Y = "#FFD400", W = "#fff";
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const get = (p) => p.split(".").reduce((o, k) => o[k], T);
  const grp = (s) => String(s).replace(/\B(?=(\d{3})+(?!\d))/g, "’");
  const F = {
    int: (v) => grp(Math.round(v)),
    chf: (v) => { const p = v.toFixed(2).split("."); return grp(p[0]) + "." + p[1]; },
    pct: (v) => Math.round(v * 100) + "%",
    x: (v) => "×" + v.toFixed(1),
    day: (v) => { const d = v.split("-"); return +d[2] + " " + MONTHS[+d[1] - 1]; },
    url: (v) => v.replace(/^https?:\/\//, ""),
    raw: (v) => v,
  };
  const SHORT = {
    "data package": "Data packages", "teaching and training": "Teaching",
    "research project": "Research", "hardware": "Hardware", "software": "Software",
  };

  // ---- text from data -------------------------------------------------
  document.querySelectorAll("[data-t]").forEach((el) => {
    const v = get(el.dataset.t);
    const f = el.dataset.f || (typeof v === "number" ? "int" : "raw");
    el.textContent = F[f](v);
  });
  const ws = T.talk.workshop, cut = ws.indexOf(",");
  document.getElementById("ws-name").textContent = ws.slice(0, cut);
  document.getElementById("ws-when").textContent = ws.slice(cut + 1).trim();
  const byType = T.github.commits_by_type_two_windows;
  const dp = byType.find((d) => d.repository_type === "data package");
  document.getElementById("dp-share").textContent = F.pct(dp.share_assisted_current);

  // ---- fit a line of type to a width ------------------------------------
  const ruler = document.createElement("span");
  ruler.style.cssText = "position:absolute;left:-99999px;top:0;visibility:hidden;white-space:nowrap;" +
    "font:800 200px 'Atkinson Hyperlegible Next';letter-spacing:-0.045em;" +
    "font-variant-numeric:tabular-nums;text-transform:uppercase";
  document.body.appendChild(ruler);
  function fit() {
    document.querySelectorAll(".fit").forEach((el) => {
      ruler.textContent = el.textContent;
      const w = ruler.getBoundingClientRect().width;
      if (w > 0) el.style.fontSize = Math.floor((200 * +el.dataset.w) / w) + "px";
    });
  }
  fit();
  if (document.fonts && document.fonts.load) {
    document.fonts.load("800 200px 'Atkinson Hyperlegible Next'", "ABC 0123").then(fit, fit);
    document.fonts.ready.then(fit);
  }
  window.addEventListener("load", fit);

  // ---- slide 5: the people table as 186 blocks --------------------------
  (function () {
    const svg = d3.select("#people");
    const groups = T.people.by_group, pitch = 34, size = 28, rows = 9, top = 26;
    svg.append("text").attr("class", "hero").attr("x", 34).attr("y", 300).text(F.int(T.people.total));
    svg.append("text").attr("class", "lab").attr("x", 40).attr("y", 372)
      .text("Engagements since " + T.steward.start_date.slice(0, 4));
    let x = 580, i = 0;
    groups.forEach((g, gi) => {
      const last = gi === groups.length - 1;
      const cols = Math.ceil(g.n / rows);
      for (let k = 0; k < g.n; k++) {
        const c = Math.floor(k / rows), r = k % rows;
        svg.append("rect").attr("class", "pop").style("--d", 500 + i * 5 + "ms")
          .attr("x", x + c * pitch).attr("y", top + (rows - 1 - r) * pitch)
          .attr("width", size).attr("height", size).attr("fill", W);
        i++;
      }
      svg.append("text").attr("class", "lab")
        .attr("x", last ? x + cols * pitch - 6 : x).attr("text-anchor", last ? "end" : "start")
        .attr("y", top + rows * pitch + (last ? 78 : 38))
        .text(g.group.split(/[ ,]/)[0]);
      x += cols * pitch + 46;
    });
  })();

  // ---- slide 6: 345 repositories, one block each --------------------------
  (function () {
    const svg = d3.select("#repos");
    const all = T.github.repositories_by_type;
    const total = T.github.repositories_without_learners;
    const lead = all.slice(0, 3);
    const rest = total - d3.sum(lead, (d) => d.total);
    const bands = lead.map((d, k) => ({ n: d.total, name: SHORT[d.repository_type], mark: k }))
      .concat([{ n: rest, name: "Other", mark: 3 }]);
    const rows = 15, pitch = 40, size = 32;
    let i = 0;
    bands.forEach((b) => {
      const c0 = Math.floor(i / rows);
      for (let k = 0; k < b.n; k++, i++) {
        const c = Math.floor(i / rows), r = i % rows;
        const r0 = svg.append("rect").attr("class", "pop").style("--d", 200 + i * 3 + "ms");
        if (b.mark === 3) r0.attr("x", c * pitch + 10).attr("y", r * pitch + 10).attr("width", 12).attr("height", 12).attr("fill", W);
        else if (b.mark === 2) r0.attr("x", c * pitch + 3).attr("y", r * pitch + 3).attr("width", size - 6).attr("height", size - 6)
          .attr("fill", "none").attr("stroke", W).attr("stroke-width", 6);
        else r0.attr("x", c * pitch).attr("y", r * pitch).attr("width", size).attr("height", size).attr("fill", b.mark === 0 ? Y : W);
      }
      const lx = c0 * pitch + (b.mark === 0 ? 0 : pitch);
      if (b.mark < 3) svg.append("text").attr("class", "n").attr("x", lx).attr("y", 692).attr("fill", b.mark === 0 ? Y : W).text(b.n);
      svg.append("text").attr("class", "lab").attr("x", lx).attr("y", b.mark < 3 ? 738 : 692).attr("fill", b.mark === 0 ? Y : W).text(b.name);
    });
  })();

  // ---- slide 8: commits per month in the two windows --------------------
  (function () {
    const svg = d3.select("#months");
    const m = T.github.commits_per_month.slice(-24);
    const max = d3.max(m, (d) => d.commits), H = 330, base = 340;
    const y = (v) => (v / max) * H;
    m.forEach((d, i) => {
      const x = 40 + i * 62 + (i >= 12 ? 32 : 0);
      const g = svg.append("g").attr("class", "pop").style("--d", 100 + i * 35 + "ms");
      g.append("rect").attr("x", x).attr("width", 50).attr("y", base - y(d.commits)).attr("height", y(d.commits)).attr("fill", W);
      g.append("rect").attr("x", x).attr("width", 50).attr("y", base - y(d.assisted)).attr("height", y(d.assisted)).attr("fill", Y);
    });
    svg.append("rect").attr("x", 40).attr("y", base).attr("width", 732).attr("height", 10).attr("fill", W);
    svg.append("rect").attr("x", 816).attr("y", base).attr("width", 732).attr("height", 10).attr("fill", Y);
    svg.append("text").attr("class", "lab").attr("x", 40).attr("y", 390).text("Before");
    svg.append("text").attr("class", "lab").attr("x", 816).attr("y", 390).attr("fill", Y).text("Now");
  })();

  // ---- slide 9: commits by repository type, two windows -------------------
  (function () {
    const svg = d3.select("#types");
    const all = T.github.commit_change_all;
    const rows = byType.filter((d) => SHORT[d.repository_type]).slice(0, 5);
    const x0 = 380, scale = 640 / d3.max(rows, (d) => d.current);
    // header
    svg.append("text").attr("class", "lab").attr("x", 40).attr("y", 62).text("Commits");
    svg.append("rect").attr("x", 243).attr("y", 35).attr("width", 44).attr("height", 24).attr("fill", "none").attr("stroke", W).attr("stroke-width", 6);
    svg.append("text").attr("class", "lab").attr("x", 304).attr("y", 62).text("Year before");
    svg.append("rect").attr("x", 560).attr("y", 30).attr("width", 50).attr("height", 34).attr("fill", W);
    svg.append("text").attr("class", "lab").attr("x", 626).attr("y", 62).text("Now");
    svg.append("text").attr("class", "head").attr("x", 36).attr("y", 158).text(F.int(all.previous));
    svg.append("path").attr("d", "M352,112 h70 v-24 l46,36 l-46,36 v-24 h-70 z").attr("fill", W);
    svg.append("text").attr("class", "head").attr("x", 500).attr("y", 158).text(F.int(all.current));
    svg.append("text").attr("class", "head").attr("x", 830).attr("y", 158).attr("fill", Y).text(F.x(all.factor));
    const fr = svg.append("g").attr("class", "fragment");
    fr.append("rect").attr("x", 1210).attr("y", 30).attr("width", 36).attr("height", 36).attr("fill", Y);
    fr.append("text").attr("class", "lab").attr("x", 1262).attr("y", 62).attr("fill", Y).text("With an agent");
    rows.forEach((d, i) => {
      const y = 208 + i * 122;
      const g = svg.append("g").attr("class", "pop").style("--d", 150 + i * 120 + "ms");
      g.append("text").attr("class", "type").attr("x", 40).attr("y", y + 62).text(SHORT[d.repository_type]);
      const wp = d.previous * scale, wc = d.current * scale;
      g.append("rect").attr("x", x0 + 3).attr("y", y + 3).attr("width", Math.max(wp - 6, 2)).attr("height", 24)
        .attr("fill", "none").attr("stroke", W).attr("stroke-width", 6);
      g.append("text").attr("class", "val").attr("x", x0 + wp + 14).attr("y", y + 26).text(F.int(d.previous));
      g.append("rect").attr("x", x0).attr("y", y + 40).attr("width", wc).attr("height", 56).attr("fill", W);
      g.append("text").attr("class", "val big").attr("x", x0 + wc + 14).attr("y", y + 82).text(F.int(d.current));
      g.append("text").attr("class", "fac").attr("x", 1420).attr("y", y + 84).attr("text-anchor", "end").text(F.x(d.factor));
      fr.append("rect").attr("x", x0).attr("y", y + 40).attr("width", d.assisted_current * scale).attr("height", 56).attr("fill", Y);
      fr.append("text").attr("class", "share").attr("x", 1560).attr("y", y + 84).attr("text-anchor", "end").text(F.pct(d.share_assisted_current));
    });
    fr.raise();
    svg.append("text").attr("class", "lab").attr("x", 40).attr("y", 868)
      .text("Commits measure activity. They say nothing about research quality.");
  })();

  // ---- fragment state as classes on the slide, count-up, flash ------------
  const num = document.getElementById("num");
  const target = T.proposals.amount_chf;
  let raf = 0, timer = 0;
  function countUp() {
    const sec = num.closest("section");
    cancelAnimationFrame(raf); clearTimeout(timer);
    sec.classList.remove("flash");
    num.textContent = F.chf(target);
    if (still) return;
    const t0 = performance.now(), dur = 1100;
    (function tick(now) {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      num.textContent = F.chf(p < 1 ? Math.floor(target * e) + Math.random() : target);
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        // one hard inverted flash, 140 ms, once
        sec.classList.add("flash");
        timer = setTimeout(() => sec.classList.remove("flash"), 140);
      }
    })(t0);
  }
  function sync() {
    Reveal.getSlides().forEach((sec) => {
      const n = isPrint ? 9 : sec.querySelectorAll(".fragment.visible").length;
      sec.classList.toggle("s1", n >= 1);
      sec.classList.toggle("s2", n >= 2);
    });
  }
  function start() {
    sync();
    if (isPrint) return;
    ["fragmentshown", "fragmenthidden"].forEach((e) => Reveal.on(e, sync));
    Reveal.on("slidechanged", (ev) => {
      sync();
      const back = ev.previousSlide && Reveal.getSlides().indexOf(ev.previousSlide) > Reveal.getSlides().indexOf(ev.currentSlide);
      if (ev.currentSlide.contains(num) && !back) countUp();
    });
    if (Reveal.getCurrentSlide().contains(num)) countUp();
  }
  function boot() {
    if (typeof Reveal === "undefined") return setTimeout(boot, 50);
    if (Reveal.isReady && Reveal.isReady()) start(); else Reveal.on("ready", start);
  }
  if (document.readyState === "complete") boot(); else window.addEventListener("load", boot);
})();
