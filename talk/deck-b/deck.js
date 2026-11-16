// Deck B, "Ledger". All figures are drawn here from window.TALK.
// Pattern: every scene has draw(on). draw(false) builds the final state (used for
// print, for reduced motion and before a slide is entered). draw(true) builds the
// same state and animates towards it. Nothing needs more than next and previous.
(function () {
  "use strict";
  var D = window.TALK, gh = D.github;
  var PRINT = /print-pdf/.test(location.search);
  var REDUCED = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var STILL = PRINT || REDUCED;
  if (PRINT) document.documentElement.classList.add("is-print");

  var C = { ink: "#1A1714", paper: "#F6F1E7", orange: "#ED6D37", blue: "#0F4C81", grey: "#4A453E", mark: "#B9B0A0", faint: "#DDD5C5" };
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
    pct: function (v) { return Math.round(v * 100) + "%"; },
    x: function (v) { return "×" + (+v).toFixed(1); },
    chf: function (v) { return d3.format(",.2f")(v); },
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
    return on ? sel.transition().delay(delay || 0).duration(dur || 600).ease(ease || d3.easeCubicOut) : sel;
  }
  function fade(sel, on, delay, dur) {
    if (on) sel.attr("opacity", 0);
    return tr(sel, on, delay, dur || 400).attr("opacity", 1);
  }
  function drawLine(sel, on, delay, dur) {
    if (!on) return sel;
    sel.attr("pathLength", 1).attr("stroke-dasharray", 1).attr("stroke-dashoffset", 1);
    return tr(sel, on, delay, dur || 600, d3.easeCubicInOut).attr("stroke-dashoffset", 0);
  }
  function count(sel, on, delay, dur, to, fmt) {
    sel.text(fmt(to));
    if (!on) return;
    sel.text(fmt(0));
    sel.transition("count").delay(delay).duration(dur).ease(d3.easeCubicOut).tween("text", function () {
      var node = this, i = d3.interpolateNumber(0, to);
      return function (t) { node.textContent = fmt(i(t)); };
    });
  }
  function land(els, on, s, delay, step) {
    Array.prototype.forEach.call(els, function (el, i) {
      el.classList.remove("pre");
      if (!on) return;
      el.classList.add("pre");
      s.after((delay || 0) + i * (step || 160), function () { void el.offsetWidth; el.classList.remove("pre"); });
    });
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
          s.after(260, function () { el.classList.remove("typing"); });
          if (done) done();
        }
      });
    })(i);
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

  // 1 The number
  scene("s-number", {
    draw: function (on, s) {
      var sec = s.sec, num = sec.querySelector("#n-amount"), uw = sec.querySelector(".bignum .uw"), pulse = sec.querySelector(".pulse");
      fitNumber();
      pulse.classList.remove("go");
      uw.classList.remove("pre");
      typeIn(num, on, s, 350, 95, function () {
        s.after(180, function () { void uw.offsetWidth; uw.classList.remove("pre"); });
        s.after(260, function () { void pulse.offsetWidth; pulse.classList.add("go"); });
      });
      if (on) uw.classList.add("pre");
      // the tally of proposals, final state
      var P = D.proposals, n = P.written, size = 36, pitch = (1440 - size) / (n - 1);
      var svg = d3.select("#c-tally");
      svg.selectAll("*").remove();
      svg.selectAll("rect").data(d3.range(n)).join("rect")
        .attr("x", function (i) { return i * pitch + 2; }).attr("y", 12).attr("width", size - 4).attr("height", size - 4)
        .attr("stroke-width", 4)
        .attr("stroke", function (i) { return i >= n - P.funded ? C.orange : C.ink; })
        .attr("fill", function (i) { return i >= n - P.funded ? C.orange : "none"; });
    },
    frag: function (act, shown, on) {
      if (!shown || !on) return;
      var P = D.proposals, n = P.written;
      var r = d3.select("#c-tally").selectAll("rect");
      r.interrupt().attr("opacity", 0).attr("stroke", C.ink).attr("fill", "none");
      r.transition().delay(function (i) { return 150 + i * 28; }).duration(120).attr("opacity", 1);
      r.filter(function (i) { return i >= n - P.funded; })
        .transition("fund").delay(function (i) { return 1250 + (i - (n - P.funded)) * 160; }).duration(260)
        .attr("stroke", C.orange).attr("fill", C.orange);
    }
  });
  function fitNumber() {
    // Set the number across the full column, like a front page headline.
    var num = document.getElementById("n-amount"), box = num && num.closest(".bignum");
    if (!box) return;
    try {
      var ctx = document.createElement("canvas").getContext("2d");
      ctx.font = '800 200px "Atkinson Hyperlegible Next"';
      var w = ctx.measureText(num.dataset.full || num.textContent).width;
      if (w > 0) box.style.fontSize = Math.floor(200 * 1440 / w * 0.998) + "px";
    } catch (e) { /* keep the size from the stylesheet */ }
  }
  if (document.fonts && document.fonts.load) {
    document.fonts.load('800 200px "Atkinson Hyperlegible Next"').then(fitNumber);
  }

  // 2, 11, 12 The key and the question; 6 the bridge: text lands, one stroke is drawn
  function textScene(id, extra) {
    scene(id, {
      draw: function (on, s) {
        var lands = s.sec.querySelectorAll(".land"), uws = s.sec.querySelectorAll(".uw");
        land(lands, on, s, 150, 190);
        Array.prototype.forEach.call(uws, function (u) {
          u.classList.remove("pre");
          if (!on) return;
          u.classList.add("pre");
          s.after(150 + lands.length * 190 + 350, function () { void u.offsetWidth; u.classList.remove("pre"); });
        });
        if (extra) extra(on, s);
      }
    });
  }
  textScene("s-key");
  textScene("s-key2");
  textScene("s-question");
  textScene("s-bridge", function (on, s) {
    var ph = s.sec.querySelector(".ph");
    ph.classList.remove("pre");
    if (!on) return;
    ph.classList.add("pre");
    s.after(250, function () { void ph.offsetWidth; ph.classList.remove("pre"); });
  });

  // 3 Who can do this: the computer and the dolls, drawn like a sketch in the margin
  scene("s-who", {
    draw: function (on, s) {
      var svg = d3.select("#c-who");
      svg.selectAll("*").remove();
      var computer = [
        "M20,10 h200 a12,12 0 0 1 12,12 v116 a12,12 0 0 1 -12,12 h-200 a12,12 0 0 1 -12,-12 v-116 a12,12 0 0 1 12,-12 z",
        "M40,34 h160 v80 h-160 z",
        "M58,58 l18,13 l-18,13",
        "M90,88 h34",
        "M104,150 v24 M136,150 v24",
        "M84,174 h72",
        "M6,192 h228 v28 h-228 z",
        "M26,206 h188"
      ];
      function doll() {
        return [
          "M70,14 a26,26 0 1 0 0.01,0 z",
          "M70,70 L26,170 H114 Z",
          "M54,106 L18,130",
          "M86,106 L122,130",
          "M54,170 v38",
          "M86,170 v38"
        ];
      }
      function icon(x, y, k, paths, delay) {
        var g = svg.append("g").attr("transform", "translate(" + x + "," + y + ") scale(" + k + ")")
          .attr("fill", "none").attr("stroke", C.ink).attr("stroke-width", 6 / k * 1.1)
          .attr("stroke-linecap", "round").attr("stroke-linejoin", "round");
        paths.forEach(function (d, i) {
          drawLine(g.append("path").attr("d", d), on, delay + i * 110, 520);
        });
      }
      icon(742, 322, 1.2, computer, 300);
      icon(1128, 322, 1.2, doll(), 1200);
      icon(1128 + 150, 322 + 84, 0.86, doll(), 1500);
      fade(svg.append("text").attr("class", "t34 b").attr("x", 742 + 144).attr("y", 652).attr("text-anchor", "middle").text("me"), on, 1000, 400);
      fade(svg.append("text").attr("class", "t34 b").attr("x", 1128 + 150).attr("y", 652).attr("text-anchor", "middle").text("my sister"), on, 2000, 400);
      var out = s.sec.querySelectorAll(".out"), uw = s.sec.querySelector(".out .uw");
      land(out, on, s, 2300, 0);
      uw.classList.remove("pre");
      if (on) { uw.classList.add("pre"); s.after(2800, function () { void uw.offsetWidth; uw.classList.remove("pre"); }); }
    }
  });

  // 4 The role: the people table as a ledger of dots, one dot per engagement
  scene("s-role", {
    draw: function (on) {
      var svg = d3.select("#c-role");
      svg.selectAll("*").remove();
      var LX = 500, DX = 540, P = 27, R = 9.5, PER = 32, NX = 1520, LH = 30;
      function label(y, t, cls) {
        return svg.append("text").attr("class", "t28 " + (cls || "")).attr("x", LX).attr("y", y).attr("dy", "0.35em").attr("text-anchor", "end").text(t);
      }
      function pop(c, delay) {
        var r = +c.attr("r");
        if (on) c.attr("r", 0);
        tr(c, on, delay, 450, d3.easeBackOut.overshoot(2.2)).attr("r", r);
      }
      fade(label(262, "Professor"), on, 100);
      pop(svg.append("circle").attr("cx", DX).attr("cy", 262).attr("r", 13).attr("fill", C.blue), 100);
      fade(label(318, "Data steward", "b"), on, 450);
      pop(svg.append("circle").attr("cx", DX).attr("cy", 318).attr("r", 13).attr("fill", C.orange), 450);
      drawLine(svg.append("line").attr("x1", DX + 30).attr("x2", DX + 96).attr("y1", 318).attr("y2", 318).attr("stroke", C.ink).attr("stroke-width", 2), on, 700, 300);
      fade(svg.append("text").attr("class", "t28").attr("x", DX + 110).attr("y", 318).attr("dy", "0.35em").text("the layer in between, next to each person"), on, 850);
      svg.append("line").attr("x1", 80).attr("x2", 1520).attr("y1", 358).attr("y2", 358).attr("stroke", C.ink).attr("stroke-width", 1.5);

      var y = 404, idx = 0, dots = [], T0 = 1000, STEP = 7;
      D.people.by_group.forEach(function (gp) {
        var first = idx;
        for (var k = 0; k < gp.n; k++) dots.push({ cx: DX + (k % PER) * P, cy: y + Math.floor(k / PER) * LH, i: idx++ });
        fade(label(y, gp.group), on, T0 + first * STEP);
        fade(svg.append("text").attr("class", "t30 b tn").attr("x", NX).attr("y", y).attr("dy", "0.35em").attr("text-anchor", "end").text(fInt(gp.n)), on, T0 + idx * STEP);
        y += (Math.ceil(gp.n / PER) - 1) * LH + 52;
      });
      var c = svg.append("g").selectAll("circle").data(dots).join("circle")
        .attr("cx", function (d) { return d.cx; }).attr("cy", function (d) { return d.cy; }).attr("r", R).attr("fill", C.ink);
      if (on) c.attr("r", 0);
      tr(c, on, function (d) { return T0 + d.i * STEP; }, 260).attr("r", R);

      var ry = y - 22, tEnd = T0 + idx * STEP;
      drawLine(svg.append("line").attr("x1", 80).attr("x2", 1520).attr("y1", ry).attr("y2", ry).attr("stroke", C.ink).attr("stroke-width", 3), on, tEnd, 500);
      fade(label(ry + 44, "Total since 2021", "b"), on, tEnd + 300);
      var tot = svg.append("text").attr("class", "t44 b tn").attr("x", NX).attr("y", ry + 44).attr("dy", "0.35em").attr("text-anchor", "end");
      count(tot, on, tEnd + 300, 700, D.people.total, function (v) { return fInt(Math.round(v)); });
      fade(tot, on, tEnd + 300, 200);
      [ry + 74, ry + 81].forEach(function (yy, i) {
        drawLine(svg.append("line").attr("x1", NX - 92).attr("x2", NX).attr("y1", yy).attr("y2", yy).attr("stroke", C.orange).attr("stroke-width", 4), on, tEnd + 900 + i * 160, 300);
      });
    }
  });

  // 5 ghedata: repositories by type
  scene("s-repos", {
    draw: function (on) {
      var svg = d3.select("#c-repos");
      svg.selectAll("*").remove();
      var data = gh.repositories_by_type.slice().sort(function (a, b) { return b.total - a.total; });
      var X0 = 500, W = 780, Y0 = 258, P = 45.5, BH = 28;
      var x = d3.scaleLinear().domain([0, d3.max(data, function (d) { return d.total; })]).range([0, W]);
      var rows = svg.selectAll("g.r").data(data).join("g").attr("class", "r")
        .attr("transform", function (d, i) { return "translate(0," + (Y0 + i * P) + ")"; });
      rows.append("text").attr("class", function (d, i) { return "t28" + (i === 0 ? " b" : ""); })
        .attr("x", X0 - 20).attr("y", BH / 2).attr("dy", "0.35em").attr("text-anchor", "end")
        .text(function (d) { return cap(d.repository_type); });
      var bars = rows.append("rect").attr("x", X0).attr("height", BH)
        .attr("fill", function (d, i) { return i === 0 ? C.orange : C.mark; })
        .attr("width", function (d) { return x(d.total); });
      if (on) bars.attr("width", 0);
      tr(bars, on, function (d, i) { return 250 + i * 70; }, 800).attr("width", function (d) { return x(d.total); });
      var vals = rows.append("text").attr("class", function (d, i) { return (i === 0 ? "t34" : "t28") + " b tn"; })
        .attr("x", function (d) { return X0 + x(d.total) + 14; }).attr("y", BH / 2).attr("dy", "0.35em")
        .text(function (d, i) { return i === 0 ? fInt(d.total) + " of " + fInt(gh.repositories_without_learners) : fInt(d.total); });
      if (on) vals.attr("opacity", 0);
      tr(vals, on, function (d, i) { return 850 + i * 70; }, 350).attr("opacity", 1);
      svg.append("line").attr("x1", X0).attr("x2", X0).attr("y1", Y0 - 10).attr("y2", Y0 + (data.length - 1) * P + BH + 10)
        .attr("stroke", C.ink).attr("stroke-width", 2);

      // where the opening number came from: the package itself
      var cx = 960, cy = 486, card = svg.append("g");
      card.append("line").attr("x1", cx).attr("x2", 1520).attr("y1", cy).attr("y2", cy).attr("stroke", C.ink).attr("stroke-width", 2);
      card.append("text").attr("class", "b bl").attr("x", cx).attr("y", cy + 104).style("font-size", "104px").style("letter-spacing", "-0.02em").text("ghedata");
      var tables = ["proposals", "repositories", "people"];
      tables.forEach(function (t, i) {
        var ty = cy + 170 + i * 46;
        card.append("rect").attr("x", cx + 2).attr("y", ty - 20).attr("width", 18).attr("height", 18).attr("fill", "none").attr("stroke", C.blue).attr("stroke-width", 3);
        card.append("text").attr("class", "t34" + (t === "repositories" ? " b" : "")).attr("x", cx + 40).attr("y", ty).text(t);
      });
      fade(card, on, 1900, 600);
    }
  });

  // 7 The AI year: commits per month, the part with an agent trailer in orange
  scene("s-share", {
    draw: function (on) {
      var svg = d3.select("#c-share");
      svg.selectAll("*").remove();
      var all = gh.commits_per_month, data = all.slice(all.length - 24);
      var X0 = 80, GAP = 28, STEP = (1230 - GAP) / 24, BW = STEP - 11, BASE = 742, H = 310;
      var ymax = d3.max(data, function (d) { return d.commits; });
      var y = d3.scaleLinear().domain([0, ymax]).range([0, H]);
      function xi(i) { return X0 + i * STEP + (i >= 12 ? GAP : 0); }
      var xr = xi(12);

      // grid
      [400, 800].forEach(function (v) {
        svg.append("line").attr("x1", X0).attr("x2", xi(23) + BW).attr("y1", BASE - y(v)).attr("y2", BASE - y(v)).attr("stroke", C.mark).attr("stroke-width", 1.5).attr("stroke-dasharray", "2 6");
        svg.append("text").attr("class", "t28 g tn").attr("x", X0).attr("y", BASE - y(v) - 10).text(v === 800 ? fInt(v) + " commits a month" : fInt(v));
      });
      // columns
      var tot = svg.append("g").selectAll("rect").data(data).join("rect")
        .attr("x", function (d, i) { return xi(i); }).attr("width", BW).attr("fill", C.mark)
        .attr("y", function (d) { return BASE - y(d.commits); }).attr("height", function (d) { return y(d.commits); });
      if (on) tot.attr("y", BASE).attr("height", 0);
      tr(tot, on, function (d, i) { return 200 + i * 35; }, 700)
        .attr("y", function (d) { return BASE - y(d.commits); }).attr("height", function (d) { return y(d.commits); });
      var ag = svg.append("g").selectAll("rect").data(data).join("rect")
        .attr("x", function (d, i) { return xi(i); }).attr("width", BW).attr("fill", C.orange)
        .attr("y", function (d) { return BASE - y(d.assisted); }).attr("height", function (d) { return y(d.assisted); });
      if (on) ag.attr("y", BASE).attr("height", 0);
      tr(ag, on, function (d, i) { return 1300 + i * 35; }, 700)
        .attr("y", function (d) { return BASE - y(d.assisted); }).attr("height", function (d) { return y(d.assisted); });
      svg.append("line").attr("x1", X0).attr("x2", xi(23) + BW).attr("y1", BASE).attr("y2", BASE).attr("stroke", C.ink).attr("stroke-width", 2);

      // the two windows: bracket, label, and the share set large above
      var wins = [
        { a: 0, b: 11, label: gh.commit_windows.previous, share: gh.assisted_share_previous, t: 1400 },
        { a: 12, b: 23, label: gh.commit_windows.current, share: gh.assisted_share_current, t: 1900 }
      ];
      wins.forEach(function (w) {
        var xa = xi(w.a), xb = xi(w.b) + BW, by = BASE + 22;
        drawLine(svg.append("path").attr("d", "M" + xa + "," + (by - 10) + " V" + by + " H" + xb + " V" + (by - 10))
          .attr("fill", "none").attr("stroke", C.ink).attr("stroke-width", 2), on, w.t - 900, 600);
        fade(svg.append("text").attr("class", "t28").attr("x", (xa + xb) / 2).attr("y", by + 40).attr("text-anchor", "middle").text(w.label), on, w.t - 700);
        var big = svg.append("text").attr("class", "b tn").attr("x", xa - 6).attr("y", 384).style("font-size", "160px").style("letter-spacing", "-0.03em");
        count(big, on, w.t, 900, w.share * 100, function (v) { return Math.round(v) + "%"; });
        fade(big, on, w.t, 250);
      });
      // annotation: data packages
      var dp = gh.commits_by_type_two_windows.filter(function (d) { return d.repository_type === "data package"; })[0];
      var ax = xr + 372, an = svg.append("g");
      an.append("line").attr("x1", ax).attr("x2", ax).attr("y1", 290).attr("y2", 384).attr("stroke", C.orange).attr("stroke-width", 6);
      an.append("text").attr("class", "t44 b tn").attr("x", ax + 22).attr("y", 330).text(F.pct(dp.share_assisted_current));
      an.append("text").attr("class", "t28").attr("x", ax + 22).attr("y", 374).text("in data packages");
      fade(an, on, 2800, 500);

      // direct labels on the last month in place of a legend
      var last = data[23], lx = xi(23) + BW, la = svg.append("g");
      var yTop = BASE - y(last.commits), yAg = BASE - y(last.assisted) / 2;
      la.append("line").attr("x1", lx + 6).attr("x2", lx + 34).attr("y1", yTop + 3).attr("y2", yTop + 3).attr("stroke", C.ink).attr("stroke-width", 2);
      la.append("text").attr("class", "t28").attr("x", lx + 44).attr("y", yTop + 3).attr("dy", "0.35em").text("all commits");
      la.append("line").attr("x1", lx + 6).attr("x2", lx + 34).attr("y1", yAg).attr("y2", yAg).attr("stroke", C.ink).attr("stroke-width", 2);
      la.append("text").attr("class", "t28 b").attr("x", lx + 44).attr("y", yAg - 16).attr("dy", "0.35em").text("with an agent");
      la.append("text").attr("class", "t28 b").attr("x", lx + 44).attr("y", yAg + 18).attr("dy", "0.35em").text("trailer");
      fade(la, on, 2300, 500);
    }
  });

  // 8 Commits by repository type: more commits and agent use are two different things
  scene("s-types", {
    draw: function (on) {
      var svg = d3.select("#c-types");
      svg.selectAll("*").remove();
      var data = gh.commits_by_type_two_windows
        .filter(function (d) { return d.repository_type !== "learner repository"; })
        .sort(function (a, b) { return b.current - a.current; }).slice(0, 6);
      var LX = 400, X0 = 420, W = 470, Y0 = 318, P = 58, BH = 30;
      var cPrev = 1040, cNow = 1180, cFac = 1310, cSh = 1520;
      var x = d3.scaleLinear().domain([0, d3.max(data, function (d) { return d.current; })]).range([0, W]);
      var T1 = 300, T2 = 1200, T3 = 2100;

      // column heads
      var hy = 268;
      [["commits a year, orange with agent", X0, "start"], ["before", cPrev, "end"], ["now", cNow, "end"], ["factor", cFac, "end"], ["with agent", cSh, "end"]]
        .forEach(function (h) { svg.append("text").attr("class", "t28 g").attr("x", h[1]).attr("y", hy).attr("text-anchor", h[2]).text(h[0]); });
      svg.append("line").attr("x1", 80).attr("x2", 1520).attr("y1", hy + 18).attr("y2", hy + 18).attr("stroke", C.ink).attr("stroke-width", 1.5);

      var rows = svg.selectAll("g.r").data(data).join("g").attr("class", "r")
        .attr("transform", function (d, i) { return "translate(0," + (Y0 + i * P) + ")"; });
      function cell(sel, cls, cx, fn, t) {
        var tx = sel.append("text").attr("class", cls).attr("x", cx).attr("y", BH / 2).attr("dy", "0.35em").attr("text-anchor", "end").text(fn);
        if (on) tx.attr("opacity", 0);
        tr(tx, on, function (d, i) { return t + (i || 0) * 60; }, 350).attr("opacity", 1);
        return tx;
      }
      cell(rows, "t28", LX, function (d) { return cap(d.repository_type); }, 100).attr("class", function (d, i) { return "t28" + (i === 0 ? " b" : ""); });
      // the bar grows to the year before, pauses, then to the last twelve months
      var bar = rows.append("rect").attr("x", X0).attr("height", BH).attr("fill", C.ink).attr("width", function (d) { return x(d.current); });
      if (on) {
        bar.attr("width", 0)
          .transition().delay(function (d, i) { return T1 + i * 60; }).duration(600).ease(d3.easeCubicOut).attr("width", function (d) { return x(d.previous); })
          .transition().delay(350).duration(800).ease(d3.easeCubicInOut).attr("width", function (d) { return x(d.current); });
      }
      var ag = rows.append("rect").attr("x", X0).attr("height", BH).attr("fill", C.orange).attr("width", function (d) { return x(d.assisted_current); });
      if (on) ag.attr("width", 0);
      tr(ag, on, function (d, i) { return T3 + i * 60; }, 600).attr("width", function (d) { return x(d.assisted_current); });
      cell(rows, "t30 tn", cPrev, function (d) { return fInt(d.previous); }, T1 + 300);
      cell(rows, "t30 b tn", cNow, function (d) { return fInt(d.current); }, T2 + 500);
      cell(rows, "t30 tn", cFac, function (d) { return F.x(d.factor); }, T2 + 700);
      cell(rows, "t30 b tn", cSh, function (d) { return F.pct(d.share_assisted_current); }, T3 + 300);
      svg.append("line").attr("x1", X0).attr("x2", X0).attr("y1", Y0 - 8).attr("y2", Y0 + 5 * P + BH + 8).attr("stroke", C.ink).attr("stroke-width", 2);

      // the one thing to see: the hardware row
      [[cFac, 92], [cSh, 72]].forEach(function (u, i) {
        drawLine(svg.append("line").attr("x1", u[0] - u[1]).attr("x2", u[0] + 2).attr("y1", Y0 + BH + 8).attr("y2", Y0 + BH + 7)
          .attr("stroke", C.orange).attr("stroke-width", 6).attr("stroke-linecap", "round"), on, T3 + 800 + i * 250, 350);
      });

      // the sum
      var ty = Y0 + 6 * P - 6, A = gh.commit_change_all, tot = svg.append("g");
      tot.append("line").attr("x1", 80).attr("x2", 1520).attr("y1", ty).attr("y2", ty).attr("stroke", C.ink).attr("stroke-width", 3);
      var yy = ty + 42;
      tot.append("text").attr("class", "t30 b").attr("x", LX).attr("y", yy).attr("dy", "0.35em").attr("text-anchor", "end").text("All repositories");
      tot.append("text").attr("class", "t34 b tn").attr("x", cPrev).attr("y", yy).attr("dy", "0.35em").attr("text-anchor", "end").text(fInt(A.previous));
      tot.append("text").attr("class", "t34 b tn").attr("x", cNow).attr("y", yy).attr("dy", "0.35em").attr("text-anchor", "end").text(fInt(A.current));
      tot.append("text").attr("class", "t34 b tn").attr("x", cFac).attr("y", yy).attr("dy", "0.35em").attr("text-anchor", "end").text(F.x(A.factor));
      tot.append("text").attr("class", "t34 b tn").attr("x", cSh).attr("y", yy).attr("dy", "0.35em").attr("text-anchor", "end").text(F.pct(gh.assisted_share_current));
      fade(tot, on, T3 + 500, 500);

      var cav = svg.append("g");
      cav.append("rect").attr("x", 80).attr("y", 770).attr("width", 8).attr("height", 44).attr("fill", C.blue);
      cav.append("text").attr("class", "t30 b").attr("x", 108).attr("y", 792).attr("dy", "0.35em").text("Commits measure activity. They say nothing about research quality.");
      fade(cav, on, T3 + 1000, 500);
    }
  });

  // 9 The result: guluswm, from files to DOI
  scene("s-gulu", {
    draw: function (on) {
      var svg = d3.select("#c-gulu");
      svg.selectAll("*").remove();
      var G = D.gulu, X0 = 200, X1 = 1400, Y = 560, days = G.days_to_release;
      function x(d) { return X0 + (X1 - X0) * d / days; }

      var head = svg.append("g");
      head.append("text").attr("class", "b bl").attr("x", 80).attr("y", 306).style("font-size", "72px").style("letter-spacing", "-0.02em").text(G.package);
      head.append("text").attr("class", "t30").attr("x", 400).attr("y", 306).text("Household solid waste, " + G.place);
      fade(head, on, 100, 500);

      // time line with one tick per day
      drawLine(svg.append("line").attr("x1", X0).attr("x2", X1).attr("y1", Y).attr("y2", Y).attr("stroke", C.ink).attr("stroke-width", 4), on, 400, 1100);
      d3.range(days + 1).forEach(function (d) {
        var t = svg.append("g");
        t.append("line").attr("x1", x(d)).attr("x2", x(d)).attr("y1", Y + 14).attr("y2", Y + 30).attr("stroke", C.ink).attr("stroke-width", 2);
        t.append("text").attr("class", "t28 tn" + (d === 0 || d === days ? " b" : " g")).attr("x", x(d)).attr("y", Y + 66).attr("text-anchor", "middle").text(fDay(addDays(G.files_received, d)));
        fade(t, on, 400 + d * 260, 350);
      });
      // start
      var st = svg.append("g");
      st.append("circle").attr("cx", X0).attr("cy", Y).attr("r", 15).attr("fill", C.ink);
      st.append("text").attr("class", "t34 b").attr("x", X0 - 15).attr("y", Y - 44).text("Files received");
      fade(st, on, 300, 400);
      // the questions: one small circle each, filled when answered
      var nq = G.questions_to_authors, qa = x(0) + 44, qb = x(G.days_until_answered) - 30;
      var q = svg.append("g").selectAll("circle").data(d3.range(nq)).join("circle")
        .attr("cx", function (i) { return qa + (qb - qa) * i / (nq - 1); }).attr("cy", Y).attr("r", 6.5)
        .attr("stroke", C.blue).attr("stroke-width", 3).attr("fill", C.blue);
      if (on) {
        q.attr("opacity", 0).attr("fill", C.paper)
          .transition().delay(function (i) { return 900 + i * 14; }).duration(150).attr("opacity", 1)
          .transition().delay(function (i) { return 500 + i * 8; }).duration(200).attr("fill", C.blue);
      }
      var ql = svg.append("g"), qy = Y + 112;
      ql.append("path").attr("d", "M" + x(0) + "," + (qy - 10) + " V" + qy + " H" + x(G.days_until_answered) + " V" + (qy - 10)).attr("fill", "none").attr("stroke", C.blue).attr("stroke-width", 2);
      ql.append("text").attr("class", "t30 b bl").attr("x", (x(0) + x(G.days_until_answered)) / 2).attr("y", qy + 44).attr("text-anchor", "middle")
        .text(fInt(nq) + " questions to the authors, answered within " + G.days_until_answered + " days");
      fade(ql, on, 1900, 500);
      // release
      var en = svg.append("g");
      en.append("circle").attr("cx", X1).attr("cy", Y).attr("r", 22).attr("fill", C.orange);
      en.append("text").attr("class", "t34 b").attr("x", X1 + 22).attr("y", Y - 44).attr("text-anchor", "end").text("Released with a DOI");
      fade(en, on, 2500, 400);
      // the span
      var sy = 420, sp = svg.append("g");
      sp.append("path").attr("d", "M" + X0 + "," + (sy + 12) + " V" + sy + " H" + X1 + " V" + (sy + 12)).attr("fill", "none").attr("stroke", C.ink).attr("stroke-width", 2);
      sp.append("rect").attr("x", (X0 + X1) / 2 - 110).attr("y", sy - 30).attr("width", 220).attr("height", 60).attr("fill", C.paper);
      sp.append("text").attr("class", "b tn").attr("x", (X0 + X1) / 2).attr("y", sy).attr("dy", "0.35em").attr("text-anchor", "middle").style("font-size", "52px").text(days + " days");
      fade(sp, on, 2800, 500);
      fade(svg.append("text").attr("class", "t28 g").attr("x", 1520).attr("y", 306).attr("text-anchor", "end").text("doi.org/" + G.doi), on, 2900, 400);
    }
  });

  // 10 The trade-off: everything hangs on one dot
  var tradeDots = [];
  scene("s-trade", {
    draw: function (on, s) {
      land(s.sec.querySelectorAll(".land"), on, s, 200, 380);
      var uw = s.sec.querySelector(".uw");
      uw.classList.remove("pre");
      if (on) { uw.classList.add("pre"); s.after(1650, function () { void uw.offsetWidth; uw.classList.remove("pre"); }); }

      var svg = d3.select("#c-trade");
      svg.selectAll("*").remove();
      var n = D.people.total, COLS = 14, P = 33, CX = 1296, TOPY = 214, GY = 372;
      var gx = CX - (COLS - 1) * P / 2;
      tradeDots = d3.range(n).map(function (i) {
        return { i: i, x: gx + (i % COLS) * P, y: GY + Math.floor(i / COLS) * P, fall: 6 + ((i * 37) % 23) };
      });
      var lines = svg.append("g").attr("class", "fan").selectAll("line").data(tradeDots).join("line")
        .attr("x1", CX).attr("y1", TOPY).attr("x2", function (d) { return d.x; }).attr("y2", function (d) { return d.y; })
        .attr("stroke", C.ink).attr("stroke-width", 1).attr("opacity", 0.38);
      if (on) {
        lines.attr("x2", CX).attr("y2", TOPY)
          .transition().delay(function (d) { return 500 + d.i * 5; }).duration(500).ease(d3.easeCubicOut)
          .attr("x2", function (d) { return d.x; }).attr("y2", function (d) { return d.y; });
      }
      var dots = svg.append("g").attr("class", "crowd").selectAll("circle").data(tradeDots).join("circle")
        .attr("cx", function (d) { return d.x; }).attr("cy", function (d) { return d.y; }).attr("r", 9).attr("fill", C.ink);
      if (on) dots.attr("r", 0);
      tr(dots, on, function (d) { return 800 + d.i * 5; }, 300).attr("r", 9);
      var one = svg.append("circle").attr("class", "one").attr("cx", CX).attr("cy", TOPY).attr("r", 34)
        .attr("fill", C.orange).attr("stroke", C.orange).attr("stroke-width", 5);
      if (on) one.attr("r", 0);
      tr(one, on, 200, 500, d3.easeBackOut.overshoot(2)).attr("r", 34);
    },
    frag: function (act, shown, on) {
      var svg = d3.select("#c-trade");
      var wait = on && shown ? 0 : 0;
      function t(sel, name) { return on ? sel.transition(name).delay(wait).duration(700).ease(d3.easeCubicInOut) : sel.interrupt(name); }
      if (shown) {
        t(svg.select(".one"), "f").attr("fill", C.paper).attr("stroke-dasharray", "9 9");
        t(svg.selectAll(".fan line"), "f").attr("opacity", 0);
        var c = svg.selectAll(".crowd circle");
        (on ? c.transition("f").delay(function (d) { return 150 + ((d.i * 53) % 400); }).duration(800).ease(d3.easeCubicIn) : c)
          .attr("cy", function (d) { return d.y + d.fall; }).attr("fill", C.mark);
      } else {
        t(svg.select(".one"), "f").attr("fill", C.orange).attr("stroke-dasharray", null);
        t(svg.selectAll(".fan line"), "f").attr("opacity", 0.38);
        t(svg.selectAll(".crowd circle"), "f").attr("cy", function (d) { return d.y; }).attr("fill", C.ink);
      }
    }
  });

  // ---------- wiring ----------
  function boot() {
    Object.keys(scenes).forEach(function (id) { run(id, false); });
    if (typeof Reveal === "undefined") return;
    function enter(ev) {
      var cur = ev && ev.currentSlide ? ev.currentSlide : Reveal.getCurrentSlide();
      if (cur && cur.id) run(cur.id, !STILL);
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
    if (Reveal.isReady()) enter(); else Reveal.on("ready", enter);
  }
  if (document.readyState === "complete") boot(); else window.addEventListener("load", boot);
})();
