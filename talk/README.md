# Talk: Embedded data stewardship and research intelligence

Slides for the talk at the Research Data Conference 2026 in Bern, Thursday 19 November 2026, session Data Stewardship, 10 minutes. Authors: Lars Schöbitz, Colin Walder, Adriana Clavijo Daza, Elizabeth Tilley (Global Health Engineering, ETH Zurich).

The deck that is presented is in `ledger/`. The other folders show how it came about.

## How the deck was made

1. **Brief.** `tools/BRIEF.md` states the talk, the audience, the ten beats and the requirements. All numbers come from `shared/data.json`.
2. **Five decks.** Five coding agents each built one deck from the brief, each with a different design direction: `deck-a` (Signal), `deck-b` (Ledger), `deck-c` (unit charts), `deck-d` (photo led), `deck-e` (the talk as a commit history).
3. **Panel.** Five reviewing agents, each in a role (speaking coach, information designer, a data steward in the audience, the professor, the stage technician), scored and ranked the decks over several rounds. Briefs, every review and the summary are in `review/`.
4. **Two revised decks.** The two decks the panel chose were revised into `signal/` and `ledger/`.
5. **The speaker's choice and rework.** Lars chose Ledger and reworked it over several sessions: real proposal numbers, the colours of the GHE Colour Palette, counts for group members only, and new slides from his own notes. `ledger/NOTES.md` describes the deck as it stands.

The full account of how AI tools were used is in [AI-USE.md](AI-USE.md).

## What is in each deck folder

- `deck.qmd`: the slides (Quarto revealjs, raw HTML blocks) and the speaker notes
- `deck.scss`: the styles
- `deck.js`: the figures, drawn with D3 from the data file (Ledger and Signal; the five first decks keep their code in `deck.qmd`)
- `NOTES.md`: the concept, the slide order and the clicks

Rendered decks, PDFs and screenshots are not in the repository. They are rebuilt from the sources.

## Rebuild

The numbers, from the repository root. This needs a local clone of the [ghedata](https://github.com/Global-Health-Engineering/ghedata) package; its path is set at the top of the script.

```sh
Rscript talk/tools/make_data.R
```

The deck, the PDF and the screenshots, from `talk/ledger/`. The PDF and screenshot scripts call Google Chrome at its macOS path.

```sh
quarto render deck.qmd
sh ../tools/pdf.sh deck.html deck.pdf
node ../tools/shot.mjs deck.html shots --early
```

## Where the numbers come from

- Every number and every figure on a slide is read from `shared/data.json`, which `tools/make_data.R` builds from ghedata.
- The numbers in the speaker notes are typed by hand and have to be checked against the data file after each rebuild.
- Who counts as a group member in the commit figures comes from a lookup file that is not part of any repository, because it holds GitHub logins.

## Images

`shared/img/` holds the images the decks use. The workshop photo `workshop-hackathon-2024.jpeg` is not in the repository; the decks that use it show an empty frame without it.
