# Deck E: the talk is a commit history

Files in `talk/deck-e/`: `deck.qmd`, `deck.html`, `deck.pdf`, `shots/sheet.png` (plus `deck.scss`, `deck.js`, `pdf.mjs`). 13 slides.

## Concept

Dark editor theme, one amber accent. A commit graph runs down the left edge of every slide: one node per slide, the current one filled; the AI half forks off as a branch at the bridge and merges at the close. Each slide ends in one monospace commit line.

## Animated elements

- Number: counts up on dark, lands with one flash to an amber field.
- Role: 186 dots fill in behind the steward node.
- Repositories: bars grow.
- Agent share: squares (10 commits each) fill month by month, agent commits in amber.
- Types: bars grow, agent part last.
- Gulu: timeline draws.
- Trade-off: the single node empties.
- Bridge: one fragment.

## Not right yet

- `talk/tools/pdf.sh` gives one blank page here (also for the skeleton). The PDF was made with `node pdf.mjs deck.html deck.pdf`: 13 pages, 16:9.
- Slide 2 (title block) and the last slide exceed 12 words. Chart labels are not counted.
- The notes call hardware the biggest jump; student projects have a higher factor (19.1), so the slide only states 15.5.

## Photo slot

Slide 3: Lars at eight with his first computer, `deck-e/img/lars-at-eight.jpg`.
