// "Signal". Every number is read from window.TALK (../shared/data.js).
// The final state of every slide is drawn when this script is parsed; animation
// is CSS that runs when a slide becomes the present one, plus the count-up.
(function () {
  const T = window.TALK;
  const isPrint = /print-pdf/.test(location.search);
  const still = isPrint || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const Y = "#FFD400", W = "#fff", N = "#777777", K = "#000";
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const MONTHS_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // The holding slide is for the room only: the PDF starts with the number.
  if (isPrint) {
    const hold = document.getElementById("s-hold");
    if (hold) (hold.closest(".pdf-page") || hold).remove();
  }

  const get = (p) => p.split(".").reduce((o, k) => o[k], T);
  const grp = (s) => String(s).replace(/\B(?=(\d{3})+(?!\d))/g, "’");
  const F = {
    int: (v) => grp(Math.round(v)),
    chf: (v) => { const p = v.toFixed(2).split("."); return grp(p[0]) + "." + p[1]; },
    year: (v) => v.slice(0, 4),
    date: (v) => { const d = v.split("-"); return +d[2] + " " + MONTHS_FULL[+d[1] - 1] + " " + d[0]; },
    url: (v) => v.replace(/^https?:\/\//, ""),
    raw: (v) => v,
  };
  const NAME = {
    "data package": "Data packages", "teaching and training": "Teaching and training",
    "research project": "Research projects", "proposal or report": "Proposals and reports",
    "hardware": "Hardware", "software": "Software", "student project": "Student projects",
  };

  // ---- text from data -------------------------------------------------
  document.querySelectorAll("[data-t]").forEach((el) => {
    const v = get(el.dataset.t);
    const f = el.dataset.f || (typeof v === "number" ? "int" : "raw");
    el.textContent = F[f](v);
  });
  document.getElementById("key-by").textContent = T.talk.authors + ". " + T.talk.affiliation;
  const ws = T.talk.workshop, cut = ws.indexOf(",");
  document.getElementById("ws-name").textContent = ws.slice(0, cut);
  document.getElementById("ws-when").textContent = ws.slice(cut + 1).trim();

  // ---- the story photo: shown only when the file is there ----------------
  (function () {
    const img = document.querySelector("#s-story img.photo");
    if (!img) return;
    const sec = img.closest("section");
    const ok = () => sec.classList.add("has-photo");
    const gone = () => { sec.classList.remove("has-photo"); img.remove(); };
    if (img.complete) (img.naturalWidth > 0 ? ok : gone)();
    else { img.addEventListener("load", ok); img.addEventListener("error", gone); }
  })();

  // ---- fit a line of type to a width ------------------------------------
  const ruler = document.createElement("span");
  ruler.style.cssText = "position:absolute;left:-99999px;top:0;visibility:hidden;white-space:nowrap;" +
    "font:800 200px 'Atkinson Hyperlegible Next';letter-spacing:-0.045em;font-variant-numeric:tabular-nums";
  document.body.appendChild(ruler);
  function fit() {
    document.querySelectorAll(".fit").forEach((el) => {
      ruler.style.textTransform = el.closest(".loud") ? "uppercase" : "none";
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

  // ---- the role figure: professor on top, data steward at the bottom, the
  // 186 engagements between them. Drawn twice, in the same size and position:
  // on the role slide and again on the trade-off slide.
  const groups = T.people.by_group;
  function roleFigure(id, animate) {
    const svg = d3.select(id);
    const ROWS = 9, pitch = 46, size = 40, top = 256, pTop = 110, sTop = 780, bandH = 90;
    const cols = groups.map((g) => Math.ceil(g.n / ROWS));
    const per = (1470 - d3.sum(cols) * pitch) / groups.length;
    const pop = (sel, d) => (animate ? sel.attr("class", (sel.attr("class") || "") + " pop").style("--d", d + "ms") : sel);
    const prof = pop(svg.append("g"), 0);
    prof.append("rect").attr("x", 40).attr("y", pTop).attr("width", 1520).attr("height", bandH).attr("fill", W);
    prof.append("text").attr("class", "band-t").attr("x", 66).attr("y", pTop + 63).attr("fill", K).text("Professor");
    const stew = pop(svg.append("g").attr("class", "stew"), 1000);
    stew.append("rect").attr("class", "stew-band").attr("x", 42).attr("y", sTop + 2).attr("width", 1516).attr("height", bandH - 4)
      .attr("fill", Y).attr("stroke", Y).attr("stroke-width", 4);
    stew.append("text").attr("class", "band-t stew-t").attr("x", 66).attr("y", sTop + 63).attr("fill", K).text("Data steward");
    let x = 40, i = 0;
    groups.forEach((g, gi) => {
      const bx = x + 26;
      const firstTop = top + (ROWS - Math.min(g.n, ROWS)) * pitch;
      // the professor reaches every group, the steward stands beside every group
      prof.append("rect").attr("x", bx + size / 2 - 3).attr("y", pTop + bandH).attr("width", 6).attr("height", firstTop - pTop - bandH - 8).attr("fill", W);
      stew.append("rect").attr("class", "link").attr("x", x).attr("y", top).attr("width", 12).attr("height", sTop - top + 2).attr("fill", Y);
      for (let k = 0; k < g.n; k++, i++) {
        const c = Math.floor(k / ROWS), r = k % ROWS;
        pop(svg.append("rect"), 100 + i * 4)
          .attr("x", bx + c * pitch).attr("y", top + (ROWS - 1 - r) * pitch).attr("width", size).attr("height", size).attr("fill", N);
      }
      svg.append("text").attr("class", "lab").attr("x", bx).attr("y", top + ROWS * pitch + 44).text(g.group.split(/[ ,]/)[0]);
      x += cols[gi] * pitch + per;
    });
  }
  roleFigure("#role", true);
  roleFigure("#anchor", false);

  // ---- repositories by type: the six largest types and "other" -----------
  (function () {
    const svg = d3.select("#repos");
    const all = T.github.repositories_by_type.slice().sort((a, b) => b.total - a.total);
    const lead = all.slice(0, 6);
    const rows = lead.map((d) => ({ name: NAME[d.repository_type], n: d.total }))
      .concat([{ name: "Other", n: T.github.repositories_without_learners - d3.sum(lead, (d) => d.total) }]);
    const x0 = 540, scale = 900 / d3.max(rows, (d) => d.n);
    rows.forEach((d, i) => {
      const y = 126 + i * 107;
      const g = svg.append("g").attr("class", "pop").style("--d", 100 + i * 90 + "ms");
      g.append("text").attr("class", "name").attr("x", 40).attr("y", y + 54).text(d.name);
      g.append("rect").attr("x", x0).attr("y", y).attr("width", d.n * scale).attr("height", 78).attr("fill", i === 0 ? Y : N);
      g.append("text").attr("class", "val").attr("x", x0 + d.n * scale + 16).attr("y", y + 56).text(d.n);
    });
  })();

  // ---- commits per month by people, full history; the agent part on a click
  (function () {
    const svg = d3.select("#months");
    const m = T.github.commits_per_month;
    const base = 800, k = 0.72, p = 1520 / m.length, w = p - 5;
    const xOf = (i) => 40 + i * p;
    svg.append("line").attr("x1", 40).attr("x2", 1560).attr("y1", base - 800 * k).attr("y2", base - 800 * k)
      .attr("stroke", W).attr("stroke-width", 2).attr("stroke-dasharray", "2 10");
    svg.append("text").attr("class", "ax").attr("x", 40).attr("y", base - 800 * k - 14).text("800 commits a month");
    const agent = svg.append("g").attr("class", "fragment");
    m.forEach((d, i) => {
      svg.append("rect").attr("class", "pop").style("--d", 100 + i * 14 + "ms")
        .attr("x", xOf(i)).attr("width", w).attr("y", base - d.commits * k).attr("height", d.commits * k).attr("fill", N);
      agent.append("rect").attr("x", xOf(i)).attr("width", w).attr("y", base - d.assisted * k).attr("height", d.assisted * k).attr("fill", Y);
      if (i === 0 || d.month.slice(5) === "01")
        svg.append("text").attr("class", "ax").attr("x", xOf(i)).attr("y", base + 48).text(d.month.slice(0, 4));
    });
    agent.raise();
    svg.append("rect").attr("x", 40).attr("y", base).attr("width", 1520).attr("height", 4).attr("fill", W);
    // two direct labels at the tallest month
    const top = m.reduce((a, d, i) => (d.commits > m[a].commits ? i : a), 0), d = m[top], lx = xOf(top) - 12;
    const yPeople = base - d.commits * k + 2, yAgent = base - d.assisted * k * 0.86;
    svg.append("rect").attr("x", lx - 2).attr("y", yPeople - 2).attr("width", 10).attr("height", 4).attr("fill", W);
    svg.append("text").attr("class", "dl").attr("x", lx - 10).attr("y", yPeople + 11).attr("text-anchor", "end").text("by people");
    agent.append("rect").attr("x", lx - 2).attr("y", yAgent - 2).attr("width", 10).attr("height", 4).attr("fill", Y);
    agent.append("text").attr("class", "dl").attr("x", lx - 10).attr("y", yAgent + 11).attr("text-anchor", "end").attr("fill", Y).text("with an agent");
  })();

  // ---- commits by people in the last twelve months, by repository type ---
  (function () {
    const svg = d3.select("#types");
    const rows = T.github.commits_by_type_two_windows.filter((d) => NAME[d.repository_type])
      .sort((a, b) => b.current - a.current).slice(0, 6);
    const x0 = 470, scale = 940 / d3.max(rows, (d) => Math.max(d.current, d.previous));
    rows.forEach((d, i) => {
      const y = 122 + i * 124;
      const g = svg.append("g").attr("class", "pop").style("--d", 100 + i * 100 + "ms");
      g.append("text").attr("class", "name").attr("x", 40).attr("y", y + 78).text(NAME[d.repository_type]);
      g.append("rect").attr("x", x0).attr("y", y + 8).attr("width", d.previous * scale).attr("height", 10).attr("fill", N);
      g.append("rect").attr("x", x0).attr("y", y + 30).attr("width", d.current * scale).attr("height", 72).attr("fill", N);
      g.append("rect").attr("x", x0).attr("y", y + 30).attr("width", d.assisted_current * scale).attr("height", 72).attr("fill", Y);
      g.append("text").attr("class", "val").attr("x", x0 + d.current * scale + 16).attr("y", y + 82).text(d.current);
      if (i === 0) {
        // the marks are named once, on the first row
        g.append("text").attr("class", "dl").attr("x", x0 + d.previous * scale + 14).attr("y", y + 23).text("year before");
        g.append("text").attr("class", "dl").attr("x", x0 + 18).attr("y", y + 77).attr("fill", K).text("with an agent");
      }
    });
  })();

  // ---- guluswm: four days on one line, to scale ---------------------------
  (function () {
    const svg = d3.select("#gulu");
    const g = T.gulu, day = 86400000;
    const t0 = Date.parse(g.files_received + "T00:00:00Z"), t1 = Date.parse(g.released + "T00:00:00Z");
    const x = (t) => 120 + ((t - t0) / (t1 - t0)) * 1360;
    const yA = 600;
    svg.append("rect").attr("x", x(t0)).attr("y", yA - 5).attr("width", 1360).attr("height", 10).attr("fill", W);
    for (let t = t0; t <= t1; t += day) {
      const d = new Date(t);
      svg.append("rect").attr("x", x(t) - 3).attr("y", yA + 48).attr("width", 6).attr("height", 28).attr("fill", W);
      svg.append("text").attr("class", "tick").attr("x", x(t)).attr("y", yA + 136).attr("text-anchor", "middle")
        .text(d.getUTCDate() + " " + MONTHS[d.getUTCMonth()]);
    }
    // one mark per question, ten to a row, over the days until all were answered
    const n = g.questions_to_authors, perRow = 10, rows = Math.ceil(n / perRow), size = 56, rowPitch = 68;
    const xa = x(t0) + 44, xb = x(t0 + g.days_until_answered * day), pitch = (xb - xa - size) / (perRow - 1);
    const gTop = yA - 40 - rows * rowPitch;
    for (let i = 0; i < n; i++) {
      svg.append("rect").attr("class", "pop").style("--d", 200 + i * 16 + "ms")
        .attr("x", xa + (i % perRow) * pitch).attr("y", gTop + Math.floor(i / perRow) * rowPitch).attr("width", size).attr("height", size).attr("fill", N);
    }
    svg.append("text").attr("class", "ev").attr("x", xa).attr("y", gTop - 30).text(n + " questions answered");
    svg.append("rect").attr("x", x(t0) - 26).attr("y", yA - 26).attr("width", 52).attr("height", 52).attr("fill", W);
    svg.append("text").attr("class", "ev").attr("x", x(t0) - 26).attr("y", yA + 212).text("Files received");
    const rel = svg.append("g").attr("class", "pop").style("--d", "1100ms");
    rel.append("rect").attr("x", x(t1) - 40).attr("y", yA - 40).attr("width", 80).attr("height", 80).attr("fill", Y);
    rel.append("text").attr("class", "ev").attr("x", x(t1) + 40).attr("y", yA + 212).attr("text-anchor", "end").text("Released with a DOI");
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
    num.textContent = F.chf(0);
    const t0 = performance.now(), dur = 1100;
    (function tick(now) {
      const p = Math.max(0, Math.min(1, (now - t0) / dur)), e = 1 - Math.pow(1 - p, 3);
      num.textContent = F.chf(p < 1 ? Math.floor(target * e) + Math.random() : target);
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        // one hard flash to the deck yellow, 140 ms, once
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
    // the count-up replays every time the number slide is entered
    Reveal.on("slidechanged", (ev) => { sync(); if (ev.currentSlide.contains(num)) countUp(); });
    if (Reveal.getCurrentSlide().contains(num)) countUp();
  }
  function boot() {
    if (typeof Reveal === "undefined") return setTimeout(boot, 50);
    if (Reveal.isReady && Reveal.isReady()) start(); else Reveal.on("ready", start);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
