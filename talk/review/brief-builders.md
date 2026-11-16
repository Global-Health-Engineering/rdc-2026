# Brief: slide deck for a 10 minute conference talk

You build one slide deck. Four other builders build competing decks from this same brief, each with a different design direction. A panel of five advisors then scores all five. Your direction is given at the end of your task message. Commit to it fully. A deck that hedges towards the middle loses.

## The talk

- Speaker: Lars Schöbitz, Open Science Specialist (data steward) in the Global Health Engineering group (GHE) at ETH Zurich since 1 July 2021. Environmental engineer, no doctorate, no computer science degree. Works 20 hours a week.
- Event: Research Data Conference 2026 (Swiss Research Data Support Network), Bern, Thursday 19 November 2026, session "Data Stewardship", 10 minutes, second of three talks in the hour. Audience: data stewards, research software engineers, Open Science officers, librarians, a few professors. Academic, friendly, sees many slide decks full of bullet points.
- Title: "Embedded data stewardship and research intelligence: five years of practice at a research group at ETH Zurich". Authors: Lars Schöbitz, Colin Walder, Adriana Clavijo Daza, Elizabeth Tilley.
- **The one idea: "Put a data steward inside the research group."** Everything on the slides is evidence for that sentence.
- What the room should do afterwards: join the discussion on how to measure what data stewardship changes.
- Planned for 8 minutes of speaking in the 10 minute slot.

## What Lars asked for (his words, shortened)

He usually presents plain Quarto slides. For this talk he wants to try something new: Quarto revealjs slides with embedded HTML, JavaScript, D3 and animation. "It's still an academic research data conference, but it can also be bold, like the big number of funding in the beginning. It can just be the number in massive letters with a very bold, contrast-rich background. Maybe it even flashes a bit." Eight of ten slides "must just be images, figures, just a number". At most two slides may carry a bit more text with bullet points. Photos are welcome.

## The ten beats (content is fixed, the visual treatment is yours)

One beat is normally one slide. You may split a beat into two slides or let one visual persist over two beats, as long as the deck stays between 10 and 13 slides and the order of the beats holds. Where a number in this brief differs from the file, the file is right. All numbers come from `talk/shared/data.json` (also loadable as `talk/shared/data.js`, which sets `window.TALK`). Read the file first. Never type a number into a slide that is not in that file, and never invent one.

| # | Beat | What the slide has to carry | Spoken (min) |
|---|---|---|---|
| 1 | The number | CHF 35,452,000.50: the funding the group would have received if every proposal of the last five years had been funded. 30 written, 4 funded. This is the cold open: the first thing on screen, before any title. Massive, bold. | 0:45 |
| 2 | The key, first time | Put a data steward inside the research group. Title of the talk, authors and event may sit here, small. | 0:15 |
| 3 | Who can do this | The story of the computer and the dolls (see speaker notes). No doctorate, no computer science degree. A steward grows inside a group through access and practice. | 1:00 |
| 4 | The role | The layer between the professor and the staff, coaching each person. The people table of the group: 186 engagements since 2021 (theses, semester projects, staff). | 1:00 |
| 5 | ghedata | Where the opening number came from: one data package with proposals, repositories, people. Repositories by type is the figure to show here (345 repositories without the learner repositories, 97 of them data packages). | 1:00 |
| 6 | The bridge | The AI tools arrived everywhere. Here they landed because someone was inside. | 0:15 |
| 7 | The AI year | Two workshops, rules for Git, and what the commits show. The lead figure is the share of commits that carry an agent trailer: 8 percent in the twelve months before, 42 percent in the last twelve months (72 percent in data packages). Second figure: 4,890 commits against 2,183, factor 2.2. Commits per month and commits by repository type are the data. Be honest about what the types show: the largest jump is in hardware repositories (factor 15.5), where only 12 percent of commits carry an agent trailer, so more commits and agent use are two different things. The slide or the notes must also say that commits measure activity and say nothing about research quality. Do not show the factor 14.6 of the private repositories. | 1:00 |
| 8 | The result | One concrete output: the data package guluswm (household solid waste, Gulu City, Uganda). Files received 30 October 2026, 50 questions to the authors answered within 3 days, released with a DOI on 3 November 2026, before the manuscript is submitted. | 1:00 |
| 9 | The trade-off | One person, 20 hours a week, a single point of failure. | 0:30 |
| 10 | The close | The key again, then the question to the room: what would you measure to show what stewardship changes? | 0:45 |
| end | Last slide, unspoken | Workshop tomorrow (Git for Scientists, Friday 09:30, room Wytsicht), link to ghedata, link to the slides repository, one line that these slides were built with Claude Code and that the full declaration is in the repository, the four authors. | 0:00 |

