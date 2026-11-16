# Signal

Slide deck for the talk at the Research Data Conference 2026. This is the revised version of `talk/deck-a/`.

## Concept

Black, white and one yellow (#FFD400). Grey (#777777) is used only for data marks. Four slides are loud, in capitals: the number, the key sentence, the bridge and the close. The figure slides carry one headline at the top left and one figure that fills the slide. Numbers that are spoken are in the speaker notes and not on the slide. All changes are hard cuts on a click. No sequence that runs by itself is longer than 1.2 seconds. Every number is read from `../shared/data.js`.

The shared font draws a slashed zero. The font file has no OpenType feature for an unslashed zero (its features are ccmp, frac, locl, pnum and tnum), so the zero stays as it is.

## Slides and clicks

21 clicks from the holding slide to the last slide. The speaker notes mark every click with "[click]". "Clicks" counts the clicks on a slide after it has appeared.

| # | Slide | Clicks | What the clicks do |
|---|---|---|---|
| 0 | Holding slide, black | 0 | The next click starts the number |
| 1 | The number | 2 | Count-up and one yellow flash on entry, then "30 written", then ", 4 funded" on the same line |
| 2 | Key sentence, authors and group below | 0 | |
| 3 | No doctorate | 0 | |
| 4 | Computer and dolls | 2 | The two rows swap, then "Nobody is born a data steward." and the rows return to the true state |
| 5 | Role figure: professor, five groups, data steward | 0 | |
| 6 | Repositories by type, bars | 0 | |
| 7 | Bridge, workshop photo | 1 | "Here, someone was inside." |
| 8 | Commits per month by people since 2021 | 1 | The part made with an agent in yellow |
| 9 | Commits by repository type, bars | 0 | |
| 10 | guluswm timeline | 0 | |
| 11 | Trade-off, the role figure again | 1 | The data steward bar becomes an empty outline and its links go |
| 12 | Close | 1 | Key moves into a band, the question appears below |
| 13 | Last slide | 0 | |

Going back to the holding slide and forward again replays the count-up. The PDF has 13 pages, without the holding slide, and shows every slide in its state after the last click.

## Photo slots

One slot, on slide 4: Lars at eight with his first computer. Slide 7 uses `../shared/img/workshop-hackathon-2024.jpeg` in black and white.

To add the photo:

1. Save the file as `img/lars-first-computer.jpg` in this folder.
2. Render again. The photo appears on the left in black and white, cropped to 500 by 820 pixels, and the two rows move to the right.

Without the file the slide shows no photo and no placeholder, and the text takes the full width. The render then prints the warning "Could not fetch resource img/lars-first-computer.jpg", which can be ignored.

## Render

From this folder:

```sh
/Applications/RStudio.app/Contents/Resources/app/quarto/bin/quarto render deck.qmd
```

The result is `deck.html`, one file that runs without a network connection.

## PDF and checks

From the `talk` folder:

```sh
sh tools/pdf.sh signal/deck.html signal/deck.pdf
pdfinfo signal/deck.pdf
node tools/shot.mjs signal/deck.html signal/shots --early
```

`pdfinfo` should report 13 pages of 1200 by 675 pt. `shots/sheet.png` shows all slides in their final state on screen.

## Before the talk

- The proposal numbers on slide 1 are placeholders. Remove the `draft-flag` line in `deck.qmd` once the numbers are final.
- With "Reduce motion" switched on in the system settings, nothing animates and every slide shows its final state.
