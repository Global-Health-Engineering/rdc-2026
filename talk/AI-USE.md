# Use of AI tools in this talk

Draft of 16 November 2026, written by Claude Code from the record of the work, for Lars to correct.

The last slide of the deck says: "These slides were built with Claude Code. The full declaration is in the slides repository." This is that declaration.

## Tool

Claude Code (Anthropic), run on the speaker's laptop in several sessions between 11 and 16 November 2026.

## What the speaker did

- The idea and the argument of the talk, the key sentence and the question to the room.
- The abstract, written with the co-authors.
- The brief for the slides: the content of each part, the speaker notes, and the wish for a deck with few words, large numbers and figures drawn in the browser.
- The data: the proposals table, the people table and the rules of the group for Git, kept over five years.
- Every decision on content: which deck to use, which numbers to show, how to count (every proposal since 2021, group members only, workshop exercises left out), who is a group member, which colours, and which slides to add or drop.
- Review of each version, with corrections written into the speaker notes.

## What Claude Code did

- **Five decks.** Five agents each built a complete slide deck from the same brief, each in a different design direction.
- **A panel.** Five further agents, each in a role, scored and ranked the five decks over several rounds and wrote reports. The two decks they ranked highest were revised.
- **The final deck.** All code of the deck the speaker chose: the HTML of the slides, the styles and the JavaScript that draws the figures.
- **The numbers.** The scripts that read the tables of the ghedata package and write the data file of the deck, and the scripts in ghedata that count proposals and commits.
- **Text.** First versions of the speaker notes from the brief, and the wording of slides the speaker asked for in his notes. The speaker changed and approved them.
- **Checks.** Rendering, screenshots of every slide, the PDF, and checks of contrast and colour vision for the palette.

## What this means for the slides

- No step of rendering the slides calls an AI tool. The slides are rebuilt from the sources with R, Quarto and a browser.
- Every number and figure on a slide is computed from data. The numbers in the speaker notes are typed by hand.
- The figures are JavaScript that an agent wrote. The speaker can read what it does and cannot yet write or maintain it without help. This departs from his usual practice, where figures come from R code he writes himself.

## Record

The brief, all seven decks, every review of the panel and the summary are in this folder, so the way the deck came about can be followed. See [README.md](README.md).
