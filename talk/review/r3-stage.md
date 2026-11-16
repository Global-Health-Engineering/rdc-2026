# Round 3, stage manager

All tests run again on `talk/signal/` and `talk/ledger/` with the scripts in `advisors/stage/`.

## 1. Scores

| Criterion | Weight | Signal | Ledger |
|---|---|---|---|
| One idea | 20 | 5 | 4 |
| Opening | 15 | 5 | 4 |
| Visual craft | 15 | 4 | 4 |
| Honest data | 15 | 5 | 5 |
| Fit with the room | 10 | 4 | 5 |
| Motion | 10 | 5 | 4 |
| Production safety | 10 | 5 | 5 |
| 80 percent rule | 5 | 5 | 3 |
| **Total** | 100 | **95** | **86** |
| Round 2 | | 81 | 76 |

## 2. Tests and must-do items

Both decks pass every test. Nothing fails.

- Clicks from the holding slide to the last slide: Signal 22, Ledger 20.
- External requests: 0 in both, so no request can hang.
- Forward, back, jump, reload on a middle slide, fast and early clicking: every state identical on all paths.
- Replay from the holding slide: the count restarts and the fragments are hidden again, in both.
- 1024 by 768 and 1280 by 720: no overflow.
- PDF: Signal 13 pages, Ledger 14, all complete, the story slide in the true state.
- Opening: Signal cuts black to yellow and back once (about 130 ms). Ledger counts on dark and cuts to paper once after 1.0 s.

**Signal.** All six items done. Remaining:

- Slide 2: the flash is still a full-screen swing, inside the limit and milder than the white one.
- Slide 10: 33 text elements, smallest 30 px, the slide a 1024 pixel projector strains most.
- 22 clicks in 8 minutes, two each on slides 2 and 5.

**Ledger.** All six items done. Remaining:

- Slide 12: the click turns one dot hollow and the lines dotted. From the back the change is hard to see.
- Slides 6, 7, 9, 10, 11: sources at 20 px, which is 13 px on a 1024 pixel projector.
- Slide 9: 62 monthly bars are thin.

## 3. Pick

Signal for the stage. Every change is a hard cut on a click and nothing runs on a timer. Keep Ledger as the PDF for the organisers and Zenodo (sources, snapshot dates, the table on slide 10, 2.6 MB against 7.3 MB) and as the stage deck for a bright room with a weak projector.

## 4. For the speaker

Find out which machine runs the deck. From the organisers' laptop with the PDF, the count-up, the swap and the falling blocks are gone. Rehearse once from the HTML with the clicker, starting on the black slide, and once from the PDF.
