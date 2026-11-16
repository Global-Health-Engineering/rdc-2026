# Revision brief for the two leading decks

The panel of five advisors scored all five decks in two rounds. Final means: A Signal 81.4, B Ledger 77.6 (C 75.4, D 75.0, E 73.6 after round 1). Three advisors put A first (coach, designer, stage manager), two put B first (audience, professor). Both decks go to the speaker. Each is revised once, then the panel scores both again.

The full reports are in this folder (r1-*.md, r2-*.md). Read all five r2 reports and the parts of the five r1 reports about your deck before you start. The other decks are in `talk/deck-a` to `talk/deck-e`; read their `deck.qmd` and `deck.js` where a carry-over is named and look at the named slide in their `shots/`.

Where advisors disagreed, the coordinator has decided. The decisions below are binding. The original builders' brief (`talk/tools/BRIEF.md`) still holds in full, including the writing rules and the check loop.

## Decisions for both decks

1. **Production safety.** Under `format: revealjs` add `html-math-method: plain` and `overview: false`. Start the script on `DOMContentLoaded` (with a short retry while `Reveal` is undefined), never on `load`. After rendering, search `deck.html` for `http://` and `https://` in `src=`, `href=`, `url(`, `fetch(` and `import` and confirm that no request leaves the file (links shown as text on the last slide are fine).
2. **Holding slide.** A new first slide, empty and dark (id `s-hold`), so that the number starts on the first click. Remove it in print mode so that the PDF starts with the number. Going back to the holding slide and forward again replays the opening.
3. **Opening.** Label the amount as requested funding: "requested in five years" (set in the style of the deck). "30 written" and "4 funded" arrive on two separate clicks. Keep the `draft-flag`.
4. **Story before the role, in the order of the speaker notes.** First the quiet slide "No doctorate. No computer science degree." in sentence case at moderate size (it should read as an admission), then the computer and the dolls. On the story slide the first state is the true one (me: computer, my sister: dolls); one click swaps them with the question "And the other way round?"; a last click brings the line "Nobody is born a data steward." The PDF shows the true state with the question and the last line, never the swapped state alone.
5. **Role slide.** The professor is connected to all five groups directly (she supervises each one). The steward sits beside, next to each person. The steward is never drawn as a gate between professor and staff. Show the five counts (63, 48, 42, 26, 7) and the unit: "186 theses, projects and positions". Wording to use: professor "supervises each one", data steward "sits next to each one".
6. **Bridge.** Second sentence: "Here, someone was inside." No "because". Do not carry over deck C slide 6 (it draws other groups without data).
7. **Commits figures.** Commits without an agent are drawn in a neutral that differs clearly in lightness from the agent colour (values per deck below). The share figure names its two windows in words ("November 2024 to October 2025", "November 2025 to October 2026"), carries a scale (gridlines at 400 and 800 commits a month) and direct labels "all commits" and "with an agent". Label the two tall bars of March and April 2026 "hardware" (607 and 653 hardware commits in `commits_per_month_by_type`). The by-type figure shows the year before as a thin bar per row, so that the jump is visible in the PDF. The sentence "Commits measure activity. They say nothing about research quality." is on screen from the first frame of that slide.
8. **Trade-off.** The speaker himself chose "single point of failure" as the one honest trade-off of the talk, so the line stays and stays strong. It is no larger than the lines "1 person." and "20 hours a week." above it. The picture is the group losing its anchor: on one click, the mark of the steward empties and the 186 marks lose their order or their lines turn dotted (deck B slide 10, deck E slide 10). No empty dashed box that looks like a missing photo. No timers: the change happens on the click.
9. **Close.** The key sentence stays on screen when the question arrives (key above, question below), in web and in print. Set the word "you" in the accent colour.
10. **The zero.** The shared font draws a slashed zero, and "000.50" at full width reads as struck out digits. Check whether the font file (`talk/shared/fonts/atkinson-hyperlegible-next-latin.woff2`) offers an unslashed zero through an OpenType feature (inspect the GSUB table, for example with fontTools if it is installed, and try `font-feature-settings` for `zero`, `ss01` to `ss05` and `cv` features in a test page with a screenshot). If one works, use it for all numerals. If none exists, leave the font as it is and say so in your report. Do not swap in a system font.
11. **Timing.** No automatic sequence longer than 1.5 s. Anything the speaker has to talk over arrives on a click.
12. **Gulu slide.** Add the nine authors: "9 authors answered 50 questions in 3 days". Keep "before the manuscript is submitted". Timeline to scale.

## Deck A, Signal (folder `talk/signal/`, a copy of deck-a without outputs)

- Volume. Capitals and full yellow fields stay on the opening, the key (slide 2), the bridge (slide 7) and the close. Every other slide goes to sentence case at lower volume, in the same face, so that the loud slides mean something. Two slides must be visibly quiet.
- Flash to the deck yellow in place of white.
- Chart colours: agent #FFD400, neutral #777777 on black. White stays for text.
- Slide 5 (role): two bands of equal height for professor and steward, counts per group, labels on one baseline.
- Slide 6: give "other" its number or drop the label. Slide 10 (Gulu): timeline to scale as in deck B slide 9.
- Slide 11 (trade-off): the 186 blocks of the role slide return and lose their order on the click as a hard cut.
- The count-up replays when the slide is entered again.

## Deck B, Ledger (folder `talk/ledger/`, a copy of deck-b without outputs)

- Opening: the number in paper colour on an ink field (#1A1714) at the full width, typed as now, then one cut to paper. This is the one full-bleed moment at the start. Keep the tally of 30 squares with the 4 filled.
- Draw every chart at parse time, so that no slide is empty if the script start is delayed (see the stage manager's code notes in r2-stage.md, section 3). Apply the timing caps given there.
- Chart colours: agent #D9541E, neutral ink #1A1714. No grey for data.
- Labels from 28 px to 32 px on the figure slides. Slide 5: the six largest types and "other".
- Slide 3 (story): remove the stick figures. Use the swap from deck A slide 3 in the Ledger style.
- Headlines: keep the finding headlines on the two commits slides. On the role, ghedata and Gulu slides shorten the headline to at most seven words.
- Share figure: show the full history from 2021 with the two windows bracketed, as deck D slide 7 does.
- Slides 11 and 12 stay two slides. Slide 11 is the key alone on blue. Slide 12 repeats the key small above the question.

## Before you report

Run the full check loop of the builders' brief (`shot.mjs --early`, look at every slide, `pdf.sh`, `pdfinfo`: the PDF has one page per slide without the holding slide). Step through the deck forwards and backwards once with a script as the stage manager did (his scripts are in `advisors/stage/`). Then report in at most 200 words: what changed per decision number, what you could not do, the slide count and the click count from holding slide to last slide. Rewrite `NOTES.md` in your folder as a short description of the deck for the speaker: concept, clicks per slide, photo slots, how to render, make the PDF and swap a photo.
