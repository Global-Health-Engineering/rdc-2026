# Round 1 report: information designer

Basis: every settled slide of all five decks read as an image at 1920 by 1080, the early frames of the opening slides, `deck.qmd`, `deck.scss` and the chart code of each deck, `report.json`, and `data.json` recomputed by hand (window sums, agent shares, type sums). Sizes are given in design pixels (1600 by 900); multiply by 1.2 for the screenshots.

## 1. Scores

| # | Criterion | Weight | A Signal | B Ledger | C Dots | D People | E Commits |
|---|---|---|---|---|---|---|---|
| 1 | One idea | 20 | 5 | 4 | 4 | 4 | 3 |
| 2 | Opening | 15 | 5 | 3 | 3 | 4 | 4 |
| 3 | Visual craft and legibility | 15 | 4 | 4 | 3 | 3 | 4 |
| 4 | Honest data | 15 | 4 | 5 | 3 | 4 | 3 |
| 5 | Fit with the room | 10 | 3 | 4 | 4 | 3 | 4 |
| 6 | Motion and interaction | 10 | 4 | 4 | 5 | 3 | 3 |
| 7 | Production safety | 10 | 4 | 5 | 4 | 3 | 3 |
| 8 | The 80 percent rule | 5 | 5 | 4 | 5 | 4 | 3 |
| | **Weighted total** | 100 | **86** | **82** | **74** | **71** | **68** |

Criteria 6 and 7 are judged from the code and the stills only; I did not run the decks.

## 2. Ranking

1. Deck A, Signal (86)
2. Deck B, Ledger (82)
3. Deck C, Every dot is one thing (74)
4. Deck D, People in the room (71)
5. Deck E, The talk is a commit history (68)

## 3. Per deck

### Deck A

Strongest: slide 9. Each row carries both absolute numbers, the factor and the agent share, hardware comes first, the caveat sits at 34 px, and the agent share arrives as its own click after the volume. Weakest: slide 8. 8% and 42% stand over 24 bars with no scale, no months and only "Before" and "Now". What costs it the room: every chart separates yellow from white, a luminance contrast of 1.4 to 1. On a washed-out projector the agent share on slides 8 and 9 and the data packages on slide 6 merge with the white. Slide 12 also drops the key sentence when the question appears.

### Deck B

Strongest: slide 8. The headline states the finding ("The biggest jump is in hardware, where agents play a small part"), the table gives before, now, factor and share for six types plus the total row. Weakest: slide 1. Ink on paper is the quietest opening of the five, although the tally of 30 squares with 4 filled is the best picture of "30 written, 4 funded" in the set. What costs it the room: five figure slides run their labels at 28 px and their sources at 20 px, and the grey bars for all commits have 1.9 to 1 against the paper.

### Deck C

Strongest: slide 4. 186 lines fan from the one orange dot to 186 dots in five counted groups, professor above; the role is a picture. Weakest: slide 8. Two blocks of equal width, 42% over a block 2.2 times as tall, and the orange part of the new block (2,046) is almost as large as the whole old block (2,183). The eye reads "the growth is the agents". Slide 3 (two circles labelled computer and dolls, no people) is a close second. What costs it the room: marks and labels built for a laptop. Tool squares on slide 6 are 8 px, group labels 30 to 32 px in the dim colour, and the talk needs 27 clicks.

### Deck D

Strongest: slide 8. The headline says "More commits and agent use are two different things", the hardware bar is visibly grey with "105 to 1'626, 15.5 times" beside it. Weakest: slide 4. The 186 are shown by year; 2021 starts in July and 2026 ends on 11 November, neither is marked, so the chart reads as a decline in 2026. The layer between professor and staff is left to a photo. What costs it the room: five of thirteen slides wait for photos that do not exist yet, and the duotone darkens every photo to about half brightness, which a weak projector turns into a dark grey field.

### Deck E

Strongest: slide 4. Professor, data steward, five branches with counts and dots: the clearest role diagram of the five. Weakest: slide 8. The headline is the factor 2.2 at 76 px, five of six bars are mostly amber, and the hardware finding sits in 28 px muted text ("105, then 15.5 times as many"). The caveat is cut to "a commit is activity" in 30 px monospace. What costs it the room: the commit graph and the commit line take about a sixth of every slide and carry content at the smallest size. On slide 10 "a single point of failure" appears only there.

## 4. Changes for the top two

### Deck A

