# Ledger

## Concept

Paper, ink and one purple. The colours are from the GHE Colour Palette: purple `#901C6C` for the marks, indigo `#3C2874` for the second colour and teal `#1E8B99` for the third series on slide 12. Each figure slide is one figure with one short headline; the numbers are in the speaker notes. The deck opens on the title slide; the amount is typed in paper colour on ink and then cuts to paper. Every number is read from `../shared/data.js`.

## Slides and clicks

Every click inside a slide is marked "[click]" in the speaker notes. The PDF has 18 pages, one per slide.

| Slide | Content | Clicks on the slide |
|---|---|---|
| 1 | Title, authors, event; on the screen before the talk | 0 |
| 2 | The number, "requested since 2021" | 1: one square per proposal with the proposals written and funded |
| 3 | "Why do we know this so exactly?" | 0 |
| 4 | "We keep data on our own group": what ghedata holds, five rows (bullets) | 0 |
| 5 | The key | 0 |
| 6 | "No doctorate. No qualification in statistics. No computer science degree." | 2: "An environmental engineer who likes computers.", then "Empathy, patience and persistence." |
| 7 | Fixed mindset and growth mindset (from the 17:15 Kolloquium slide of 21 November 2024) | 1: "One to one. Workshops. Strategy. Motivation." |
| 8 | "Voices from GHE": two voices from the group on why the steward sits inside it, Jules (doctoral student) and Elizabeth (head of the group) | 0 |
| 9 | Tools and teaching from inside the group: five steps from 2025 to 2027 (bullets) | 0 |
| 10 | Photos: three photos of the Agents for Scientists workshop of 29 September 2026, side by side | 0 |
| 11 | Third part: "Keep data on your own group, and you know what is going on.", with "Examples of what we measure" | 0 |
| 12 | Student theses and projects by degree and year; a line says that each column counts the students who started in that year | 0 |
| 13 | GitHub repositories, sorted by what they hold | 0 |
| 14 | Commits per month by group members | 1: the part made with an agent |
| 15 | Commits by group member, ranked, without names: each bar is one person; a dot for each person who took a workshop, an empty box for those without a commit since | 0 |
| 16 | Headline "GitHub activity as an indicator for competency?" and a reviewer's caution that commits are imperfect proxies for competency (quoted from the decision letter of a rejected proposal, April 2026) | 0 |
| 17 | The three sentences (keep data on your own group, place a data steward inside it, know what is going on), small, and the question "What would you measure to show what data stewardship changes?" | 0 |
| 18 | "Thank you", workshop, authors, links to ghedata and the slides, Lars's GitHub, LinkedIn and newsletter, a link to the declaration of AI use, figures line | 0 |

Slide numbers show bottom right from slide 3 on (the two opening slides are dark).

Nothing runs by itself for longer than 1.5 seconds. Only data moves; text cuts in. Going back shows a slide in its final state. Going back to the title slide and forward again replays the opening.

## Open in the notes of deck.qmd

- Slide 4: "Place a data steward" chosen on 16 November (slides 5 and 17).
- Slide 8: the two quotes are drafted from my notes of the group meeting of 16 November; both people confirm their sentence, and Jules that the first name may stand on the slide.
- Slide 10: the three photos are in `img/` (reduced copies of the originals). Two of them show recognisable people; they stay out of git until everyone on them has agreed.

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
- Two proposals have no budget in the sheet and are not part of the amount on slide 2.
- Slides 14 and 15 count the same commits: made by group members, without bots, automated pushes and workshop exercises. Who is a member comes from a private lookup file (GHE_PEOPLE_LOOKUP in ~/.Renviron), complete for November 2024 to October 2026; in the months before, everyone counts except the people named there as outside the group.
