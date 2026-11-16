// Deck C, "Every dot is one thing".
// One canvas sits behind all slides. Every slide and every fragment step is a
// "scene": a list of marks with a key, a position, a size and a colour. When
// the clicker moves on, marks with the same key travel to their new place,
// new marks enter and marks that are no longer needed fade. A scene is a pure
// function of (slide, step), so jumping to any slide, going backwards and
// printing all give the correct state. In print-pdf mode every slide gets its
// own static canvas with its final state.
// Every number comes from window.TALK (talk/shared/data.js).
(function () {
  "use strict";
  const T = window.TALK;
  const W = 1600, H = 900;
  const LIGHT = [216, 222, 236];
  const ACC = [237, 109, 55];
  const DUR = 900;
  const isPrint = /print-pdf/.test(location.search);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fmt = d3.format(",");
  const fmt2 = d3.format(",.2f");
  const pct = (v) => Math.round(v * 100) + "%";
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
  const dayMonth = (iso) => { const p = iso.split("-"); return +p[2] + " " + MONTHS[+p[1] - 1]; };

  // deterministic random numbers, so every run and the PDF look the same
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // position of unit number i in a block that fills from a baseline upwards
  function unit(i, cols, pitch, cx, base) {
    return {
      x: cx + ((i % cols) - (cols - 1) / 2) * pitch,
      y: base - pitch / 2 - Math.floor(i / cols) * pitch,
    };
  }
  // position of unit number i in a block that fills from the top, centred
  function grid(i, cols, rows, pitch, cx, cy) {
    return {
      x: cx + ((i % cols) - (cols - 1) / 2) * pitch,
      y: cy + (Math.floor(i / cols) - (rows - 1) / 2) * pitch,
    };
  }
  const dot = (k, x, y, r, col, a, extra) => Object.assign({ k, x, y, r, sh: "c", col, a: a == null ? 1 : a }, extra);
  const sq = (k, x, y, r, col, a, extra) => Object.assign({ k, x, y, r, sh: "s", col, a: a == null ? 1 : a }, extra);
  const lab = (k, html, x, y, fs, extra) => Object.assign({ k, html, x, y, fs }, extra);

  /* ---------- data preparation ---------- */

  const P = T.proposals, PE = T.people, G = T.github, GU = T.gulu;
  const FUNDED = [4, 12, 19, 25].slice(0, P.funded); // which dots light up is arbitrary

  // people: one mark per engagement, in the order of the groups on the slide
  const groupOrder = ["Bachelor theses", "Master theses", "Semester projects", "Doctoral theses", "Staff, interns and assistants"];
  const groupShort = { "Bachelor theses": "Bachelor", "Master theses": "Master", "Semester projects": "Semester", "Doctoral theses": "Doctoral", "Staff, interns and assistants": "Staff" };
  const groups = groupOrder.map((g) => PE.by_group.find((d) => d.group === g)).filter(Boolean);
  PE.by_group.forEach((d) => { if (!groups.includes(d)) groups.push(d); });
  const people = [];
  groups.forEach((g, gi) => { for (let j = 0; j < g.n; j++) people.push({ gi, j }); });

  // repositories: one square each; the three largest types and the rest
  const repoTypes = G.repositories_by_type.slice().sort((a, b) => b.total - a.total);
  const repoShort = { "data package": "data packages", "teaching and training": "teaching", "research project": "research" };
  const repoBlocks = repoTypes.slice(0, 3).map((d) => ({ name: repoShort[d.repository_type] || d.repository_type, n: d.total }));
  repoBlocks.push({ name: "other", n: d3.sum(repoTypes.slice(3), (d) => d.total) });
  const repos = [];
  repoBlocks.forEach((b, bi) => { for (let j = 0; j < b.n; j++) repos.push({ bi, j }); });

  // commits: one mark per commit of the last 24 months
  const months = G.commits_per_month.slice(-24);
  const monthIndex = new Map(months.map((m, i) => [m.month, i]));
  const typeTable = G.commits_by_type_two_windows.slice().sort((a, b) => b.current - a.current);
  const typeShort = { "hardware": "hardware", "data package": "data packages", "research project": "research", "software": "software", "teaching and training": "teaching" };
  const topTypes = typeTable.slice(0, 5).map((d) => d.repository_type);
  const typeGroups = topTypes.map((t) => {
    const d = typeTable.find((x) => x.repository_type === t);
    return { name: typeShort[t] || t, previous: d.previous, current: d.current, share: d.share_assisted_current };
  });
  typeGroups.push({ name: "other", previous: 0, current: 0, assisted: 0 });
  const commits = [];
  (function () {
    const perMonth = months.map(() => ({ as: [], no: [] }));
    G.commits_per_month_by_type.forEach((d) => {
      const mi = monthIndex.get(d.month);
      if (mi == null) return;
      let gi = topTypes.indexOf(d.repository_type);
      if (gi < 0) gi = typeGroups.length - 1;
      for (let j = 0; j < d.commits; j++) (j < d.assisted ? perMonth[mi].as : perMonth[mi].no).push(gi);
    });
    const wrank = [[0, 0], [0, 0]];
    perMonth.forEach((pm, mi) => {
      const win = mi < 12 ? 0 : 1;
      pm.as.forEach((gi, j) => commits.push({ mi, win, gi, as: 1, mrank: j }));
      pm.no.forEach((gi, j) => commits.push({ mi, win, gi, as: 0, mrank: pm.as.length + j }));
    });
    const winN = [0, 1].map((w) => commits.filter((c) => c.win === w));
    const winAs = winN.map((l) => l.filter((c) => c.as).length);
    commits.forEach((c) => {
      c.wrank = c.as ? wrank[c.win][0]++ : winAs[c.win] + wrank[c.win][1]++;
    });
    // rank inside type and window, agent commits first
    typeGroups.forEach((g, gi) => {
      [0, 1].forEach((w) => {
        const l = commits.filter((c) => c.gi === gi && c.win === w);
        const nAs = l.filter((c) => c.as).length;
        let a = 0, b = 0;
        l.forEach((c) => { c.trank = c.as ? a++ : nAs + b++; });
        if (gi === typeGroups.length - 1) {
          if (w === 0) g.previous = l.length; else { g.current = l.length; g.share = nAs / l.length; }
        } else if (l.length !== (w === 0 ? g.previous : g.current)) {
          console.error("commit marks do not match the table for " + g.name);
        }
      });
    });
    commits.forEach((c, i) => { c.k = "c" + i; });
    if (winN[0].length !== G.commit_change_all.previous || winN[1].length !== G.commit_change_all.current)
      console.error("commit marks do not match commit_change_all");
  })();
  const monthLabel = (m) => MONTHS[+m.slice(5) - 1].slice(0, 3) + " " + m.slice(0, 4);
  const windowLabel = (a, b) => a.slice(5) + "/" + a.slice(0, 4) + "–" + b.slice(5) + "/" + b.slice(0, 4);

  /* ---------- scenes ---------- */

  function ringMarks(cx, cy, R, r, n, sR) {
    const out = [];
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (i / n) * 2 * Math.PI;
      out.push(dot("p" + i, cx + R * Math.cos(a), cy + R * Math.sin(a), r, LIGHT, 0.9, { d: i * 14 }));
    }
    out.push(dot("S", cx, cy, sR, ACC, 1));
    return out;
  }

  const scenes = {
    // 1. the number, then 30 proposals, then 4 funded
    number(step) {
      const marks = [], labels = [];
      if (step >= 1) {
        for (let i = 0; i < P.written; i++) {
          const f = step >= 2 && FUNDED.includes(i);
          marks.push(dot("p" + i, 800 + (i - (P.written - 1) / 2) * 46, 660, f ? 19 : 15,
            f ? ACC : LIGHT, step >= 2 && !f ? 0.4 : 0.95,
            { d: step === 1 ? i * 22 : 0, from: { x: 800 + (i - (P.written - 1) / 2) * 46, y: 520, r: 4 } }));
        }
        labels.push(lab("w", "<b>" + P.written + "</b> proposals written", 118, 716, 44));
      }
      if (step >= 2) labels.push(lab("f", "<b>" + P.funded + "</b> funded", 1482, 716, 44, { cls: "r acc" }));
      return { marks, labels };
    },

    // 2. the key: one accent dot inside a ring of dots
    key() {
      return { marks: ringMarks(430, 450, 250, 14, P.written, 36), labels: [] };
    },

    // 3. two children, one computer
    who(step) {
      const marks = [
        dot("p0", 650, 380, 70, LIGHT, 0.9),
        dot("S", 330, 380, 70, step >= 1 ? ACC : LIGHT, step >= 1 ? 1 : 0.9),
      ];
      const labels = [];
      if (step >= 1) {
        labels.push(lab("computer", "computer", 330, 475, 44, { cls: "c acc", ld: 200 }));
        labels.push(lab("dolls", "dolls", 650, 475, 44, { cls: "c", ld: 200 }));
      }
      if (step >= 2) labels.push(lab("no", "No doctorate.<br>No computer science degree.", 120, 640, 64, { cls: "b", ld: 100 }));
      return { marks, labels };
    },

    // 4. the layer between the professor and 186 engagements
    role(step) {
      const marks = [dot("prof", 800, 70, 20, LIGHT, 1, { ring: 1, lw: 5 }), dot("S", 800, 165, 20, ACC, 1)];
      const links = [["prof", "S", 0.7, LIGHT]];
      const labels = [
        lab("n", "<b>" + PE.total + "</b>", 80, 40, 130, { ld: 300 }),
        lab("prof", "professor", 838, 50, 32, { ld: 300 }),
      ];
      const cx = (gi) => 800 + (gi - (groups.length - 1) / 2) * 270;
      people.forEach((p, i) => {
        const pos = step === 0 ? grid(i, 31, 6, 40, 800, 470) : unit(p.j, 6, 30, cx(p.gi), 715);
        marks.push(dot("e" + i, pos.x, pos.y, 11, LIGHT, 0.9, { d: step === 0 ? i * 4 : p.gi * 90 + p.j * 4, from: { x: 800, y: 165, r: 3 } }));
        links.push(["S", "e" + i, 0.2, ACC]);
      });
      if (step === 0) {
        labels.push(lab("since", "engagements since " + T.steward.start_date.slice(0, 4), 84, 180, 36, { ld: 300 }));
        labels.push(lab("stew", "steward", 838, 145, 32, { cls: "acc", ld: 300 }));
      } else {
        groups.forEach((g, gi) => {
          labels.push(lab("gn" + gi, "<b>" + g.n + "</b>", cx(gi), 722, 60, { cls: "c", ld: 600 + gi * 90 }));
          labels.push(lab("gl" + gi, groupShort[g.group] || g.group, cx(gi), 790, 32, { cls: "c dim", ld: 600 + gi * 90 }));
        });
      }
      return { marks, links, labels };
    },

    // 5. ghedata: three tables, then the repositories by type
    ghedata(step) {
      const marks = [], labels = [lab("t", "ghedata", 80, 40, 110, { cls: "b", ld: 200 })];
      if (step === 0) {
        for (let i = 0; i < P.written; i++) {
          const p = grid(i, 6, 5, 36, 250, 470), f = FUNDED.includes(i);
          marks.push(dot("p" + i, p.x, p.y, 12, f ? ACC : LIGHT, 0.95, { d: i * 10 }));
        }
        people.forEach((q, i) => {
          const p = grid(i, 14, 14, 22, 1350, 470);
          marks.push(dot("e" + i, p.x, p.y, 8, LIGHT, 0.9, { d: i * 3 }));
        });
        repos.forEach((q, i) => {
          const p = grid(i, 23, 15, 22, 800, 470);
          marks.push(sq("r" + i, p.x, p.y, 8, LIGHT, 0.9, { d: 200 + i * 2 }));
        });
        labels.push(lab("lp", "<b>" + P.written + "</b> proposals", 250, 660, 40, { cls: "c" }));
        labels.push(lab("lr", "<b>" + G.repositories_without_learners + "</b> repositories", 800, 660, 40, { cls: "c" }));
        labels.push(lab("le", "<b>" + PE.total + "</b> engagements", 1350, 660, 40, { cls: "c" }));
        labels.push(lab("flag", "placeholder", 250, 730, 28, { cls: "c draft-flag" }));
      } else {
        const cx = (bi) => 365 + bi * 290;
        repos.forEach((q, i) => {
          const p = unit(q.j, 8, 30, cx(q.bi), 690);
          marks.push(sq("r" + i, p.x, p.y, 12, q.bi === 0 ? ACC : LIGHT, q.bi === 0 ? 1 : 0.85, { d: q.bi * 120 + q.j * 3 }));
        });
        labels.push(lab("all", "<b>" + G.repositories_without_learners + "</b> repositories", 84, 180, 44, { ld: 300 }));
        repoBlocks.forEach((b, bi) => {
          labels.push(lab("bn" + bi, "<b>" + b.n + "</b>", cx(bi), 698, 60, { cls: "c" + (bi === 0 ? " acc" : ""), ld: 600 + bi * 120 }));
          labels.push(lab("bl" + bi, b.name, cx(bi), 766, 32, { cls: "c" + (bi === 0 ? " acc" : " dim"), ld: 600 + bi * 120 }));
        });
      }
      return { marks, labels };
    },

    // 6. the bridge: many groups, the tools arrive everywhere, one group has someone inside
    bridge(step) {
      const marks = [], rnd = rng(7);
      const labels = [lab("a", "The AI tools arrived everywhere.", 80, 36, 64, { cls: "b", ld: 200 })];
      for (let g = 0; g < 15; g++) {
        const cx = 200 + (g % 5) * 300, cy = 270 + Math.floor(g / 5) * 200, home = g === 7;
        for (let j = 0; j < 10; j++) {
          const a = -Math.PI / 2 + (j / 10) * 2 * Math.PI;
          marks.push(dot("b" + g + "_" + j, cx + 56 * Math.cos(a), cy + 56 * Math.sin(a), 9, LIGHT, 0.9, { d: g * 25 }));
          const ra = rnd() * 2 * Math.PI, rr = 82 + rnd() * 20;
          const landed = home && step >= 1;
          const k = g * 10 + j;
          marks.push(landed
            ? sq("r" + k, cx + 84 * Math.cos(a), cy + 84 * Math.sin(a), 7, ACC, 1, { d: j * 50 })
            : sq("r" + k, cx + rr * Math.cos(ra), cy + rr * Math.sin(ra), 5, LIGHT, 0.75,
              { d: 300 + g * 30 + j * 15, from: { x: cx + rr * Math.cos(ra), y: -30, r: 5 } }));
        }
        if (home) marks.push(dot("S", cx, cy, 17, ACC, 1));
      }
      if (step >= 1) labels.push(lab("b", "Here they landed. Someone was inside.", 80, 800, 56, { cls: "b acc", ld: 500 }));
      return { marks, labels };
    },

    // 7. photo slide, no marks
    photo() { return { marks: [], labels: [] }; },

    // 8. commits per month, agent commits light up, two years side by side
    share(step) {
      const marks = [], labels = [];
      const prev = G.commit_change_all.previous, cur = G.commit_change_all.current;
      if (step < 2) {
        commits.forEach((c) => {
          const x = 87 + c.mi * 60 + (c.mrank % 10) * 5, row = Math.floor(c.mrank / 10), y = 786 - row * 5;
          marks.push(sq(c.k, x, y, 2, step >= 1 && c.as ? ACC : LIGHT, step >= 1 && !c.as ? 0.75 : 0.9,
            { d: step === 0 ? c.mi * 22 + row * 4 : (c.as ? c.mi * 18 : 0), dur: 700, from: { x, y: 790, r: 2 } }));
        });
        labels.push(lab("t", "commits per month", 80, 36, 60, { cls: "b", ld: 200 }));
        labels.push(lab("m0", monthLabel(months[0].month), 85, 802, 30, { cls: "dim", ld: 200 }));
        labels.push(lab("m1", monthLabel(months[23].month), 1517, 802, 30, { cls: "r dim", ld: 200 }));
        if (step >= 1) labels.push(lab("ag", "with an agent trailer", 80, 112, 48, { cls: "b acc", ld: 200 }));
      } else {
        const cx = [510, 1090], base = 750;
        commits.forEach((c) => {
          const p = unit(c.wrank, 60, 6, cx[c.win], base);
          marks.push(sq(c.k, p.x, p.y, 2.5, c.as ? ACC : LIGHT, c.as ? 1 : 0.8,
            { d: (c.wrank / cur) * 600 + c.win * 150, dur: 800, from: { x: p.x, y: base, r: 2 } }));
        });
        const top = (n) => base - Math.ceil(n / 60) * 6;
        labels.push(lab("h", "commits with agent trailer", 80, 36, 48, { cls: "b acc", ld: 300 }));
        labels.push(lab("p0", pct(G.assisted_share_previous), cx[0], top(prev) - 175, 160, { cls: "c b acc", ld: 900 }));
        labels.push(lab("p1", pct(G.assisted_share_current), cx[1], top(cur) - 175, 160, { cls: "c b acc", ld: 1100 }));
        labels.push(lab("n0", "<b>" + fmt(prev) + "</b>", cx[0], 762, 48, { cls: "c", ld: 700 }));
        labels.push(lab("n1", "<b>" + fmt(cur) + "</b>", cx[1], 762, 48, { cls: "c", ld: 700 }));
        labels.push(lab("x", "×" + G.commit_change_all.factor, 800, 762, 48, { cls: "c dim", ld: 1100 }));
        labels.push(lab("w0", windowLabel(months[0].month, months[11].month), cx[0], 822, 32, { cls: "c dim", ld: 700 }));
        labels.push(lab("w1", windowLabel(months[12].month, months[23].month), cx[1], 822, 32, { cls: "c dim", ld: 700 }));
      }
      return { marks, labels };
    },

    // 9. the same commits by repository type, year before next to last 12 months
    types(step) {
      const marks = [], base = 690;
      const x0 = (gi) => 100 + gi * 245;
      commits.forEach((c) => {
        const x = x0(c.gi) + c.win * 96 + (c.trank % 16) * 5 + 2.5, row = Math.floor(c.trank / 16), y = base - 2.5 - row * 5;
        marks.push(sq(c.k, x, y, 2, c.as ? ACC : LIGHT, c.as ? 1 : 0.8, { d: c.gi * 70 + row * 3, dur: 800, from: { x, y: base, r: 2 } }));
      });
      const labels = [lab("h", "commits by type: year before, last 12 months", 80, 36, 44, { cls: "b", ld: 200 })];
      typeGroups.forEach((g, gi) => {
        labels.push(lab("tn" + gi, g.name, x0(gi), 702, 30, { cls: "b", ld: 500 + gi * 70 }));
        labels.push(lab("tc" + gi, fmt(g.previous) + " → " + fmt(g.current), x0(gi), 744, 30, { cls: "dim", ld: 500 + gi * 70 }));
        if (step >= 1) {
          const big = gi < 2, top = base - Math.ceil(g.current / 16) * 5;
          labels.push(lab("ts" + gi, pct(g.share) + (gi === 0 ? " agent" : ""), x0(gi) + 96, top - (big ? 74 : 46), big ? 60 : 34, { cls: "b acc", ld: 200 + gi * 90 }));
        }
      });
      if (step >= 1) labels.push(lab("q", "Commits measure activity. They say nothing about research quality.", 80, 812, 40, { ld: 900 }));
      return { marks, labels };
    },

    // 10. guluswm: files in, 50 questions, answered, released
    gulu(step) {
      const marks = [], links = [], labels = [];
      const nDays = GU.days_to_release + 1, dx = 1100 / (nDays - 1), X = (d) => 250 + d * dx, ty = 600;
      for (let d = 0; d < nDays; d++) {
        marks.push(dot("d" + d, X(d), ty, 9, LIGHT, 0.9, { d: d * 60 }));
        if (d) links.push(["d" + (d - 1), "d" + d, 0.5, LIGHT]);
      }
      labels.push(lab("d0", dayMonth(GU.files_received), X(0), 626, 40, { cls: "c b", ld: 200 }));
      labels.push(lab("f", "files", X(0), 390, 36, { cls: "c dim", ld: 300 }));
      // the files are one square; on release it travels to the last day and becomes the package
      if (step < 3) marks.push(sq("f0", X(0), 480, 30, LIGHT, 0.95));
      else {
        marks.push(sq("f0", X(nDays - 1), 450, 80, ACC, 1));
        marks.push(sq("g0", X(0), 480, 30, LIGHT, 0.7, { ring: 1, lw: 3 }));
      }
      if (step >= 1) {
        const qcx = (X(0) + X(GU.days_until_answered)) / 2 + 30;
        for (let i = 0; i < GU.questions_to_authors; i++) {
          const p = grid(i, 10, 5, 42, qcx, 450);
          marks.push(dot("q" + i, p.x, p.y, 14, step >= 2 ? ACC : LIGHT, step >= 2 ? 1 : 0.9,
            { d: i * 16, from: { x: X(0), y: 480, r: 3 } }));
        }
        labels.push(lab("q", "<b>" + GU.questions_to_authors + "</b> questions", qcx - 205, 290, 40, { ld: 500 }));
        if (step >= 2) labels.push(lab("a", "<b>" + GU.days_until_answered + "</b> days", qcx + 205, 290, 40, { cls: "r acc", ld: 700 }));
      }
      if (step >= 3) {
        labels.push(lab("d1", dayMonth(GU.released), X(nDays - 1), 626, 40, { cls: "c b", ld: 600 }));
        labels.push(lab("pk", GU.package, X(nDays - 1), 270, 60, { cls: "c b acc", ld: 600 }));
        labels.push(lab("doi", GU.doi, 1520, 720, 34, { cls: "r", ld: 900 }));
      }
      return { marks, links, labels };
    },

    // 11. the trade-off: one dot alone, then it goes out
    tradeoff(step) {
      const st = T.steward;
      const labels = [lab("one", "<b>" + st.persons + "</b> person. <b>" + st.hours_per_week + "</b> hours a week.", 800, 590, 64, { cls: "c", ld: 400 })];
      const marks = [];
      if (step === 0) marks.push(dot("S", 800, 390, 60, ACC, 1));
      else {
        marks.push(dot("Sg", 800, 390, 60, ACC, 0.95, { ring: 1, lw: 5, dash: 1 }));
        labels.push(lab("spof", "A single point of failure.", 800, 690, 64, { cls: "c b acc", ld: 300 }));
      }
      return { marks, labels };
    },

    // 12. the key again, then the question
    close(step) {
      const labels = step === 0
        ? [lab("key", "Put a <span class='acc'>data steward</span> inside the research group.", 800, 640, 64, { cls: "c b", ld: 300 })]
        : [lab("ask", "What would you measure to show<br>what stewardship changes?", 800, 600, 76, { cls: "c b", ld: 300 })];
      return { marks: ringMarks(800, 300, 190, 12, P.written, 30), labels };
    },

    // 13. the four authors as four dots
    end() {
      const n = T.talk.authors.split(", ").length, marks = [];
      for (let i = 0; i < n; i++) marks.push(dot(i === 0 ? "S" : "p" + (i - 1), 136, 323 + i * 66, 14, i === 0 ? ACC : LIGHT, 1, { d: i * 60 }));
      return { marks, labels: [] };
    },
  };
  /* ---------- drawing ---------- */

  function paint(ctx, list, links, get) {
    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = "round";
    if (links) {
      for (const l of links) {
        const a = get(l[0]), b = get(l[1]);
        if (!a || !b) continue;
        const al = l[2] * Math.min(a.a, b.a);
        if (al < 0.01) continue;
        ctx.strokeStyle = "rgba(" + l[3][0] + "," + l[3][1] + "," + l[3][2] + "," + al.toFixed(3) + ")";
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
    for (const m of list) {
      if (m.a < 0.01 || m.r < 0.2) continue;
      const c = m.c, style = "rgba(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + "," + m.a.toFixed(3) + ")";
      if (m.ring) {
        ctx.strokeStyle = style; ctx.lineWidth = m.lw || 4;
        ctx.setLineDash(m.dash ? [10, 12] : []);
        ctx.beginPath();
        if (m.sh === "s") ctx.rect(m.x - m.r, m.y - m.r, 2 * m.r, 2 * m.r); else ctx.arc(m.x, m.y, m.r, 0, 6.2832);
        ctx.stroke(); ctx.setLineDash([]);
      } else {
        ctx.fillStyle = style;
        if (m.sh === "s") ctx.fillRect(m.x - m.r, m.y - m.r, 2 * m.r, 2 * m.r);
        else { ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 6.2832); ctx.fill(); }
      }
    }
  }
  function makeCanvas() {
    const c = document.createElement("canvas");
    c.width = W * 2; c.height = H * 2; c.className = "dots";
    c.setAttribute("aria-hidden", "true");
    c.getContext("2d").setTransform(2, 0, 0, 2, 0, 0);
    return c;
  }
  const still = (s) => ({ x: s.x, y: s.y, r: s.r, a: s.a, c: s.col, sh: s.sh, ring: s.ring, lw: s.lw, dash: s.dash, k: s.k });

  /* ---------- the moving layer ---------- */

  const marks = new Map();
  let links = [], timer = null, ctx = null;
  const ease = d3.easeCubicInOut;

  function apply(sc, animate) {
    const now = performance.now(), seen = new Set();
    for (const s of sc.marks) {
      seen.add(s.k);
      let m = marks.get(s.k);
      if (!m) {
        const f = s.from || s;
        m = { k: s.k, x: f.x, y: f.y, r: s.from ? (f.r == null ? s.r : f.r) : 0, a: 0, c: s.col.slice() };
        marks.set(s.k, m);
      }
      m.sh = s.sh; m.ring = s.ring || 0; m.lw = s.lw; m.dash = s.dash; m.dying = false;
      m.s = { x: m.x, y: m.y, r: m.r, a: m.a, c: m.c.slice() };
      m.t = { x: s.x, y: s.y, r: s.r, a: s.a, c: s.col };
      m.t0 = now + (s.d || 0); m.dur = s.dur || DUR;
    }
    for (const m of marks.values()) {
      if (seen.has(m.k) || m.dying) continue;
      m.dying = true;
      m.s = { x: m.x, y: m.y, r: m.r, a: m.a, c: m.c.slice() };
      m.t = { x: m.x, y: m.y, r: m.r * 0.3, a: 0, c: m.c };
      m.t0 = now; m.dur = 450;
    }
    links = sc.links || [];
    if (!animate) {
      for (const m of [...marks.values()]) {
        if (m.dying) { marks.delete(m.k); continue; }
        m.x = m.t.x; m.y = m.t.y; m.r = m.t.r; m.a = m.t.a; m.c = m.t.c.slice();
      }
      if (timer) { timer.stop(); timer = null; }
      paint(ctx, marks.values(), links, (k) => marks.get(k));
      return;
    }
    if (!timer) timer = d3.timer(tick);
  }
  function tick() {
    const now = performance.now();
    let busy = false;
    for (const m of marks.values()) {
      let p = (now - m.t0) / m.dur;
      if (p < 1) busy = true;
      if (p <= 0) continue;
      if (p >= 1) {
        if (m.dying) { marks.delete(m.k); continue; }
        p = 1;
      }
      const e = ease(p), s = m.s, t = m.t;
      m.x = s.x + (t.x - s.x) * e; m.y = s.y + (t.y - s.y) * e;
      m.r = s.r + (t.r - s.r) * e; m.a = s.a + (t.a - s.a) * e;
      m.c[0] = s.c[0] + (t.c[0] - s.c[0]) * e; m.c[1] = s.c[1] + (t.c[1] - s.c[1]) * e; m.c[2] = s.c[2] + (t.c[2] - s.c[2]) * e;
    }
    paint(ctx, marks.values(), links, (k) => marks.get(k));
    if (!busy && timer) { timer.stop(); timer = null; }
  }

  /* ---------- labels ---------- */

  function renderLabels(layer, specs, animate) {
    if (!layer) return;
    const have = new Map();
    [...layer.children].forEach((el) => { if (el.classList.contains("out")) el.remove(); else have.set(el.dataset.k, el); });
    specs.forEach((s) => {
      let el = have.get(s.k);
      const fresh = !el;
      if (fresh) { el = document.createElement("div"); el.dataset.k = s.k; layer.appendChild(el); }
      have.delete(s.k);
      el.className = "lab " + (s.cls || "");
      el.innerHTML = s.html;
      el.style.left = s.x + "px"; el.style.top = s.y + "px"; el.style.fontSize = s.fs + "px";
      if (fresh && animate) {
        el.style.transition = "none"; el.style.opacity = 0;
        void el.offsetWidth;
        el.style.transition = ""; el.style.transitionDelay = (s.ld == null ? 500 : s.ld) + "ms";
        el.style.opacity = 1;
      } else { el.style.transitionDelay = "0ms"; el.style.opacity = 1; }
    });
    have.forEach((el) => {
      if (!animate) { el.remove(); return; }
      el.classList.add("out"); el.style.transitionDelay = "0ms"; el.style.opacity = 0;
      setTimeout(() => { if (el.classList.contains("out")) el.remove(); }, 450);
    });
  }

  /* ---------- the opening number ---------- */

  const numEl = document.getElementById("num");
  const numText = (v) => fmt2(v);
  let countRaf = 0;
  function countUp() {
    cancelAnimationFrame(countRaf);
    numEl.classList.remove("pulse");
    const t0 = performance.now(), dur = 1700;
    (function frame(now) {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      numEl.textContent = numText(P.amount_chf * e);
      if (p < 1) countRaf = requestAnimationFrame(frame);
      else { numEl.textContent = numText(P.amount_chf); void numEl.offsetWidth; numEl.classList.add("pulse"); }
    })(t0);
  }

  /* ---------- text that comes from the data file ---------- */

  function fillText() {
    numEl.textContent = numText(P.amount_chf);
    const authors = T.talk.authors.split(", ");
    const put = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
    put("end-title", T.talk.title);
    put("end-authors", authors.map((a) => "<div>" + a + "</div>").join(""));
    put("end-aff", T.talk.affiliation + "<br>" + T.talk.event);
    put("end-workshop", T.talk.workshop);
    put("end-package", T.talk.package_url.replace("https://", ""));
    put("end-slides", T.talk.slides_repo.replace("https://", ""));
  }

  /* ---------- wiring ---------- */

  function sceneOf(section, step) {
    const f = scenes[section.dataset.scene];
    return f ? f(step) : { marks: [], labels: [] };
  }

  fillText();

  if (isPrint) {
    // one static canvas per slide with the final state of that slide
    document.querySelectorAll(".reveal .slides section[data-scene]").forEach((sec) => {
      const sc = sceneOf(sec, sec.querySelectorAll(".fragment").length);
      const c = makeCanvas();
      sec.insertBefore(c, sec.firstChild);
      const list = sc.marks.map(still), byKey = new Map(list.map((m) => [m.k, m]));
      paint(c.getContext("2d"), list, sc.links, (k) => byKey.get(k));
      renderLabels(sec.querySelector(".labels"), sc.labels || [], false);
    });
    return;
  }

  let lastSlide = null;
  function update(animate) {
    const sec = Reveal.getCurrentSlide();
    if (!sec) return;
    const step = sec.querySelectorAll(".fragment.visible").length;
    const move = animate && !reduce;
    const sc = sceneOf(sec, step);
    apply(sc, move);
    const layer = sec.querySelector(".labels");
    if (layer && sec !== lastSlide) layer.innerHTML = "";
    renderLabels(layer, sc.labels || [], move);
    if (sec !== lastSlide && sec.dataset.scene === "number") {
      if (move && step === 0) countUp();
      else { cancelAnimationFrame(countRaf); numEl.textContent = numText(P.amount_chf); }
    }
    lastSlide = sec;
  }
  function start() {
    const c = makeCanvas();
    const slides = document.querySelector(".reveal .slides");
    slides.insertBefore(c, slides.firstChild);
    ctx = c.getContext("2d");
    update(false);
    if (!reduce && Reveal.getCurrentSlide().dataset.scene === "number" &&
      Reveal.getCurrentSlide().querySelectorAll(".fragment.visible").length === 0) countUp();
    Reveal.on("slidechanged", () => update(true));
    Reveal.on("fragmentshown", () => update(true));
    Reveal.on("fragmenthidden", () => update(true));
  }
  function boot() {
    if (typeof Reveal === "undefined") return setTimeout(boot, 50);
    if (Reveal.isReady && Reveal.isReady()) start(); else Reveal.on("ready", start);
  }
  if (document.readyState === "complete") boot(); else window.addEventListener("load", boot);
})();
