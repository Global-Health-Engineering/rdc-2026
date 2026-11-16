# RDC 2026 talk: five decks, one panel, two decks for you

11 November 2026. Everything is local and uncommitted.

## The result

| Deck | Use | Open |
|---|---|---|
| **Signal** (black, white, yellow, heavy type, hard cuts) | The stage. All five advisors pick it. | `talk/signal/deck.html` |
| **Ledger** (paper, ink, orange and blue, figures with headlines and sources) | The PDF for the organisers and Zenodo, and the fallback if the session runs from the organisers' laptop. | `talk/ledger/deck.html` |

Both are one Quarto revealjs file (`deck.qmd`, `deck.scss`, `deck.js`) with D3 figures drawn from `talk/shared/data.json`. Both run without a network connection, start on a dark holding slide, and work with next and previous only: Signal 23 clicks, Ledger 20. Each has a `deck.pdf` (16:9, 13 and 14 pages), a contact sheet in `shots/sheet.png` and a `NOTES.md` with the clicks per slide and how to render. The three other decks stay in `talk/deck-c`, `deck-d`, `deck-e` for comparison, and the first versions of the two winners in `deck-a` and `deck-b`.

## How it went

Five builders, one direction each: A Signal, B Ledger, C unit dots that regroup, D photo led, E the talk as a commit history. Five advisors scored them on eight weighted criteria: a speaking coach (Milligan), an information designer, a data steward from a central service in row seven, the professor as co-author, a stage manager who ran every deck.

| Round | A / Signal | B / Ledger | C | D | E |
|---|---|---|---|---|---|
| 1, independent scores | 83.0 | 81.2 | 75.4 | 75.0 | 73.6 |
| 2, after reading each other | 81.4 | 77.6 | | | |
| 3, after the revision | 92.6 | 86.2 | | | |

Round 2 split three to two. Coach, designer and stage manager wanted A because every reveal sits on a click where the speaker changes sentence. Audience and professor wanted B because its commits table is the slide that makes them believe you, and because A read as "an order about my job". The revision took A's volume down (capitals only on the opening, the key, the bridge and the close) and gave B a dark opening. After that all five picked Signal.

## What I decided where the panel disagreed

- **Trade-off slide.** The professor wanted the hours as the punchline, since "single point of failure" in large type is what a department head quotes against the model. You chose that trade-off yourself, so the line stays, at the same size as the two lines above it. The picture shows the work standing and the support going: the 186 marks keep their order, the steward mark empties.
- **Role slide.** No deck may draw you as a gate between Liz and the group. She connects to all five groups ("supervises each one"), you sit beside ("sits next to each one"). The spoken line "I am the layer between" is replaced in the notes.
- **Not carried over:** the ring picture of C (it draws 14 other groups without data), the empty chair of D, headlines that arrive on a click in Ledger.
- **Carried over:** the tally of 30 squares, the swap of computer and dolls on a click, "Nobody is born a data steward.", "Here, someone was inside.", the full commit history since 2021.

## What the data says, and what it does to the talk

Updated after the look into the hardware jump.

- **The hardware jump was a sensor.** 1,223 commits in March and April 2026 were hourly data pushes by a device under a person's account, and 213 more came from a second logger. ghedata now counts three kinds apart: commits by people, commits by bots and GitHub Actions, and automated pushes (patterns in `data-raw/github_automated_commits.csv`).
- **Not on the slides.** Automated pushes are left out of every number and are not drawn or mentioned in either deck (decided 11 November).
- **Commits by people:** 2,079 in the twelve months to October 2025, 3,407 in the twelve months to October 2026, factor 1.6. The "tenfold" and the 2.2 are gone.
- **With an agent trailer:** 167 then, 2,046 now. That is 8 percent then and 60 percent now, 72 percent in data packages. Commits by people without an agent fell from 1,912 to 1,361.
- **Marking is not only you.** In the 19 most active repositories, seven other authors add the trailer and account for 676 of 854 marked commits.
- **Under-reporting:** about 225 more commits in those repositories look agent made and carry no trailer (one repository with a `CLAUDE.md` and no trailer at all, one that is half marked). The 60 percent is a lower bound; with those hints it is nearer 73 percent in the active repositories. This estimate is from commit messages and config files and is not in ghedata.
- **1,319 of the 2,046 agent commits fall in September and October 2026.**
- ghedata: `github_commits_by_type` and the new column `commits_automated` are built, tests pass, README and article updated. Uncommitted on `dev`.

## Open, for you

1. **Proposal numbers.** CHF 35,452,000.50, 30 and 4 are placeholders and carry a "placeholder" flag on the opening. The label now reads "requested in five years". Liz should see the real numbers before the PDF goes out.
2. **Photo.** One slot waits in both decks: you at eight with your first computer (`img/lars-first-computer.jpg` in Signal, `img/lars-at-eight.jpg` in Ledger). I found one real workshop photo (the 2024 hackathon); your other workshop photos are not in the repositories.
3. **Which PDF goes to the organisers on 17 November:** Ledger (the panel's advice) or Signal.
4. **Trade-off wording:** keep it, or follow the professor and put the hours in the accent colour too.
5. **One sentence for the central stewards in the room**, spoken on the key or the role slide: what the central service does when a steward sits inside a group. The audience advisor says it decides whether half the room hears a colleague or a competitor.
6. **The sentence after "a single point of failure"**: what is already in Git and ghedata so that less leaves with you, and what you ask for.
7. Still open from yesterday: co-authors agree to the AI half, the colleagues in Uganda agree to the Gulu slide, the abstract says five ORD projects and the slides show none.
8. **The zero.** The font draws a slashed zero and has no other form, so "000.50" looks struck through at full width. Another font for the number is your call.
9. **Rehearsal:** once from the HTML with the clicker from the black slide, once from the PDF. Check that "Reduce motion" is off on the laptop.

## Where things are

- Decks, shared data, tools: `talk/` (untracked on `dev`). Numbers rebuild with `Rscript talk/tools/make_data.R`.
- All 15 advisor reports and the three briefs: this folder (`talk/review/`).
- Nothing was committed, pushed, sent or published.
