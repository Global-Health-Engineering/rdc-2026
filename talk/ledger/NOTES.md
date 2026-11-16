# Ledger

## Concept

Paper, ink and one purple. The colours are from the GHE Colour Palette: purple `#901C6C` for the marks, indigo `#3C2874` for the second colour and teal `#1E8B99` for the third series on slide 7. Each figure slide is one figure with one short headline; the numbers are in the speaker notes. The deck opens on the title slide; the amount is typed in paper colour on ink and then cuts to paper. Every number is read from `../shared/data.js`.

## Slides and clicks

Every click inside a slide is marked "[click]" in the speaker notes. The PDF has 18 pages, one per slide.

| Slide | Content | Clicks on the slide |
|---|---|---|
| 1 | Title, authors, event; on the screen before the talk | 0 |
| 2 | The number, "requested since 2020" | 1: one square per proposal with the proposals written and funded |
| 3 | "Why do we know this so exactly?" | 0 |
| 4 | "We keep data on our own group": what ghedata holds, four rows (bullets) | 0 |
| 5 | The key | 0 |
| 6 | "No doctorate. No qualification in statistics. No computer science degree." | 2: "An environmental engineer who likes computers.", then "Empathy, patience and persistence." |
| 7 | Fixed mindset and growth mindset (from the 17:15 Kolloquium slide of 21 November 2024) | 1: "One to one. Workshops. Strategy. Motivation." |
| 8 | Student theses and projects by degree and year | 0 |
| 9 | Tools and teaching from inside the group: five steps from 2025 to 2027 (bullets) | 0 |
| 10 | Photos: one workshop photo and two photo slots | 0 |
| 11 | Repositories by type | 0 |
| 12 | Commits per month by group members | 1: the part made with an agent |
| 13 | "Trained is not yet practising": commits by group member, ranked, without names; a dot for each person who took a workshop, an empty box for those without a commit since | 0 |
| 14 | guluswm: open data before the paper | 0 |
| 15 | Funding brought in by the data steward; the trade-off is in the notes | 0 |
| 16 | "A group that knows its own data can decide." on indigo | 0 |
| 17 | The key again, small, and the question | 0 |
| 18 | Workshop, links, DOI, authors, figures line | 0 |

Nothing runs by itself for longer than 1.5 seconds. Only data moves; text cuts in. Going back shows a slide in its final state. Going back to the title slide and forward again replays the opening.

## Open in the notes of deck.qmd

- Slide 4: "Place a data steward" chosen on 16 November (slides 5 and 17).
- Slide 10: two photo slots wait for a file each (`img/gitforsci-2026-07.jpg`, `img/agentsforsci-2026-09.jpg`). The comment above the slide in `deck.qmd` says how to fill them. The slots have to be filled or removed before the PDF goes to the organisers.

## Render and PDF

From `talk/ledger/`:

```sh
/Applications/RStudio.app/Contents/Resources/app/quarto/bin/quarto render deck.qmd
sh ../tools/pdf.sh deck.html deck.pdf
pdfinfo deck.pdf
```

Screenshots of every slide, from `talk/`:

```sh
node tools/shot.mjs ledger/deck.html ledger/shots --early
```

## Known limits

- The shared font has no unslashed zero (its GSUB table holds only ccmp, frac, locl, pnum and tnum).
- Six proposals have no budget or no currency in the sheet and are not part of the amount on slide 1.
- Slides 12 and 13 count the same commits: made by group members, without bots, automated pushes and workshop exercises. Who is a member comes from a private lookup file (GHE_PEOPLE_LOOKUP in ~/.Renviron), complete for November 2024 to October 2026; in the months before, everyone counts except the people named there as outside the group.
