// Deck E: the talk as a commit history.
// Every number comes from window.TALK. Every chart is drawn in its final state
// first (so it prints), and animates towards that state when the slide is entered.
(function () {
  const T = window.TALK;
  const isPrint = /print-pdf/.test(location.search);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const still = isPrint || reduced;

  const C = { bg: "#15171c", ink: "#f5f1e8", muted: "#bcb7ab", accent: "#ffb224", neutral: "#596170", light: "#d9d4c7" };
  const int = (v) => d3.format(",")(v).replace(/,/g, "'");
  const chf = (v) => d3.format(",.2f")(v).replace(/,/g, "'");
  const pct = (v) => Math.round(v * 100) + "%";
  const day = (s) => d3.timeFormat("%-d %B")(new Date(s + "T00:00:00"));
  const set = (id, v) => { document.getElementById(id).textContent = v; };
  // transition helper: animate only when asked
  const tr = (sel, animate, delay, dur) =>
    animate ? sel.transition().delay(delay).duration(dur).ease(d3.easeCubicOut) : sel;

  const sections = Array.from(document.querySelectorAll(".reveal .slides > section"));
  const hooks = {};

  // ------------------------------------------------------------ commit graph
  (function graph() {
    const N = sections.length;
    const branchIds = ["s-bridge", "s-agent", "s-types", "s-gulu", "s-tradeoff"];
    const lane = sections.map((s) => (branchIds.includes(s.id) ? 1 : 0));
    const first = lane.indexOf(1), last = lane.lastIndexOf(1);
    const X = [48, 92];
    const y = (k) => 70 + (k * 730) / (N - 1);
    const mainPath = `M${X[0]},${y(0)}L${X[0]},${y(N - 1)}`;
    const mid1 = (y(first - 1) + y(first)) / 2, mid2 = (y(last) + y(last + 1)) / 2;
    const branchPath =
      `M${X[0]},${y(first - 1)}C${X[0]},${mid1} ${X[1]},${mid1} ${X[1]},${y(first)}` +
      `L${X[1]},${y(last)}C${X[1]},${mid2} ${X[0]},${mid2} ${X[0]},${y(last + 1)}`;
    sections.forEach((sec, i) => {
      const svg = d3.select(sec).append("svg").attr("class", "cgraph").attr("viewBox", "0 0 130 900").attr("aria-hidden", "true");
      svg.append("clipPath").attr("id", "cg-clip-" + i).append("rect").attr("x", 0).attr("y", 0).attr("width", 130).attr("height", y(i));
      svg.append("path").attr("class", "ghost").attr("d", mainPath);
      svg.append("path").attr("class", "ghost").attr("d", branchPath);
      const done = svg.append("g").attr("clip-path", `url(#cg-clip-${i})`);
      done.append("path").attr("class", "done").attr("d", mainPath);
      done.append("path").attr("class", "done").attr("d", branchPath);
      for (let k = 0; k < N; k++) {
        const c = svg.append("circle").attr("cx", X[lane[k]]).attr("cy", y(k));
        if (k < i) c.attr("class", "n-past").attr("r", 10);
        else if (k === i) c.attr("class", "n-cur").attr("r", 17);
        else c.attr("class", "n-future").attr("r", 6);
      }
    });
  })();

  // ------------------------------------------------------------ 1 the number
  (function number() {
    const sec = document.getElementById("s-number");
    const el = document.getElementById("n1-num");
    const target = T.proposals.amount_chf;
    el.textContent = chf(target);
    set("n1-written", T.proposals.written);
    set("n1-funded", T.proposals.funded);
    let raf = 0, timers = [];
    const bgEl = () => Reveal.getSlideBackground(sec);
    function settle() {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout); timers = [];
      el.textContent = chf(target);
      sec.classList.add("landed");
      sec.classList.remove("thump");
      const b = bgEl();
      if (b) { b.style.transition = "none"; b.style.backgroundColor = C.accent; }
    }
    hooks["s-number"] = {
      enter() {
        if (still) return;
        settle();
        const b = bgEl();
        sec.classList.remove("landed");
        b.style.transition = "none";
        b.style.backgroundColor = C.bg;
        const t0 = performance.now(), dur = 1700;
        (function tick(now) {
          const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 4);
          el.textContent = chf(target * e);
          if (p < 1) { raf = requestAnimationFrame(tick); return; }
          // landing: one flash from a pale field to the colour field
          el.textContent = chf(target);
          sec.classList.add("landed", "thump");
          b.style.backgroundColor = "#fff4d6";
          timers.push(setTimeout(() => {
            b.style.transition = "background-color 450ms ease-out";
            b.style.backgroundColor = C.accent;
          }, 120));
        })(t0);
      },
      leave: settle,
    };
  })();

  // ------------------------------------------------------------ 2 the key
  set("tb-title", T.talk.title);
  set("tb-authors", T.talk.authors + ". " + T.talk.affiliation);
  set("tb-event", T.talk.event);

  // ------------------------------------------------------------ 4 the role
  (function role() {
    set("role-num", T.people.total);
    const svg = d3.select("#role-chart");
    const groups = T.people.by_group;
    const perRow = 32, pitch = 22, x0 = 850, prof = { x: 220, y: 600 }, stew = { x: 520, y: 600 };
    let yy = 130;
    const layout = groups.map((g) => {
      const rows = Math.ceil(g.n / perRow);
      const o = { g, top: yy, rows, mid: yy + 44 + (rows * pitch) / 2 - 12 };
      yy += 48 + rows * pitch + 30;
      return o;
    });
    function draw(animate) {
      svg.selectAll("*").interrupt();
      svg.selectAll("*").remove();
      const lines = svg.append("g").attr("fill", "none").attr("stroke", C.neutral).attr("stroke-width", 4);
      const l0 = lines.append("path").attr("d", `M${prof.x},${prof.y}L${stew.x},${stew.y}`).attr("stroke", "#8b93a1");
      const fan = lines.selectAll("path.fan").data(layout).join("path").attr("class", "fan")
        .attr("d", (d) => `M${stew.x},${stew.y}C${stew.x + 190},${stew.y} ${x0 - 200},${d.mid} ${x0 - 26},${d.mid}`);
      [l0, fan].forEach((s, i) => {
        s.attr("opacity", animate ? 0 : 1);
        tr(s, animate, 200 + i * 450, 500).attr("opacity", 1);
      });
      svg.append("circle").attr("cx", prof.x).attr("cy", prof.y).attr("r", 24).attr("fill", C.bg).attr("stroke", C.ink).attr("stroke-width", 5);
      svg.append("text").attr("x", prof.x).attr("y", prof.y + 78).attr("text-anchor", "middle").attr("font-size", 30).text("professor");
      const sc = svg.append("circle").attr("cx", stew.x).attr("cy", stew.y).attr("fill", C.accent).attr("r", animate ? 0 : 38);
      tr(sc, animate, 450, 500).attr("r", 38);
      svg.append("text").attr("x", stew.x).attr("y", stew.y + 78).attr("text-anchor", "middle").attr("font-size", 30).attr("font-weight", 700).attr("class", "acc").text("data steward");
      let idx = 0;
      layout.forEach((L) => {
        const lab = svg.append("text").attr("x", x0 - 8).attr("y", L.top + 26).attr("font-size", 30);
        lab.append("tspan").attr("font-weight", 800).text(L.g.n + " ");
        lab.append("tspan").text(L.g.group.toLowerCase());
        const dots = svg.append("g").selectAll("circle").data(d3.range(L.g.n)).join("circle")
          .attr("cx", (j) => x0 + (j % perRow) * pitch).attr("cy", (j) => L.top + 52 + Math.floor(j / perRow) * pitch)
          .attr("r", 8).attr("fill", C.light).attr("opacity", animate ? 0 : 1);
        const base = idx;
        tr(dots, animate, (j) => 1000 + (base + j) * 7, 200).attr("opacity", 1);
        idx += L.g.n;
      });
    }
    draw(false);
    hooks["s-role"] = { enter() { if (!still) draw(true); }, leave() { draw(false); } };
  })();

  // ------------------------------------------------------------ 5 ghedata
  (function repos() {
    set("repo-all", int(T.github.repositories_without_learners));
    const data = T.github.repositories_by_type.slice().sort((a, b) => b.total - a.total);
    set("repo-dp", int(data.find((d) => d.repository_type === "data package").total));
    const svg = d3.select("#repo-chart");
    const x0 = 560, rowH = 47, top = 190;
    const x = d3.scaleLinear().domain([0, d3.max(data, (d) => d.total)]).range([0, 860]);
    function draw(animate) {
      svg.selectAll("*").interrupt();
      svg.selectAll("*").remove();
      const row = svg.selectAll("g").data(data).join("g").attr("transform", (d, i) => `translate(0,${top + i * rowH})`);
      const isDp = (d) => d.repository_type === "data package";
      row.append("text").attr("x", x0 - 18).attr("y", 31).attr("text-anchor", "end").attr("font-size", 29)
        .attr("font-weight", (d) => (isDp(d) ? 800 : 400)).attr("class", (d) => (isDp(d) ? "acc" : null)).text((d) => d.repository_type);
      const bars = row.append("rect").attr("x", x0).attr("y", 5).attr("height", 34).attr("rx", 4)
        .attr("fill", (d) => (isDp(d) ? C.accent : C.neutral)).attr("width", (d) => (animate ? 0 : x(d.total)));
      tr(bars, animate, (d, i) => 150 + i * 60, 700).attr("width", (d) => x(d.total));
      const lab = row.append("text").attr("y", 32).attr("font-size", 30).attr("font-weight", 700)
        .attr("class", (d) => (isDp(d) ? "acc" : null)).attr("x", (d) => x0 + x(d.total) + 12)
        .attr("opacity", animate ? 0 : 1).text((d) => d.total);
      tr(lab, animate, (d, i) => 700 + i * 60, 300).attr("opacity", 1);
    }
    draw(false);
    hooks["s-ghedata"] = { enter() { if (!still) draw(true); }, leave() { draw(false); } };
  })();

  // ------------------------------------------------------------ 7 agent share
  (function agent() {
    const G = T.github;
    set("ag-prev", pct(G.assisted_share_previous));
    set("ag-cur", pct(G.assisted_share_current));
    const months = G.commits_per_month.slice(-24);
    const unit = 10, wide = 3, pitch = 15, size = 13, colW = wide * pitch + 5, gap = 50, x0 = 152, base = 730;
    const colX = (m) => x0 + m * colW + (m >= 12 ? gap : 0);
    const cells = [];
    months.forEach((mo, m) => {
      const tot = Math.round(mo.commits / unit), ag = Math.round(mo.assisted / unit);
      for (let j = 0; j < tot; j++)
        cells.push({ m, x: colX(m) + (j % wide) * pitch, y: base - (Math.floor(j / wide) + 1) * pitch, agent: j >= tot - ag, row: Math.floor(j / wide) });
    });
    const svg = d3.select("#agent-chart");
    const windows = [
      { from: 0, to: 11, label: G.commit_windows.previous, share: pct(G.assisted_share_previous) },
      { from: 12, to: 23, label: G.commit_windows.current, share: pct(G.assisted_share_current) },
    ];
    function draw(animate) {
      svg.selectAll("*").interrupt();
      svg.selectAll("*").remove();
      // key, top right
      const key = svg.append("g").attr("transform", "translate(1160,64)");
      key.append("rect").attr("width", 24).attr("height", 24).attr("rx", 3).attr("fill", C.neutral);
      key.append("text").attr("x", 38).attr("y", 22).attr("font-size", 28).text("one square is " + unit + " commits");
      key.append("rect").attr("y", 44).attr("width", 24).attr("height", 24).attr("rx", 3).attr("fill", C.accent);
      key.append("text").attr("x", 38).attr("y", 66).attr("font-size", 28).attr("class", "acc").text("made with an agent");
      const rects = svg.append("g").selectAll("rect").data(cells).join("rect")
        .attr("x", (d) => d.x).attr("y", (d) => d.y).attr("width", size).attr("height", size).attr("rx", 2)
        .attr("fill", (d) => (d.agent ? C.accent : C.neutral)).attr("opacity", animate ? 0 : 1);
      tr(rects, animate, (d) => 200 + d.m * 95 + d.row * 9, 160).attr("opacity", 1);
      windows.forEach((w) => {
        const xa = colX(w.from), xb = colX(w.to) + wide * pitch - 2;
        svg.append("path").attr("d", `M${xa},${base + 10}L${xb},${base + 10}`).attr("stroke", "#8b93a1").attr("stroke-width", 4).attr("stroke-linecap", "round");
        const t = svg.append("text").attr("x", xa).attr("y", base + 52).attr("font-size", 30);
        t.append("tspan").attr("font-weight", 800).attr("fill", w.from ? C.accent : C.ink).text(w.share + "  ");
        t.append("tspan").attr("class", "m").attr("fill", C.muted).text(w.label);
      });
    }
    draw(false);
    hooks["s-agent"] = { enter() { if (!still) draw(true); }, leave() { draw(false); } };
  })();

  // ------------------------------------------------------------ 7 commits by type
  (function types() {
    const G = T.github;
    set("cm-prev", int(G.commit_change_all.previous));
    set("cm-cur", int(G.commit_change_all.current));
    set("cm-fac", G.commit_change_all.factor);
    const data = G.commits_by_type_two_windows.slice().sort((a, b) => b.current - a.current).slice(0, 6);
    const svg = d3.select("#types-chart");
    const x0 = 560, rowH = 92, top = 238;
    const x = d3.scaleLinear().domain([0, d3.max(data, (d) => Math.max(d.current, d.previous))]).range([0, 520]);
    function draw(animate) {
      svg.selectAll("*").interrupt();
      svg.selectAll("*").remove();
      // key
      const key = svg.append("g").attr("transform", "translate(152,172)");
      [["12 months before", "#8b93a1", 0], ["last 12 months", C.light, 330], ["of these, made with an agent", C.accent, 630]].forEach(([t, c, dx]) => {
        key.append("rect").attr("x", dx).attr("width", 26).attr("height", 26).attr("rx", 3).attr("fill", c);
        key.append("text").attr("x", dx + 38).attr("y", 23).attr("font-size", 28).attr("fill", c === C.accent ? C.accent : C.ink).text(t);
      });
      const row = svg.selectAll("g.row").data(data).join("g").attr("class", "row").attr("transform", (d, i) => `translate(0,${top + i * rowH})`);
      row.append("text").attr("x", x0 - 18).attr("y", 50).attr("text-anchor", "end").attr("font-size", 30)
        .attr("font-weight", (d, i) => (i === 0 ? 800 : 400)).text((d) => d.repository_type);
      const dly = (d, i) => 150 + i * 90;
      const prev = row.append("rect").attr("x", x0).attr("y", 8).attr("height", 16).attr("rx", 3).attr("fill", "#8b93a1")
        .attr("width", (d) => (animate ? 0 : x(d.previous)));
      tr(prev, animate, dly, 600).attr("width", (d) => x(d.previous));
      const cur = row.append("rect").attr("x", x0).attr("y", 34).attr("height", 36).attr("rx", 3).attr("fill", C.light)
        .attr("width", (d) => (animate ? 0 : x(d.current)));
      tr(cur, animate, (d, i) => 800 + i * 90, 800).attr("width", (d) => x(d.current));
      const ag = row.append("rect").attr("x", x0).attr("y", 34).attr("height", 36).attr("rx", 3).attr("fill", C.accent)
        .attr("width", (d) => (animate ? 0 : x(d.assisted_current)));
      tr(ag, animate, (d, i) => 1700 + i * 90, 700).attr("width", (d) => x(d.assisted_current));
      const lp = row.append("text").attr("x", (d) => x0 + x(d.previous) + 12).attr("y", 26).attr("font-size", 28).attr("class", "m")
        .attr("opacity", animate ? 0 : 1)
        .text((d, i) => int(d.previous) + (i === 0 ? ", then " + d.factor + " times as many" : ""));
      tr(lp, animate, (d, i) => 600 + i * 90, 300).attr("opacity", 1);
      const lc = row.append("text").attr("x", (d) => x0 + x(d.current) + 12).attr("y", 63).attr("font-size", 30)
        .attr("opacity", animate ? 0 : 1);
      lc.append("tspan").attr("font-weight", 800).text((d) => int(d.current));
      lc.append("tspan").attr("fill", C.accent).attr("font-weight", 700).text((d) => "   " + pct(d.share_assisted_current) + " with an agent");
      tr(lc, animate, (d, i) => 1700 + i * 90, 400).attr("opacity", 1);
    }
    draw(false);
    hooks["s-types"] = { enter() { if (!still) draw(true); }, leave() { draw(false); } };
  })();

  // ------------------------------------------------------------ 8 gulu
  (function gulu() {
    const g = T.gulu;
    set("gulu-days", g.days_to_release);
    set("gulu-source", "Data package " + g.package + ", household solid waste, " + g.place + ". doi.org/" + g.doi);
    const svg = d3.select("#gulu-chart");
    const steps = [
      { x: 390, big: day(g.files_received), small: "files received", accent: false },
      { x: 850, big: g.questions_to_authors + " questions", small: "answered within " + g.days_until_answered + " days", accent: false },
      { x: 1320, big: day(g.released), small: "released with a DOI", accent: true },
    ];
    const y = 440;
    function draw(animate) {
      svg.selectAll("*").interrupt();
      svg.selectAll("*").remove();
      const line = svg.append("path").attr("d", `M${steps[0].x},${y}L${steps[2].x},${y}`).attr("stroke", "#8b93a1").attr("stroke-width", 6).attr("stroke-linecap", "round");
      const len = steps[2].x - steps[0].x;
      line.attr("stroke-dasharray", len).attr("stroke-dashoffset", animate ? len : 0);
      if (animate) line.transition().delay(300).duration(1600).ease(d3.easeLinear).attr("stroke-dashoffset", 0);
      steps.forEach((s, i) => {
        const d = 300 + i * 800; 
        const c = svg.append("circle").attr("cx", s.x).attr("cy", y).attr("r", animate ? 0 : 30)
          .attr("fill", s.accent ? C.accent : C.bg).attr("stroke", s.accent ? C.accent : C.ink).attr("stroke-width", 7);
        tr(c, animate, d, 400).attr("r", 30);
        const t = svg.append("g").attr("opacity", animate ? 0 : 1);
        t.append("text").attr("x", s.x).attr("y", y + 120).attr("text-anchor", "middle").attr("font-size", 68).attr("font-weight", 800)
          .attr("class", s.accent ? "acc" : null).text(s.big);
        t.append("text").attr("x", s.x).attr("y", y + 178).attr("text-anchor", "middle").attr("font-size", 38).text(s.small);
        tr(t, animate, d + 100, 400).attr("opacity", 1);
      });
    }
    draw(false);
    hooks["s-gulu"] = { enter() { if (!still) draw(true); }, leave() { draw(false); } };
  })();

  // ------------------------------------------------------------ 9 trade-off
  (function trade() {
    set("tr-persons", T.steward.persons);
    set("tr-hours", T.steward.hours_per_week);
    const svg = d3.select("#trade-chart");
    const n = T.people.by_group.length, cx = 1250, cy = 400;
    const ys = d3.range(n).map((i) => 170 + (i * 460) / (n - 1));
    function draw(animate) {
      svg.selectAll("*").interrupt();
      svg.selectAll("*").remove();
      const g = svg.append("g").attr("fill", "none").attr("stroke-width", 6).attr("stroke-linecap", "round");
      g.selectAll("path.in").data(ys).join("path").attr("class", "in").attr("stroke", C.light)
        .attr("d", (d) => `M960,${d}C1110,${d} 1100,${cy} ${cx},${cy}`);
      const out = g.selectAll("path.out").data(ys).join("path").attr("class", "out").attr("stroke", C.light)
        .attr("d", (d) => `M${cx},${cy}C1400,${cy} 1390,${d} 1540,${d}`)
        .attr("stroke-dasharray", animate ? "0 0" : "4 18").attr("opacity", animate ? 1 : 0.55);
      const node = svg.append("circle").attr("cx", cx).attr("cy", cy).attr("r", 46).attr("stroke", C.accent).attr("stroke-width", 8)
        .attr("fill", animate ? C.accent : C.bg).attr("stroke-dasharray", animate ? "0 0" : "10 14");
      if (animate) {
        out.transition().delay(1500).duration(0).attr("stroke-dasharray", "4 18").transition().duration(700).attr("opacity", 0.55);
        node.transition().delay(1500).duration(700).attr("fill", C.bg).on("start", function () { d3.select(this).attr("stroke-dasharray", "10 14"); });
      }
    }
    draw(false);
    hooks["s-tradeoff"] = { enter() { if (!still) draw(true); }, leave() { draw(false); } };
  })();

  // ------------------------------------------------------------ end
  const bare = (u) => u.replace(/^https?:\/\//, "");
  set("end-workshop", T.talk.workshop);
  set("end-data", bare(T.talk.package_url));
  set("end-slides", bare(T.talk.slides_repo));
  set("end-authors", T.talk.authors);
  set("end-aff", T.talk.affiliation);

  // ------------------------------------------------------------ slide hooks
  window.addEventListener("load", () => {
    if (typeof Reveal === "undefined") return;
    const go = (ev) => {
      const p = ev.previousSlide && hooks[ev.previousSlide.id];
      if (p && p.leave) p.leave();
      const c = ev.currentSlide && hooks[ev.currentSlide.id];
      if (c && c.enter) c.enter();
    };
    Reveal.on("slidechanged", go);
    if (Reveal.isReady()) go({ currentSlide: Reveal.getCurrentSlide() });
    else Reveal.on("ready", go);
  });
})();