1. Slide 8: replace "Before" and "Now" with the two windows in words ("November 2024 to October 2025", "November 2025 to October 2026"), add one labelled gridline (400 and 800 commits a month) and the direct labels "all commits" and "with an agent", all as on deck B slide 7. Label the two tall white bars of March and April 2026 "hardware" (607 and 653 commits in `commits_per_month_by_type`), so the hardware finding is visible one slide early.
2. Slides 6, 8 and 9: end the yellow against white pairing (1.4 to 1). Draw the part without an agent in a mid grey (about #8C8C8C: 6.3 to 1 on black, 2.4 to 1 against the yellow) or as a white outline, as slide 9 already does for the year before. Keep white for text.
3. Slide 1: say what the number is. "Proposals, 5 years" lets the amount read as money received. Use "requested in 5 years" or the wording of the notes. Put deck B slide 1's row of 30 squares with 4 filled under the 30 and the 4. Check the zero: four slashed zeros in "000.50" at 230 px read as struck-out digits (this holds for all five decks, the font is shared).
4. Slide 12: keep the key on screen when the question arrives. Move the key into a yellow band at the top (as on slide 4) and set the question below it. The PDF then also stops showing both at half size.
5. Slide 5: add the five counts under the groups (63, 48, 42, 26, 7, as deck C slide 4 and deck E slide 4 do) and set "Doctoral" on the same baseline as the other labels. Slide 6: give "Other" its 96 or remove the label. Slide 10: take the timeline to scale from deck B slide 9, with "before the manuscript is submitted".

### Deck B

1. Slide 1: give the opening its field. Count the number up on a dark or blue full-bleed ground (paper on #0F4C81 measures 7.9 to 1) and cut to paper once, as decks D and E do. Keep the typed digits and the tally.
2. Slide 7: use the encoding of slide 8, ink for all commits and orange for the agent part (5.8 to 1 between the two). The current grey has 1.9 to 1 against the paper and 1.4 to 1 against the orange.
3. Slide 8: draw the year before as a thin bar above each row, as deck A slide 9 and deck D slide 8 do. At present the jump from 105 to 1,626 is only visible while the animation runs and is absent in the PDF.
4. Raise the 28 px labels to 32 px on slides 4, 5, 7, 8 and 9. On slide 5 show six types and "other" to make the room. Move the window dates on slide 8 from the 20 px source line into the column heads.
5. Slide 4: replace the two legend dots with a drawn layer. Take the line from professor to steward to the five groups from deck E slide 4 and keep B's counts. Slide 3: take the swap "And the other way round?" from deck A slide 3; the two icons alone do not tell the story.

## 5. The talk itself

"We commit 2.2 times as much" is mostly one burst. Hardware adds 1,521 of the 2,707 extra commits, 1,260 of them in March and April 2026. Without hardware the factor is 1.6 (2,078 to 3,264). 1,319 of the 2,046 agent commits fall in September and October 2026, so 42 percent describes two months more than a year. Student projects (11 to 210, factor 19.1) outgrow hardware; "biggest jump" needs "in absolute numbers". The opening amount is money requested; the slide should say so. The 186 are engagements, yet several decks let them read as people.

## Measurements behind the scores

### Do the commit slides let the eye conclude that agents caused the growth?

| Deck | Slide | What the eye concludes in two seconds | Risk |
|---|---|---|---|
| B | 7, 8 | Slide 7 shows the share only. Slide 8 states the hardware finding as its headline. The factor 2.2 never stands beside 42%. | Low |
| A | 8, 9 | Slide 8 has no labels, but the two tall white bars are plainly without yellow. Slide 9 shows volume first, agent share on the next click, hardware in the first row. | Low to medium |
| D | 7, 8 | After the click on slide 7, "4'890 commits, 2.2 times as many" sits right above the amber peak, next to an amber 42 %. Slide 8 corrects it in words in the headline. | Medium, for one slide |
| C | 8, 9 | Slide 8 puts ×2.2 between two blocks; the orange area of the new block nearly equals the whole old block. Slide 9 corrects it with "12% agent" as the largest label, and the same squares regroup. | High on slide 8, well corrected |
| E | 7, 8 | Slide 7 stacks amber on top of grey, so amber reads as the increment. Slide 8 leads with "Factor 2.2" over mostly amber bars; the hardware correction is 28 px muted text. | High, weakly corrected |

### Numbers against data.json

Every transcribed number matches the file: 35,452,000.50, 30, 4, 186 and its five groups and six years, 345, the twelve repository types, 8, 42 and 72 percent, 2,183, 4,890, factor 2.2, the six type rows (previous, current, factor, share), 50, 3, 4, both dates, the DOI. I recomputed the two windows from the monthly rows: 167 of 2,183 (7.7 percent) and 2,046 of 4,890 (41.8 percent). The factor 14.6 appears nowhere. What remains:

- Deck C slide 5: "96 other" is derived (345 minus 97, 85, 67), correct, but not a value in the file.
- Deck C slide 9: "other 332 → 629, 35%" is derived, correct, not in the file.
- Deck A slide 6: 96 small squares under the label "Other" with no number.
- Deck A slide 10: "50 answers in 3 days"; the file counts 50 questions to the authors.
- Deck E slide 7: one square is 10 commits, rounded per month. The squares give 16 of 219 (7.3 percent) for the first window against the printed 8%. The second window is exact (206 of 490).
- Deck B slide 8 headline, and the notes of all decks: hardware is the biggest jump in absolute numbers (plus 1,521). By factor, student projects are larger (19.1), and decks B, D and E drop them by showing the six types with the most commits (website, 216, stays; student project, 210, goes).
- Deck D slide 4: the six years sum to 186, but 2021 and 2026 are partial years and unmarked.
- Deck C slide 4, settled state: "186" stands without a unit; the label "engagements since 2021" exists only before the click.
- Deck B slide 9: 50 dots spread evenly over three days of the time axis suggest timing the file does not hold.

Number formats are consistent inside each deck (A with ’, B and C with commas, D and E with '). Deck D writes "8 %" with a space, the others "8%".

### Contrast, computed from the colours in deck.scss and the chart code

| Deck | Smallest text and its pair | Ratio | Weakest pair between marks | Ratio |
|---|---|---|---|---|
| A | 26 to 28 px, white on black (yellow on black 14.7) | 21.0 | yellow against white, slides 6, 8, 9 | 1.4 |
| B | 20 px source, grey #4A453E on paper | 8.4 | grey bars against paper 1.9; orange against grey, slide 7 | 1.4 |
| C | 30 to 32 px labels, dim #B4BDD2 on navy | 10.0 | orange against light marks | 1.6 |
| D | 20 px source and 28 px labels, muted #A9BCBB on panel | 8.0 | amber against the light bar, slide 8 | 1.2 |
| E | 24 px source and 28 px meta, muted #BCB7AB on dark | 9.0 | amber against light bar, slide 8, about 1.3; amber against neutral, slide 7 | 3.5 |

All text passes 7 to 1 on plain grounds. Deck D over photos: white text on the scrim over a white photo area stays at 9.5, amber falls to 6.7 there, and anything in the fade zone of the scrim (the byline on slide 2 at about y 390) can fall to 4 to 7 depending on the photo. No chart in any deck depends on red against green. The weak point everywhere is luminance: the agent colour and the neutral colour differ by hue while their lightness is close, so a washed-out projector or a grey print flattens them. Deck E slide 7 is the one chart that holds (3.5 to 1).

### Text sizes and the last row

Assumption: 60 seats, last row 10 to 12 m from a screen about 3 m wide. One design pixel is then about 1.9 mm, and the usual floor (letter size of the viewing distance divided by 200) is 50 to 60 mm, which is 27 to 32 design pixels. So 28 px is the edge at 10 m and fails at 12 m; 20 to 24 px is lost.

- Deck A: nothing spoken below 30 px except the byline on slide 2 (28 px). Largest type of the five by far. The 30 px values on slide 9 ("105", "432") are the smallest data labels.
- Deck B: 28 px regular weight for the group labels (slide 4), twelve type labels (slide 5), axis, window and direct labels (slide 7), column heads and row labels (slide 8), tick dates (slide 9). 20 px sources on five slides; the one on slide 8 is the only place that defines the two windows.
- Deck C: 30 to 32 px in the dim colour for group labels (slides 4, 5), window dates (slide 8, in the form "11/2024–10/2025"), type names and counts (slide 9). The tool squares on slide 6 (8 px) and single commit squares (4 px) cannot be resolved from the back; the commit squares do not need to be, the tools do.
- Deck D: 20 px sources on slides 5, 7, 8; 28 px muted for years (slides 4, 7), the key and the value labels on slide 8 ("432 to 870").
- Deck E: 28 to 30 px for all chart labels and the key rows; the commit line is 30 px regular monospace on every slide; 24 px source on slide 9; 28 px muted title block on slide 2.

### Typography notes

- All five decks: the shared font has a slashed zero. In the opening number it appears four times in a row.
- Deck E slide 2 breaks the key as "inside the research / group."; decks A, B and D break it after "steward" or "inside the", which reads better.
- Deck A slide 5: "Doctoral" hangs one line below the other four labels and collides with "Staff".
- Deck C slide 5: the "other" column (96) is as tall as the data packages (97), so the eye sees two equal leaders. Deck A's small dots for "other" and deck B's sorted bars avoid this.
- Deck E slide 9 and deck A slide 10 draw the Gulu sequence as three equal steps; decks B and D draw it to scale over four days.
- Stale captures: `deck-b/shots/14.png` and `deck-c/shots/14.png` are older than the rest and belong to no slide.
