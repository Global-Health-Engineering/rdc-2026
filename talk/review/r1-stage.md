# Round 1, stage manager and front-end engineer

All findings below were tested in headless Chrome over the DevTools protocol or read from the code. Scripts and screenshots are in a temporary folder that was not kept (section 6 lists them).

Two findings apply to all five decks and matter more than any score.

- **No deck is self-contained.** Every `deck.html` requests `https://cdn.jsdelivr.net/npm/mathjax@2.7.9/MathJax.js` on every load (Quarto's math plugin, inherited from the skeleton). With the network off the request fails at once and all decks run. When the request hangs (captive portal, dead conference wifi), the browser never fires `load`, and every deck starts its script on `load`. Result after 6 seconds: deck B shows headlines with empty charts, deck C shows an empty canvas on every slide, decks A, D and E show static final states without animation. Fix, verified on a copy of the skeleton: `html-math-method: plain` in the YAML removes the plugin and the request (0 external requests afterwards).
- **The cold open plays when the file is opened.** No deck has a holding slide, so the count-up and the flash run minutes before the talk starts. In A and C the count-up does not replay when the speaker steps back to slide 1. In B, D and E it replays on next then previous.

## 1. Scores

| # | Criterion | Weight | A Signal | B Ledger | C Dots | D People | E Commits |
|---|---|---|---|---|---|---|---|
| 1 | One idea | 20 | 5 | 4 | 4 | 4 | 3 |
| 2 | Opening | 15 | 5 | 3 | 3 | 3 | 4 |
| 3 | Visual craft and legibility | 15 | 4 | 4 | 3 | 3 | 4 |
| 4 | Honest data | 15 | 4 | 5 | 4 | 4 | 4 |
| 5 | Fit with the room | 10 | 3 | 5 | 4 | 4 | 4 |
| 6 | Motion and interaction | 10 | 4 | 3 | 4 | 3 | 3 |
| 7 | Production safety | 10 | 3 | 2 | 2 | 3 | 3 |
| 8 | The 80 percent rule | 5 | 5 | 2 | 5 | 4 | 3 |
| | **Weighted total** | 100 | **84** | **74** | **71** | **70** | **71** |

## 2. Ranking

1. Deck A, Signal (84)
2. Deck B, Ledger (74)
3. Deck E, Commit history (71)
4. Deck C, Every dot is one thing (71)
5. Deck D, People in the room (70)

E and C tie on points. E goes ahead because it still shows every chart when the script start is blocked, needs 13 clicks against 27, and stays sharp on a 1024 by 768 projector.

## 3. Per deck

**Deck A.** Strongest: slide 2, "INSIDE" at full width, back on slide 12 in the same setting. Weakest: slide 3. After the click it reads "Me, Dolls. My sister, Computer", and that state is what the PDF prints. What would cost it the room: the opening is a full-screen cut from black to white and back, 140 ms. It is inside the limit and it is the harshest luminance swing of the five. On a bright projector in a dark room people will flinch. The count-up cannot be replayed with the clicker.

**Deck B.** Strongest: slide 8, the only type chart that is a table with before, now, factor and share, all readable. Weakest: slide 1. Ink on paper, digits typed over 1.6 s, the quietest opening of the five. What would cost it the room: timing. Slides 3, 4, 8 and 9 run automatic sequences of 3.3 to 3.6 s, and the caveat on slide 8 is the last thing to appear. With the hanging request, every chart is empty.

**Deck C.** Strongest: slide 8, three states where the same commit squares rise by month, turn orange and regroup into two years. Weakest: slide 6, fifteen rings of dots that need an explanation. What would cost it the room: 27 clicks in 8 minutes, ten slides with more than one click, and a canvas that stays empty when the script start is blocked. At 1024 by 768 and at 1280 by 720 the commit squares on slides 8 and 9 turn into a tartan pattern.

**Deck D.** Strongest: slide 7, the only commit chart with the full history since 2021 and both absolute numbers. Weakest: slide 1. "30 proposals written. 4 funded." stands at 50 px from the first frame, so the second beat is given away during the count. What would cost it the room: five of thirteen slides are empty photo slots today, and every click starts a 0.8 s cross-fade before the words rise, so the deck always lags the speaker.

**Deck E.** Strongest: slide 1. Count on dark, one landing on amber, "30 written, 4 funded" at 76 px appears with the landing, no click needed. Weakest: slide 10, where the node empties by itself after 1.5 s whether the speaker has reached the sentence or not. What would cost it the room: the commit line on every slide is set in a system monospace font (Menlo on this Mac, Consolas or a fallback elsewhere), and the commit graph competes with the one idea.

## 4. Changes for the top two

### Deck A

1. YAML: add `html-math-method: plain` and `overview: false`. In `deck.js`, start on `DOMContentLoaded` in place of `load`. The first removes the CDN request, the second keeps a clicker button that sends Escape from opening the slide overview.
2. Before slide 1: add a black holding slide, so the first click starts the count-up. Remove the `!back` condition in `deck.js` so the count also replays after previous then next.
3. Slide 3: in print, show the first state (Me, Computer. My sister, Dolls) with the question band. Better still, carry over the sentence from deck E slide 3, "I got the computer. My sister, the dolls.", and keep the swap as the click.
4. Slide 12: keep the key sentence on screen after the click, as a yellow band above the question (the PDF page already shows both). This is the slide that stays up during the discussion.
5. Slide 8: add the two absolute numbers and a scale, taken from deck D slide 7 ("2'183 commits", "4'890 commits") or deck B slide 7 (400 and 800 commits a month). Slide 1: flash to the deck yellow in place of white.

### Deck B

1. YAML and script start as for deck A, item 1. In B this is the difference between charts and empty slides.
2. Slide 1: take the scale of deck A slide 1 (the 30 and the 4 as two clicks at 400 px) or the landing on a colour field from deck E slide 1. Add the holding slide.
3. Slides 3, 4, 8, 9: cap every automatic sequence at 1.5 s. On slide 8, show the caveat line from the start and make the hardware underline a click, as deck A slide 9 does with "with an agent".
4. Slide 5: cut the twelve rows to the three largest types and "other" (deck A slide 6, deck C slide 5) and raise the labels from 28 px to 36 px. On a 1024 pixel projector 28 px is 18 px.
5. Slides 11 and 12: merge into one slide with a click, question under the key, so the last spoken slide carries both (deck A slide 12 in print).

## 5. The talk itself

The brief wants the number as the first thing on screen. On the day the deck is opened while the chair speaks, so the number is on screen before Lars says a word. Decide now: holding slide, or blank the projector until the first sentence. Second, check whether the session runs from the organisers' laptop. If it does, the PDF is the deck, and every "click" in the notes is gone. Rehearse once from the PDF. Third, check "Reduce motion" in the system settings of the presenting laptop. With it on, no deck animates.

## 6. Test record

### Clicks and waiting times

Clicks from first to last slide (slides plus fragments), measured with `Reveal.next()`. Times are from the code.

| Deck | Clicks | Slides with more than one click | Longest wait before the slide is complete |
|---|---|---|---|
| A | 21 | 1 (two extra), 3, 4, 7, 8, 9, 11, 12 (one extra each) | Slide 5, 1.5 s (186 blocks, then the steward band). Slide 1, 1.25 s. Slides 6 and 10, 1.2 s. Fragments are instant cuts. |
| B | 14 | 1, 10 | Slide 8, 3.6 s. Slide 3, 3.35 s. Slides 4 and 9, 3.3 s. Slide 7, 2.8 s. Slide 1, 2.6 s, then 2.0 s for the tally after the click. |
| C | 27 | 1 (two extra), 3 (two), 4, 5, 6, 8 (two), 9, 10 (three), 11, 12 | Every state 0.9 s plus stagger, in total 1 to 2 s. Slide 1, 1.7 s count plus 0.7 s pulse. |
| D | 13 | 7 | Every slide, 0.8 s cross-fade, words settled after 1.15 to 1.6 s. Slide 9, 2.8 s. Slide 8, about 2.6 s. Slide 4, 2.4 s. Slide 1, 2.3 s plus 0.75 s pulse. |
| E | 13 | 6 | Slide 8, 2.9 s. Slide 7, 2.8 s. Slide 4, 2.5 s. Slide 1, 2.3 s. Slide 10, the node empties by itself between 1.5 and 2.2 s. |

### Forward, back, jump, reload

`stage.mjs` walks forward, back, jumps from slide 1 to slide 8, reloads on `#/7` and `#/4`, clicks through at 90 ms per click in both directions, and clicks 250 ms after entering each slide. `cmp.py` compares every state against the forward run pixel by pixel.

- A, C, D, E: every state is identical on all six paths. No empty, half drawn or stuck slide.
- B: identical except slide 8, where the shot at 3.2 s is not yet complete (caveat grey, underline half drawn). The cause is the 3.6 s sequence. The slide is complete after that.
- Reload on a middle slide draws correctly in all five. Fragments are restored from the URL in A and C.
- Escape opens the Reveal overview in all five. In C the canvas marks vanish in the overview.
- Frame pacing with the CPU throttled four times: 60 frames a second in all five, including the 7,073 marks of deck C. The cost of the CSS filters in D (six filters on a full-bleed photo that scales for 45 s) is on the graphics card and was not measured.

### PDF

All five: 13 pages, 1200 by 675 pt, no blank or cut page, every page matches the settled screenshot. Remarks on the final states.

- A page 3 prints the swapped state (Me, Dolls). A page 12 prints the key and the question at half size each.
- B page 10 prints the state after the click.
- C page 8 prints the two year blocks, so the monthly view is not in the PDF. C page 12 prints the question without the key sentence, so the key is on page 2 only.
- D and E: no remark.
- Fonts in the PDF: Menlo is embedded in C, D and E (the system monospace font of the build machine), ArialMT in C (a fallback glyph, probably the arrow on slide 9).

### External requests

Search of `deck.html` and a network log with the network set offline, identical for all five: one request per load, `https://cdn.jsdelivr.net/npm/mathjax@2.7.9/MathJax.js?config=TeX-AMS_HTML-full`. No other external request. Images, fonts, D3 and data are embedded. The photo paths `img/lars-at-eight.jpg` in B and C are inside HTML comments and are not requested.

| Network state | A | B | C | D | E |
|---|---|---|---|---|---|
| Off (request fails at once) | runs | runs | runs | runs | runs |
| Request hangs (`stall.mjs`) | static final states, class-based swaps on slides 3 and 11 dead | headlines, charts empty | canvas empty on every slide | static final states | static final states |

### Flashing

| Deck | What happens on slide 1 | Count | Reduced motion |
|---|---|---|---|
| A | Count-up 1.1 s, then the whole slide cuts black to white and back, white held 140 ms (measured about 130 ms). No replay on return. | 1 flash, full screen, luminance 0 to 1 to 0 | Static final state, verified |
| B | Digits typed in 1.6 s, an orange band (276 of 900 px high) fades in and out once in 0.75 s. | No full-screen change | Static, verified |
| C | Count-up 1.7 s, the number tints orange and grows 3.5 percent once in 0.7 s. | No flash | Static, verified |
| D | On load the amber final state is visible for about 130 ms, fades to dark in 160 ms, count 1.9 s, then dark to amber in 160 ms and stays. Replays on every return. | 2 full-screen swings about 2 s apart | Static, verified |
| E | On load one white frame and one amber frame, then dark, count 1.7 s, then cream (#fff4d6) for 120 ms easing to amber over 450 ms. Replays on every return. | 1 flash, full screen, luminance 0.01 to 0.91 to 0.53 | Static, verified |

All five stay within the brief (at most three a second, at most one second, no saturated red). With reduced motion set, slides 4, 5, 7, 8, 9 and 10 of every deck are complete 300 ms after entry.

### Other aspect ratios

- 1024 by 768: all decks scale to 0.64 and sit in a 1024 by 576 band with bars of 96 px above and below. Nothing is cut. In B and E the slide colour fills the bars. In A the yellow slides and in D the amber slides become a box with dark bars. Text of 28 px becomes 18 px, which hits B (sources and row labels), D (sources 20 px become 13 px) and E (commit lines) hardest.
- 1280 by 720: scale 0.8, no overflow in A, B, C, E. D reports overflow on slides 2, 11 and 13, which is the zoomed photo and is clipped by the stage.
- C slides 8 and 9: at both sizes the gaps between the commit squares alias into uneven stripes (`c/alias-cmp.png`). E's squares of ten commits stay clean.

### Size, load, machine dependence

| Deck | deck.html | deck.pdf | Reveal ready | Depends on the machine |
|---|---|---|---|---|
| A | 6.05 MB | 7.2 MB | 0.44 s | Nothing beyond the MathJax request. One CSS filter on the photo of slide 7. |
| B | 6.07 MB | 2.2 MB | 0.50 s | `clip-path` wipe on slide 6. |
| C | 6.06 MB | 4.2 MB | 0.53 s | Canvas of 3200 by 1800 px. System monospace on slide 13. |
| D | 5.84 MB | 7.3 MB | 0.43 s | Filter chain plus 45 s zoom on every photo, 0.8 s cross-fade. System monospace on slides 1, 3, 4, 6, 9, 10, 13. |
| E | 6.05 MB | 2.4 MB | 0.59 s | System monospace on every slide (commit line, placeholder flag). |

No video, no audio, no iframe with content in any deck. Smallest text outside the last slide: A 28 px, B 20 px (sources), C 28 px, D 20 px (sources), E 24 px (slide 9 source).

### Files

- `stage.mjs`: forward, back, jump, reload, fast and early clicking, 1024 by 768, 1280 by 720, reduced motion, flash frames. Output per deck in `a/` to `e/`, summary in `stage.json`.
- `cmp.py`, `flash.py`, `sheet.py`: state comparison, background colour over time, contact sheets.
- `stall.mjs`: the hanging CDN request. Result in `stall-all.png`.
- `firstpaint.mjs`: frames from the moment of navigation.
- `minfont.mjs`, `fps.mjs`, `native.mjs`, `net.mjs`: smallest text, frame pacing, native shots, request log.
- `mj/`: copy of the skeleton rendered with `html-math-method: plain`.
