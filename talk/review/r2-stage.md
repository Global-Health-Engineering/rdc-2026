# Round 2, stage manager

## 1. Changed and unchanged

- Designer: yellow against white in A (slides 6, 8, 9) is 1.4 to 1 and merges on a weak projector. A's craft drops to 3.
- Coach and professor: B slide 10 is motion with meaning. B's motion rises to 4.
- Against all four on B's production safety (5 each, none ran it): B shows empty charts while the MathJax request hangs. It stays at 2.
- Against designer, audience and professor on C's motion (5): 27 clicks, tartan squares at 1024 pixels.
- Against the coach on D second: five missing photos and a 0.8 s fade on every click.
- Against the audience on A fourth: one quiet slide answers the capitals.

## 2. Final ranking

1. A (81, was 84)
2. B (76, was 74)
3. E
4. C
5. D

## 3. Code changes

**Both decks**

- YAML under `revealjs`: `html-math-method: plain` (verified: no request left) and `overview: false`.
- Holding slide as the first slide: `## {#s-hold background-color="#000000"}`, empty. One click. In print, remove it at the top of `deck.js` (`if (isPrint) document.getElementById("s-hold").remove()`, `PRINT` in B) and confirm 13 pages with `pdfinfo`.
- Replay: previous to the holding slide, then next. A's `countUp()` fires on forward entry (`slidechanged`, `!back`). B's `enter()` calls `run(cur.id, !STILL)` on every `slidechanged`. No further change.

**B only, to reach A**

- Draw at parse time. Move `Object.keys(scenes).forEach(function (id) { run(id, false); })` out of `boot()` to the last line of the script, with `fitNumber()`, again on `document.fonts.ready`.
- `boot()` as in A: retry with `setTimeout(boot, 50)` while `Reveal` is undefined, started on `DOMContentLoaded`.
- In scene `s-types`: `T1 = 200, T2 = 600, T3 = 1000`, and `fade(cav, on, 0, 300)`.
- In `s-who`: `s.after(2800, …)` becomes 1200. In `s-role`: `STEP = 3`. In `s-gulu`: no delay above 1200.

**A only**

- Last line of `deck.js`: `DOMContentLoaded` in place of `load`, so `sync()` always runs.

## 4. Must-do lists

### A

1. YAML, script start, holding slide (22 clicks).
2. Slide 3: print the first state, band of slide 4 as last fragment (coach). No extra click.
3. Slide 12: key stays as a yellow band above the question. No cost.
4. Slides 6, 8, 9: grey #8C8C8C for commits without an agent. Slide 8: window dates and the 400 and 800 lines from B slide 7. No clicks.
5. Slide 11: the 186 blocks of slide 5 vanish on the click as a hard cut (idea of B slide 10, no timers). The professor objects to failure as the loudest slide.
6. Slide 5: diagram of E slide 4 in A's colours, counts per group. Redraw risk. The professor objects unless her lines reach the groups.

### B

1. The safety set above (15 clicks).
2. Slide 1: count on a dark field, one cut to paper (E slide 1, `Reveal.getSlideBackground`), "30 written" and "4 funded" on two clicks (A slide 1). One more click, one full-screen swing.
3. The timing caps above.
4. Slide 8: thin bar for the year before (A slide 9, D slide 8), so the PDF shows the jump. No clicks.
5. Slides 4, 5, 7, 8, 9: labels from 28 to 32 px. Slide 5: six types and "other".
6. Slide 3: the swap of A slide 3 as one fragment. One click. The audience advisor prefers D slide 3.

## 5. One deck

A, because every reveal is a hard cut on a click, so nothing on screen depends on timing, connection or projector resolution.
