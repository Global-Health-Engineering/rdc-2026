// "Ledger". All figures are drawn here from window.TALK.
// Pattern: every scene has draw(on). draw(false) builds the final state (used at
// parse time, for print, for reduced motion and when a slide is entered backwards).
// draw(true) builds the same state and animates towards it, in at most 1.5 s.
// Motion only where data appears. Text cuts in. Everything the speaker talks over
// arrives on a click (a fragment with data-act).
(function () {
  "use strict";
  var D = window.TALK, gh = D.github;
  var PRINT = /print-pdf/.test(location.search);
  var REDUCED = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var STILL = PRINT || REDUCED;
  if (PRINT) {
    document.documentElement.classList.add("is-print");
  }

  var C = { ink: "#1A1714", paper: "#F6F1E7", accent: "#901C6C" };
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var fInt = d3.format(",");
  function parts(s) { var p = s.split("-"); return { y: +p[0], m: +p[1], d: +p[2] }; }
  function fDate(s) { var p = parts(s); return p.d + " " + MONTHS[p.m - 1] + " " + p.y; }
  function fDay(s) { var p = parts(s); return p.d + " " + MONTHS[p.m - 1].slice(0, 3); }
  function addDays(s, n) {
    var p = parts(s), t = new Date(Date.UTC(p.y, p.m - 1, p.d + n));
    return t.getUTCFullYear() + "-" + (t.getUTCMonth() + 1) + "-" + t.getUTCDate();
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  var F = {
    int: function (v) { return fInt(v); },
    chf: function (v) { return d3.format(",.0f")(v); },
    date: fDate,
    url: function (v) { return ("" + v).replace(/^https?:\/\//, ""); },
    raw: function (v) { return "" + v; }
  };
  function get(path) { return path.split(".").reduce(function (o, k) { return o[k]; }, D); }
  document.querySelectorAll("[data-v]").forEach(function (el) {
    el.textContent = F[el.dataset.f || "int"](get(el.dataset.v));
  });

  // ---------- helpers ----------
  function tr(sel, on, delay, dur, ease) {
    return on ? sel.transition().delay(delay || 0).duration(dur || 500).ease(ease || d3.easeCubicOut) : sel;
  }
  function typeIn(el, on, s, delay, per, done) {
    var full = el.dataset.full || (el.dataset.full = el.textContent);
    el.textContent = full;
    el.classList.remove("typing");
    if (!on) return;
    el.textContent = "​";
    el.classList.add("typing");
    for (var i = 1; i <= full.length; i++) (function (k) {
      s.after(delay + k * per, function () {
        el.textContent = full.slice(0, k);
        if (k === full.length) {
          s.after(200, function () { el.classList.remove("typing"); });
          if (done) done();
        }
      });
    })(i);
  }
  function wrap(label, max) {
    var words = label.split(" "), lines = [""];
    words.forEach(function (w) {
      var cur = lines[lines.length - 1];
      if (cur && (cur + " " + w).length > max) lines.push(w); else lines[lines.length - 1] = cur ? cur + " " + w : w;
    });
    return lines;
  }

  // ---------- scenes ----------
  var scenes = {};
  function scene(id, def) {
    var sec = document.getElementById(id);
    if (!sec) return;
    var s = { id: id, sec: sec, timers: [], draw: def.draw, frag: def.frag || function () {} };
    s.after = function (ms, fn) { s.timers.push(d3.timeout(fn, ms)); };
    s.clear = function () { s.timers.forEach(function (t) { t.stop(); }); s.timers = []; };
    scenes[id] = s;
  }
  function run(id, on) {
    var s = scenes[id];
    if (!s) return;
    s.clear();
    s.draw(on, s);
    s.sec.querySelectorAll(".fragment[data-act]").forEach(function (f) {
      var shown = PRINT || f.classList.contains("visible");
      s.frag(f.dataset.act, shown, on && shown, s);
    });
  }

  // The number: typed in paper on an ink field, then one cut to paper
  scene("s-number", {
    draw: function (on, s) {
      var sec = s.sec, stage = sec.querySelector(".stage"), num = sec.querySelector("#n-amount"), uw = sec.querySelector(".bignum .uw");
      function dark(d) {
        stage.classList.toggle("dark", d);
        try {
          var bg = window.Reveal && Reveal.getSlideBackground ? Reveal.getSlideBackground(sec) : null;
          if (bg) bg.style.backgroundColor = d ? C.ink : "";
        } catch (e) { /* the stage itself carries the colour */ }
      }
      fitNumber();
      dark(false);
      uw.classList.remove("pre");
      typeIn(num, on, s, 100, 60, function () {
        s.after(140, function () { dark(false); void uw.offsetWidth; uw.classList.remove("pre"); });
      });
      if (on) { dark(true); uw.classList.add("pre"); }
      // the tally of proposals: one square each
      var P = D.proposals, n = P.written, size = Math.min(36, Math.floor(1440 / n) - 2), pitch = (1440 - size) / (n - 1), sw = size > 24 ? 4 : 3;
      var svg = d3.select("#c-tally");
      svg.selectAll("*").remove();
      svg.selectAll("rect").data(d3.range(n)).join("rect")
        .attr("x", function (i) { return i * pitch + sw / 2; }).attr("y", 12).attr("width", size - sw).attr("height", size - sw)
        .attr("stroke-width", sw).attr("stroke", "currentColor").attr("fill", "none");
    },
    frag: function (act, shown, on) {
      var P = D.proposals, n = P.written;
      var r = d3.select("#c-tally").selectAll("rect");
      if (act === "written") {
        r.interrupt("w").attr("opacity", 1);
        if (shown && on) r.attr("opacity", 0).transition("w").delay(function (i) { return i * Math.min(22, 700 / n); }).duration(100).attr("opacity", 1);
      }
      if (act === "funded") {
        var f = r.filter(function (i) { return i >= n - P.funded; });
        f.interrupt("f").attr("stroke", shown ? C.accent : "currentColor").attr("fill", shown ? C.accent : "none");
        if (shown && on) {
          f.attr("stroke", "currentColor").attr("fill", "none")
            .transition("f").delay(function (i) { return 800 + (i - (n - P.funded)) * Math.min(140, 500 / P.funded); }).duration(200)
            .attr("stroke", C.accent).attr("fill", C.accent);
        }
      }
    }
  });
  function fitNumber() {
    // Set the number across the full column, like a front page headline.
    var num = document.getElementById("n-amount"), box = num && num.closest(".bignum");
    if (!box) return;
    try {
      if (!document.fonts.check('800 200px "Atkinson Hyperlegible Next"')) return;
      var ctx = document.createElement("canvas").getContext("2d");
      ctx.font = '800 200px "Atkinson Hyperlegible Next"';
      var w = ctx.measureText(num.dataset.full || num.textContent).width;
      if (w > 0) box.style.fontSize = Math.floor(200 * 1440 / w * 0.998) + "px";
    } catch (e) { /* keep the size from the stylesheet */ }
  }
  if (document.fonts && document.fonts.load) {
    document.fonts.load('800 200px "Atkinson Hyperlegible Next"').then(fitNumber);
    document.fonts.ready.then(fitNumber);
  }

  // The story: the first state is the true one, one click swaps the two words
  scene("s-who", {
    draw: function () {},
    frag: function (act, shown, on, s) {
      // swapped only between the first and the second click; the last line and the PDF show the true state
      var sw = s.sec.querySelector('.fragment[data-act="swap"]'), ln = s.sec.querySelector('.fragment[data-act="line"]');
      s.sec.querySelector(".story").classList.toggle("swapped", !PRINT && sw.classList.contains("visible") && !ln.classList.contains("visible"));
    }
  });

  // The role figure: professor bar on top, linked to each block; the steward bar at
  // the bottom rises beside each block. One square is one thesis, project or position.
  function roleFigure(id, on) {
    var svg = d3.select(id);
    svg.selectAll("*").remove();
    var XL = 60, XR = 1540, P = 46, SQ = 38, ROWS = 8, BAR = 52, VB = 14, LASTW = 240;
    var YP = 156, YB = YP + BAR + 62, YE = YB + ROWS * P - (P - SQ), YS = YE + 112;
    var groups = D.people.by_group.map(function (g, i, a) {
      var cols = Math.ceil(g.n / ROWS), w = VB + 12 + cols * P - (P - SQ);
      return { g: g, cols: cols, w: i === a.length - 1 ? Math.max(w, LASTW) : w };
    });
    var gap = (XR - XL - d3.sum(groups, function (o) { return o.w; })) / (groups.length - 1), x = XL, idx = 0, sq = [];
    groups.forEach(function (o) {
      o.x = x;
      for (var k = 0; k < o.g.n; k++) sq.push({ i: idx++, x: x + VB + 12 + (k % o.cols) * P, y: YB + Math.floor(k / o.cols) * P });
      x += o.w + gap;
    });

    svg.append("text").attr("class", "t40 b").attr("x", XL).attr("y", YP - 16).text("Professor");
    svg.append("rect").attr("x", XL).attr("y", YP).attr("width", XR - XL).attr("height", BAR).attr("fill", C.ink);
    groups.forEach(function (o) {
      // the professor reaches each block directly
      svg.append("rect").attr("x", o.x + VB + 12 + SQ / 2 - 3).attr("y", YP + BAR).attr("width", 6).attr("height", YB - YP - BAR - 8).attr("fill", C.ink);
      wrap(o.g.group, 16).forEach(function (ln, k) {
        svg.append("text").attr("class", "t28").attr("x", o.x + VB + 12).attr("y", YE + 40 + k * 32).text(ln);
      });
    });
    var st = svg.append("g").attr("class", "steward");
    st.selectAll("rect.vb").data(groups).join("rect").attr("class", "vb")
      .attr("x", function (o) { return o.x; }).attr("y", YB).attr("width", VB).attr("height", YS - YB).attr("fill", C.accent);
    st.append("rect").attr("class", "band").attr("x", XL + 3).attr("y", YS + 3).attr("width", XR - XL - 6).attr("height", BAR - 6)
      .attr("fill", C.accent).attr("stroke", C.accent).attr("stroke-width", 6);
    svg.append("text").attr("class", "t40 b").attr("x", XL).attr("y", YS + BAR + 48).text("Data steward");

    var r = svg.append("g").selectAll("rect").data(sq).join("rect")
      .attr("x", function (d) { return d.x; }).attr("y", function (d) { return d.y; }).attr("width", SQ).attr("height", SQ).attr("fill", C.ink);
    if (on) r.attr("opacity", 0);
    tr(r, on, function (d) { return 100 + d.i * 4; }, 150).attr("opacity", 1);
  }
  // Students by degree and start year: three columns a year, each labelled.
  scene("s-role", {
    draw: function (on) {
      var svg = d3.select("#c-role");
      svg.selectAll("*").remove();
      var rows = D.people.students_by_degree_year;
      var years = Array.from(new Set(rows.map(function (d) { return d.year; }))).sort();
      var DEG = [{ k: "bsc", label: "BSc", fill: C.ink }, { k: "msc", label: "MSc", fill: C.accent }, { k: "phd", label: "PhD", fill: "#1E8B99" }];
      var X0 = 60, X1 = 1540, BASE = 720, H = 540, GW = (X1 - X0) / years.length, BW = 66, GAP = 8;
      var y = d3.scaleLinear().domain([0, d3.max(rows, function (d) { return d.n; })]).range([0, H]);
      var lastYear = years[years.length - 1], snap = +D.snapshot_date.slice(0, 4);
      svg.append("line").attr("x1", X0).attr("x2", X1).attr("y1", BASE).attr("y2", BASE).attr("stroke", C.ink).attr("stroke-width", 2);
      // the PhD columns were read as students supervised by doctoral students
      svg.append("text").attr("class", "t32").attr("x", X0).attr("y", 150).text("PhD: doctorates started in that year");
      var bars = [];
      years.forEach(function (yr, yi) {
        var gx = X0 + yi * GW + (GW - (3 * BW + 2 * GAP)) / 2;
        DEG.forEach(function (g, gi) {
          var d = rows.filter(function (r) { return r.year === yr && r.degree === g.k; })[0];
          bars.push({ i: yi * 3 + gi, x: gx + gi * (BW + GAP), n: d ? d.n : 0, g: g });
        });
        svg.append("text").attr("class", "t40 b tn").attr("x", gx + (3 * BW + 2 * GAP) / 2).attr("y", BASE + 110).attr("text-anchor", "middle")
          .text(yr === lastYear && yr === snap ? yr + " so far" : yr);
      });
      var r = svg.append("g").selectAll("rect").data(bars).join("rect")
        .attr("x", function (d) { return d.x; }).attr("width", BW).attr("fill", function (d) { return d.g.fill; })
        .attr("y", function (d) { return BASE - y(d.n); }).attr("height", function (d) { return y(d.n); });
      if (on) r.attr("y", BASE).attr("height", 0);
      tr(r, on, function (d) { return 100 + d.i * 30; }, 500)
        .attr("y", function (d) { return BASE - y(d.n); }).attr("height", function (d) { return y(d.n); });
      svg.append("g").selectAll("text").data(bars).join("text").attr("class", "t28")
        .attr("x", function (d) { return d.x + BW / 2; }).attr("y", BASE + 40).attr("text-anchor", "middle").text(function (d) { return d.g.label; });
      var v = svg.append("g").selectAll("text").data(bars).join("text").attr("class", "t32 b tn")
        .attr("x", function (d) { return d.x + BW / 2; }).attr("y", function (d) { return BASE - y(d.n) - 12; }).attr("text-anchor", "middle")
        .text(function (d) { return fInt(d.n); });
      if (on) v.attr("opacity", 0);
      tr(v, on, function (d) { return 500 + d.i * 30; }, 200).attr("opacity", 1);
    }
  });

  // ghedata: repositories by type, the six largest and the rest
  scene("s-repos", {
    draw: function (on) {
      var svg = d3.select("#c-repos");
      svg.selectAll("*").remove();
      var all = gh.repositories_by_type.slice().sort(function (a, b) { return b.total - a.total; });
      var data = all.slice(0, 6).map(function (d) { return { label: cap(d.repository_type), total: d.total }; });
      data.push({ label: "Other", total: d3.sum(all.slice(6), function (d) { return d.total; }) });
      var X0 = 440, W = 1000, Y0 = 122, P = 108, BH = 70;
      var x = d3.scaleLinear().domain([0, d3.max(data, function (d) { return d.total; })]).range([0, W]);
      var rows = svg.selectAll("g.r").data(data).join("g").attr("class", "r")
        .attr("transform", function (d, i) { return "translate(0," + (Y0 + i * P) + ")"; });
      rows.append("text").attr("class", "t36")
        .attr("x", X0 - 24).attr("y", BH / 2).attr("dy", "0.35em").attr("text-anchor", "end").text(function (d) { return d.label; });
      var bars = rows.append("rect").attr("x", X0).attr("height", BH)
        .attr("fill", function (d, i) { return i === 0 ? C.accent : C.ink; })
        .attr("width", function (d) { return x(d.total); });
      if (on) bars.attr("width", 0);
      tr(bars, on, function (d, i) { return 100 + i * 60; }, 600).attr("width", function (d) { return x(d.total); });
      var vals = rows.append("text").attr("class", "t36 b tn")
        .attr("x", function (d) { return X0 + x(d.total) + 16; }).attr("y", BH / 2).attr("dy", "0.35em").text(function (d) { return fInt(d.total); });
      if (on) vals.attr("opacity", 0);
      tr(vals, on, function (d, i) { return 600 + i * 60; }, 200).attr("opacity", 1);
    }
  });

  // Commits per month by group members since 2021. On the click the part made with an agent.
  scene("s-share", {
    draw: function (on) {
      var svg = d3.select("#c-share");
      svg.selectAll("*").remove();
      var data = gh.commits_per_month, n = data.length;
      var X0 = 60, X1 = 1540, STEP = (X1 - X0) / n, BW = STEP - 2.5, BASE = 808, H = 650;
      var y = d3.scaleLinear().domain([0, d3.max(data, function (d) { return d.commits; })]).range([0, H]);
      function xi(i) { return X0 + i * STEP + 1; }

      // one gridline, labelled
      svg.append("line").attr("x1", X0).attr("x2", X1).attr("y1", BASE - y(400)).attr("y2", BASE - y(400)).attr("stroke", C.ink).attr("stroke-width", 2).attr("stroke-dasharray", "2 8");
      svg.append("text").attr("class", "t32 tn").attr("x", X0).attr("y", BASE - y(400) - 14).text(fInt(400) + " commits a month");
      // columns: commits by group members in ink
      var tot = svg.append("g").selectAll("rect").data(data).join("rect")
        .attr("x", function (d, i) { return xi(i); }).attr("width", BW).attr("fill", C.ink)
        .attr("y", function (d) { return BASE - y(d.commits); }).attr("height", function (d) { return y(d.commits); });
      if (on) tot.attr("y", BASE).attr("height", 0);
      tr(tot, on, function (d, i) { return i * 12; }, 500)
        .attr("y", function (d) { return BASE - y(d.commits); }).attr("height", function (d) { return y(d.commits); });
      // the part made with an agent, in purple, on the click
      var ag = svg.append("g").attr("class", "agent");
      ag.selectAll("rect").data(data).join("rect")
        .attr("x", function (d, i) { return xi(i); }).attr("width", BW).attr("fill", C.accent)
        .attr("y", function (d) { return BASE - y(d.assisted); }).attr("height", function (d) { return y(d.assisted); });
      svg.append("line").attr("x1", X0).attr("x2", X1).attr("y1", BASE).attr("y2", BASE).attr("stroke", C.ink).attr("stroke-width", 2);
      // years
      data.forEach(function (d, i) {
        if (d.month.slice(5) !== "01") return;
        svg.append("line").attr("x1", xi(i) - 1).attr("x2", xi(i) - 1).attr("y1", BASE).attr("y2", BASE + 14).attr("stroke", C.ink).attr("stroke-width", 2);
        svg.append("text").attr("class", "t32 tn").attr("x", xi(i) + 6).attr("y", BASE + 46).text(d.month.slice(0, 4));
      });
      // direct labels inside the plot, beside the tallest column, in place of a legend
      var k = d3.maxIndex(data, function (d) { return d.commits; }), top = data[k], lx = xi(k);
      var yInk = BASE - y((top.commits + top.assisted) / 2), yAg = BASE - y(top.assisted * 0.82);
      svg.append("line").attr("x1", lx - 28).attr("x2", lx - 4).attr("y1", yInk).attr("y2", yInk).attr("stroke", C.ink).attr("stroke-width", 2);
      svg.append("text").attr("class", "t32").attr("x", lx - 38).attr("y", yInk).attr("dy", "0.35em").attr("text-anchor", "end").text("by group members");
      ag.append("line").attr("x1", lx - 28).attr("x2", lx - 4).attr("y1", yAg).attr("y2", yAg).attr("stroke", C.ink).attr("stroke-width", 2);
      ag.append("text").attr("class", "t32 b").attr("x", lx - 38).attr("y", yAg).attr("dy", "0.35em").attr("text-anchor", "end").text("with an agent");
    },
    frag: function (act, shown, on) {
      if (act !== "agent") return;
      var ag = d3.select("#c-share").select(".agent"), r = ag.selectAll("rect");
      ag.attr("opacity", shown ? 1 : 0);
      r.interrupt();
      if (shown && on) {
        r.each(function () { var e = d3.select(this); e.attr("data-y", e.attr("y")).attr("data-h", e.attr("height")); })
          .attr("y", function () { return +this.getAttribute("data-y") + +this.getAttribute("data-h"); }).attr("height", 0)
          .transition().delay(function (d, i) { return Math.max(0, i - 36) * 14; }).duration(500).ease(d3.easeCubicOut)
          .attr("y", function () { return this.getAttribute("data-y"); }).attr("height", function () { return this.getAttribute("data-h"); });
      }
    }
  });

  // Commits by repository type, the last twelve months; the thin bar is the year before
  scene("s-types", {
    draw: function (on) {
      var svg = d3.select("#c-types");
      svg.selectAll("*").remove();
      var data = gh.commits_by_type_two_windows
        .filter(function (d) { return d.repository_type !== "learner repository"; })
        .sort(function (a, b) { return b.current - a.current; }).slice(0, 6);
      var X0 = 440, W = 960, Y0 = 118, P = 127, LANE = 30, TH = 12, BH = 58;
      var x = d3.scaleLinear().domain([0, d3.max(data, function (d) { return Math.max(d.current, d.previous); })]).range([0, W]);
      var rows = svg.selectAll("g.r").data(data).join("g").attr("class", "r")
        .attr("transform", function (d, i) { return "translate(0," + (Y0 + i * P) + ")"; });
      rows.append("text").attr("class", "t36").attr("x", X0 - 24).attr("y", LANE + BH / 2).attr("dy", "0.35em").attr("text-anchor", "end")
        .text(function (d) { return cap(d.repository_type); });
      var thin = rows.append("rect").attr("x", X0).attr("y", (LANE - TH) / 2).attr("height", TH).attr("fill", C.ink).attr("width", function (d) { return x(d.previous); });
      if (on) thin.attr("width", 0);
      tr(thin, on, 100, 350).attr("width", function (d) { return x(d.previous); });
      var bar = rows.append("rect").attr("x", X0).attr("y", LANE).attr("height", BH).attr("fill", C.ink).attr("width", function (d) { return x(d.current); });
      if (on) bar.attr("width", 0);
      tr(bar, on, 450, 400).attr("width", function (d) { return x(d.current); });
      var ag = rows.append("rect").attr("x", X0).attr("y", LANE).attr("height", BH).attr("fill", C.accent).attr("width", function (d) { return x(d.assisted_current); });
      if (on) ag.attr("width", 0);
      tr(ag, on, 850, 400).attr("width", function (d) { return x(d.assisted_current); });
      var val = rows.append("text").attr("class", "t36 b tn").attr("x", function (d) { return X0 + x(d.current) + 16; }).attr("y", LANE + BH / 2).attr("dy", "0.35em")
        .text(function (d) { return fInt(d.current); });
      if (on) val.attr("opacity", 0);
      tr(val, on, 850, 200).attr("opacity", 1);
      // each mark is labelled once, on the first row
      var d0 = data[0];
      svg.append("text").attr("class", "t28").attr("x", X0 + x(d0.previous) + 14).attr("y", Y0 + LANE / 2).attr("dy", "0.35em").text("the year before");
      svg.append("text").attr("class", "t28 b").attr("x", X0 + 4).attr("y", Y0 + LANE + BH + 30).text("with an agent");
    }
  });

  // Commits by group member, ranked. One column a person, the part with an agent in purple.
  // A dot under a column: the person took a workshop. An empty box: trained, no commit since.
  scene("s-persons", {
    draw: function (on) {
      var svg = d3.select("#c-persons");
      svg.selectAll("*").remove();
      var data = gh.commits_by_person, n = data.length;
      var X0 = 60, X1 = 1540, STEP = (X1 - X0) / n, BW = STEP - 6, BASE = 760, H = 580;
      var y = d3.scaleLinear().domain([0, data[0].commits]).range([0, H]);
      function xi(i) { return X0 + i * STEP + 3; }
      function hT(d) { return d.commits > 0 ? Math.max(3, y(d.commits)) : 0; }
      var tot = svg.append("g").selectAll("rect").data(data).join("rect")
        .attr("x", function (d, i) { return xi(i); }).attr("width", BW).attr("fill", C.ink)
        .attr("y", function (d) { return BASE - hT(d); }).attr("height", hT);
      var ag = svg.append("g").selectAll("rect").data(data).join("rect")
        .attr("x", function (d, i) { return xi(i); }).attr("width", BW).attr("fill", C.accent)
        .attr("y", function (d) { return BASE - y(d.assisted); }).attr("height", function (d) { return y(d.assisted); });
      // trained and no commit since: an empty box where the column would stand
      svg.append("g").selectAll("rect").data(data).join("rect")
        .filter(function (d) { return d.commits === 0; })
        .attr("x", function (d) { return xi(data.indexOf(d)) + 1.5; }).attr("width", BW - 3)
        .attr("y", BASE - BW - 6).attr("height", BW - 3)
        .attr("fill", "none").attr("stroke", C.ink).attr("stroke-width", 3);
      // took a workshop: a dot under the column
      svg.append("g").selectAll("circle").data(data).join("circle")
        .filter(function (d) { return d.workshop === "participant"; })
        .attr("cx", function (d) { return xi(data.indexOf(d)) + BW / 2; }).attr("cy", BASE + 30).attr("r", 10)
        .attr("fill", "#1E8B99");
      if (on) {
        tot.attr("y", BASE).attr("height", 0);
        ag.attr("y", BASE).attr("height", 0);
        tr(tot, on, function (d, i) { return i * 12; }, 500).attr("y", function (d) { return BASE - hT(d); }).attr("height", hT);
        tr(ag, on, function (d, i) { return 500 + i * 12; }, 500)
          .attr("y", function (d) { return BASE - y(d.assisted); }).attr("height", function (d) { return y(d.assisted); });
      }
      svg.append("line").attr("x1", X0).attr("x2", X1).attr("y1", BASE).attr("y2", BASE).attr("stroke", C.ink).attr("stroke-width", 2);
      // key of the dots and the boxes
      svg.append("circle").attr("cx", X0 + 12).attr("cy", BASE + 84).attr("r", 10).attr("fill", "#1E8B99");
      svg.append("text").attr("class", "t32").attr("x", X0 + 34).attr("y", BASE + 95).text("took a workshop");
      svg.append("rect").attr("x", X0 + 330).attr("y", BASE + 71).attr("width", 26).attr("height", 26).attr("fill", "none").attr("stroke", C.ink).attr("stroke-width", 3);
      svg.append("text").attr("class", "t32").attr("x", X0 + 370).attr("y", BASE + 95).text("no commit since");
      svg.append("text").attr("class", "t32").attr("x", X1).attr("y", BASE + 95).attr("text-anchor", "end").text(fInt(n) + " group members, ranked by commits");
      // direct labels beside the first column
      var d0 = data[0], lx = xi(0) + BW + 14;
      svg.append("text").attr("class", "t40 b tn").attr("x", lx).attr("y", BASE - y(d0.commits) + 34).text(fInt(d0.commits) + " commits");
      svg.append("text").attr("class", "t32 b").attr("x", lx).attr("y", BASE - y(d0.assisted) + 34).text("with an agent");
    }
  });

  // The result: guluswm. Files to DOI to scale; the manuscript is still to come.
  scene("s-gulu", {
    draw: function (on) {
      var svg = d3.select("#c-gulu");
      svg.selectAll("*").remove();
      var G = D.gulu, X0 = 110, X1 = 860, XM = 1490, Y = 500, days = G.days_to_release;
      svg.append("line").attr("x1", X0).attr("x2", X1).attr("y1", Y).attr("y2", Y).attr("stroke", C.ink).attr("stroke-width", 8);
      svg.append("line").attr("x1", X1 + 44).attr("x2", XM - 30).attr("y1", Y).attr("y2", Y).attr("stroke", C.ink).attr("stroke-width", 8).attr("stroke-dasharray", "4 20");
      svg.append("circle").attr("cx", X0).attr("cy", Y).attr("r", 24).attr("fill", C.ink);
      svg.append("circle").attr("cx", X1).attr("cy", Y).attr("r", 30).attr("fill", C.accent);
      svg.append("circle").attr("cx", XM).attr("cy", Y).attr("r", 21).attr("fill", C.paper).attr("stroke", C.ink).attr("stroke-width", 6);
      function head(x, anchor, t) { svg.append("text").attr("class", "b").style("font-size", "48px").attr("x", x).attr("y", Y - 110).attr("text-anchor", anchor).text(t); }
      function foot(x, anchor, t) { return svg.append("text").attr("class", "t40 tn").attr("x", x).attr("y", Y + 110).attr("text-anchor", anchor).text(t); }
      head(X0 - 24, "start", "Files received");
      head(X1, "middle", "Data with a DOI");
      head(XM + 24, "end", "Manuscript");
      foot(X0 - 24, "start", fDay(G.files_received));
      foot(X1, "middle", fDay(G.released));
      foot(XM + 24, "end", "not yet submitted");
      var dt = svg.append("text").attr("class", "t40 b").attr("x", (X0 + X1) / 2).attr("y", Y - 30).attr("text-anchor", "middle").text(fInt(days) + " days");
      if (on) dt.attr("opacity", 0);
      tr(dt, on, 500, 200).attr("opacity", 1);
    }
  });

  // ---------- parse time: every figure is drawn before anything else can fail ----------
  Object.keys(scenes).forEach(function (id) { run(id, false); });

  // ---------- wiring ----------
  var lastIndex = -1;
  function boot() {
    if (typeof Reveal === "undefined" || !Reveal.isReady || !Reveal.isReady()) { setTimeout(boot, 50); return; }
    function enter(ev) {
      var cur = Reveal.getCurrentSlide(), idx = Reveal.getIndices().h, back = idx < lastIndex;
      lastIndex = idx;
      var prev = ev && ev.previousSlide;
      if (prev && prev.id && prev !== cur) run(prev.id, false);
      if (cur && cur.id) run(cur.id, !STILL && !back);
    }
    function fr(ev, shown) {
      (ev.fragments || [ev.fragment]).forEach(function (f) {
        if (!f || !f.dataset.act) return;
        var sec = f.closest("section"), s = sec && scenes[sec.id];
        if (s) s.frag(f.dataset.act, shown, !STILL, s);
      });
    }
    Reveal.on("slidechanged", enter);
    Reveal.on("fragmentshown", function (ev) { fr(ev, true); });
    Reveal.on("fragmenthidden", function (ev) { fr(ev, false); });
    enter();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