## Speaker notes (use these as the `::: notes` of each beat; you may trim, do not embellish)

1. "35 million, 452 thousand Swiss francs and 50 Rappen. That is the funding our group would have received if every proposal of the last five years had been funded. We wrote 30. Four were funded. I can tell you this to the Rappen because I sit inside the group."
2. "That is my one point for the next eight minutes. Put a data steward inside the research group."
3. "I have no doctorate. I have no degree in statistics or computer science. I am an environmental engineer who likes computers. When I was eight, my dad gave me a computer and my sister the dolls. I believe that if it had been the other way round, she would be standing here today. Nobody is born a data steward. You become one through access and practice, inside a group."
4. "I am the layer between the professor and everyone else. Since 2021 our group has counted 186 theses, semester projects and positions, from bachelor students to senior scientists. Each person arrives with different skills and different gaps. A course cannot cover that. Sitting next to them can."
5. "The number at the start came out of a data package. We call it ghedata. It holds our proposals, our repositories, our people. 345 repositories, and 97 of them are data packages. We treat our own group as a dataset."
6. "Then the AI tools arrived. They arrived everywhere. In our group they became daily practice within a year, because someone inside ran the workshops, set the rules and sat next to each person."
7. "Two workshops. One rule: everything goes through Git, and every commit made with an agent says so. That rule lets us count. In the twelve months before, 8 percent of our commits were made with an agent. In the last twelve months it is 42 percent, and 72 percent in our data packages. We also commit more, 2.2 times as much. But look at the types: the biggest jump is in hardware projects, where agents play a small part. A commit is activity. It does not tell you the research is better."
8. "So here is one result. On 30 October, colleagues in Uganda sent me three files on household waste in Gulu City. We sent back 50 questions. They answered all of them in three days. On 3 November the data had a DOI, before the paper is submitted. Every number in the manuscript was checked against the data, and the full trail is on GitHub."
9. "The trade-off: this is one person, 20 hours a week. If I leave, a lot leaves with me. An embedded steward is a single point of failure."
10. "Put a data steward inside the research group. And then help us with the open question: what would you measure to show what stewardship changes? Come and find me."

## Hard requirements

