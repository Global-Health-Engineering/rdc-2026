# Advisor brief: judging five slide decks for one talk

You are one of five advisors on a panel. Five builders each made a slide deck for the same 10 minute talk from the same brief. The panel scores, ranks and discusses them so that the speaker ends up with one or two decks worth rehearsing. You judge from your own role (given in your task message) and you are expected to disagree with the others where your role sees something they cannot.

## Read first

- The builders' brief, which holds the talk, the audience, the ten beats, the speaker notes and the hard requirements: `talk/tools/BRIEF.md`
- The numbers: `talk/shared/data.json`

## The decks

In `talk/`, folders `deck-a` (Signal: brutalist type, black, white, yellow), `deck-b` (Ledger: editorial data journalism on paper), `deck-c` (Every dot is one thing: unit charts that regroup), `deck-d` (People in the room: photo led), `deck-e` (The talk is a commit history). Each folder holds:

- `shots/sheet.png`: contact sheet of all slides in their settled state. Start here.
- `shots/NN.png`: every slide at 1920 by 1080 in its settled state. `shots/NN-early.png`: the same slide 350 ms after it is entered, before fragments. Read every settled slide of every deck as an image. A judgement from the contact sheet alone is not accepted.
- `shots/report.json`: words per slide, overflow in pixels, console errors.
- `deck.qmd` and `deck.scss`: the source, with the speaker notes and the animation code. Read the code of the animated slides to judge motion you cannot see in a still.
- `deck.pdf`: what the organisers receive.
- `NOTES.md`: the builder's own description. Treat it as a claim to verify.

Photo slots (labelled panels that wait for one of the speaker's own photos) are part of the draft. Judge whether the slot is the right idea for the slide and assume a decent photo will fill it.

You are read-only. Do not change any file in the deck folders. You may run `node talk/tools/shot.mjs` into a folder inside your own output folder if you need another capture.

## Rubric

Score every deck on every criterion from 1 to 5 (1 fails, 3 acceptable, 5 excellent, whole numbers). The weighted total is out of 100.

| # | Criterion | Weight | What a 5 looks like |
|---|---|---|---|
| 1 | One idea | 20 | "Put a data steward inside the research group" is the thing a listener repeats the next day. Every slide is evidence for it. The key returns at the close in a recognisable form. |
| 2 | Opening | 15 | The first ten seconds stop the room: the number is massive, the moment it lands is felt, and "30 written, 4 funded" follows cleanly. Bold without being a stunt. |
| 3 | Visual craft and legibility | 15 | Readable from the last row, strong contrast, clean alignment, no overflow, no clutter, one consistent visual language. |
| 4 | Honest data | 15 | Charts start at zero, factors come with absolute numbers, the commit figures do not oversell, the placeholder is marked, each figure shows one finding at a glance. |
| 5 | Fit with the room | 10 | Bold and still credible at an academic research data conference. A sceptical data steward from a central service would respect it. |
| 6 | Motion and interaction | 10 | Animation carries meaning (it shows change, order or emphasis) and works with a clicker alone, also when stepping backwards. |
| 7 | Production safety | 10 | Self-contained, no console errors, the PDF shows every slide in a complete final state, flashing within the limits, nothing that can fail on a foreign projector. |
| 8 | The 80 percent rule | 5 | At least 8 of 10 slides are a number, a figure, an image or one short sentence. At most two text slides. |

Weighted total = sum over criteria of (score / 5 × weight).

## Round 1: what you write

Write your report to the file named in your task message. Structure:

1. A score table: decks as columns, the eight criteria as rows, the weighted total in the last row.
2. Your ranking from first to fifth.
3. Per deck, at most 120 words: the strongest slide, the weakest slide (by slide number), and the one thing that would cost it the room.
4. For your top two decks: up to five concrete changes each, most important first, each naming the slide number and what to do. Include good ideas from the other decks that should be carried over, naming the deck and slide they come from.
5. Anything in the talk itself (the beats, the notes, the numbers) that your role would challenge, at most 100 words.

Be specific and unsparing. "Slide 7: the axis labels are 18 px and the two series cannot be told apart" helps. "Could be more engaging" does not. Then reply to the coordinator with your ranking and totals in at most 80 words.