1. **Format.** One Quarto revealjs file, `deck.qmd`, in your folder, plus one `deck.scss` and any assets in your folder. Start from the working skeleton in `talk/tools/skeleton/` (read `skeleton.qmd` and `skeleton.scss`): 1600 by 900, `embed-resources: true`, font and D3 included from `talk/shared/`. Render with `/Applications/RStudio.app/Contents/Resources/app/quarto/bin/quarto render deck.qmd` (quarto is not on the PATH). The result is one self-contained `deck.html` that runs without a network connection. No CDN, no web fonts from a server, no external request at all.
2. **Eight of ten visual.** At least 80 percent of the slides are one number, one figure, one image or one short sentence, with at most 12 words on the slide. At most two slides may carry text with bullets, with at most four bullets of at most eight words each.
3. **Clicker only.** Lars presents with a clicker that sends "next" and "previous". Every animation and every reveal runs on entering a slide or on the next fragment. Nothing may need a mouse, a hover or a key other than next and previous. Hover extras are allowed if the slide is complete without them. Going back with "previous" must not break a slide.
4. **Prints to PDF.** The organisers need a 16:9 PDF two days before the talk. Every slide must have a meaningful final state that prints: when the URL contains `print-pdf`, show the final state of every animation with all fragments visible. The skeleton shows the pattern (final state in the HTML, script animates towards it). Create the PDF with `sh talk/tools/pdf.sh deck.html deck.pdf` and check it with `pdfinfo deck.pdf` (page count equals slide count, page size 16:9) and by reading two or three pages as images.
5. **Legible from the back of a room.** No text on a slide below 28 px at the 1600 by 900 design size, except source lines and the unspoken last slide (not below 20 px). Contrast of text against its background at least 7 to 1. Charts need direct labels in place of legends where possible, and no chart may depend on telling red from green.
6. **Flashing.** If something flashes, it flashes at most three times in a second, for at most one second in total, and never full screen between saturated red and another colour. One strong flash or pulse is enough. Respect `prefers-reduced-motion`: with it set, show the final state.
7. **Honest figures.** Bar and area charts start at zero. A factor is shown with both absolute numbers. The proposal numbers are placeholders: put a small removable marker with the class `draft-flag` and the text "placeholder" on every slide that shows them.
8. **Figures are drawn by code in the deck.** Every chart is drawn in the deck by JavaScript (D3 from `talk/shared/d3.v7.min.js`) from `window.TALK`. No pre-rendered chart image.
9. **Photos.** Available in `talk/shared/img/`: `workshop-hackathon-2024.jpeg` (a real workshop of the group, six people at laptops, public on the openwashdata website, 3957 by 2225), `lars_schoebitz_profile_photo.jpg` (768 by 1024), `kiteezi-landfill-kampala-uganda.jpg` (800 by 532, small), `rdc-2026-bern.png`, `commit-with-prompts.png` (screenshot of a commit with an agent trailer). Look at them before use. Lars will add more of his own workshop photos later. Where your design wants a photo that does not exist, build a clearly marked photo slot: a block with the class `photo-slot`, a visible label that says which photo belongs there (for example "Photo: Lars at eight with his first computer") and the file name he should drop in. Do not download images from the internet and do not generate images.
10. **Privacy.** No name of a student, no name of a private repository, no personal data beyond the four authors. The Gulu authors are "colleagues in Uganda" on the slides; the package name and DOI are public.
11. **Writing rules for every word on a slide and in the notes** (these are Lars's standing rules): no em dash anywhere; no emojis; the words "deadline", "simply", "simple", "easy" and "master" (for a branch) are not used; no sentence of the pattern "X, not Y" or "not X, but Y"; colons and semicolons sparingly; plain everyday words, no jargon, no slogans, British spelling. Swiss number format on slides is fine (35'452'000.50) and so is 35,452,000.50; pick one and keep it.
12. **Stay in your folder.** Write only inside your deck folder `talk/deck-<letter>/`. Do not edit `talk/shared/`, `talk/tools/` or anything else in the repository. No git commands that change anything (no add, commit, checkout, stash, push). Do not install software.

## How to check your work (required before you report)

- `node talk/tools/shot.mjs talk/deck-<letter>/deck.html talk/deck-<letter>/shots --early` writes one PNG per slide in the settled state, one early frame per slide, a contact sheet `sheet.png` and `report.json` with overflow and console errors. Look at the contact sheet and at every single slide image yourself. Fix what you see: overflow, tiny text, overlapping labels, empty slides, charts without data, console errors. Repeat until the deck is clean. Expect to go round this loop several times.
- Create and check the PDF as described above.
- Count the slides that break the 12 word limit. More than two means cutting.

## What you report back (short)

Your final message is read by the coordinator, in at most 200 words: the path of `deck.qmd`, `deck.html`, `deck.pdf` and `shots/sheet.png`, the number of slides, a one paragraph description of the concept and of each interactive or animated element, what you could not get right, and where photo slots wait for a photo. Also write the same text to `talk/deck-<letter>/NOTES.md`.
