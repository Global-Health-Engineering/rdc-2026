# Round 1: the speaking coach

Read: the brief, the data file, the speaker's notes on "The Motivated Speaker", all five contact sheets, every settled slide of every deck as an image (65 slides), the early frames of the opening and closing slides, each `deck.qmd` with its notes, each `NOTES.md`, and the timing code of the animated slides.

My question for every slide: what does the speaker say while this is on screen, and does the slide wait for him or does he wait for the slide?

## 1. Scores

| # | Criterion | Weight | A Signal | B Ledger | C Dots | D People | E Commits |
|---|---|---|---|---|---|---|---|
| 1 | One idea | 20 | 5 | 4 | 4 | 5 | 4 |
| 2 | Opening | 15 | 5 | 3 | 4 | 4 | 4 |
| 3 | Visual craft and legibility | 15 | 4 | 4 | 3 | 4 | 4 |
| 4 | Honest data | 15 | 4 | 5 | 4 | 5 | 4 |
| 5 | Fit with the room | 10 | 3 | 5 | 4 | 5 | 4 |
| 6 | Motion and interaction | 10 | 5 | 4 | 3 | 3 | 4 |
| 7 | Production safety | 10 | 4 | 5 | 3 | 3 | 3 |
| 8 | The 80 percent rule | 5 | 5 | 2 | 5 | 3 | 3 |
| | **Weighted total** | 100 | **88** | **82** | **74** | **84** | **77** |

Where my role moves a score away from what the others will likely give:

- Motion. I score what the motion does to the speaker. Deck C has 15 fragment clicks on top of 13 slides, and every one starts a 900 ms staggered regrouping. That is about 28 clicks to remember under stress and close to half a minute of the eight spent watching marks travel. Deck A cuts hard and puts its fragments exactly where the notes change sentence.
- Opening. "30 written, 4 funded" has to arrive after he says it. Only A and C give the two numbers their own clicks. B gives them one click together. D and E show them from the first frame, so the room has read the punchline before he speaks.
- The 80 percent rule. I count what the room reads while he talks. In B a sentence headline sits on slides 4, 5, 7, 8 and 9 and says what he is about to say.

## 2. Ranking

1. Deck A, Signal (88)
2. Deck D, People in the room (84)
3. Deck B, Ledger (82)
4. Deck E, Commit history (77)
5. Deck C, Every dot is one thing (74)

## 3. Per deck

### Deck A, Signal

Strongest: slide 1. The number fills the width, counts up in 1.1 s, flashes once, then "30 written" and "4 funded" each wait for a click. Slide 3 is the only story slide that gives "the other way round" its own click.

Weakest: slide 11. The dashed empty square is styled like the photo slot on slide 3 and reads as a missing picture. It overflows by 5 px.

What would cost it the room: thirteen slides at full volume in capitals, with no quiet slide, so a calm speaker looks small next to it. Slides 3 and 4 run against the order of the notes: he says "I have no doctorate" while the screen shows "ME COMPUTER".

### Deck B, Ledger

Strongest: slide 10. One dot empties and the 186 drop. It is the only slide in the set that shows "if I leave, a lot leaves with me".

Weakest: slide 3. The dolls are drawn as a tall and a small figure in dresses and read as a restroom sign. "Me" and "my sister" are static, so the counterfactual has no moment.

What would cost it the room: nothing goes wrong, and that is the risk. The room sees many decks like this one. The headlines on 4, 5, 7, 8 and 9 make the speaker the second source of each claim, and the opening on paper is the quietest of the five.

### Deck C, Every dot is one thing

Strongest: slide 2 with slide 6. The orange dot inside the ring, then the tools landing in the one ring that has someone inside, carry "inside" with no words at all. Slide 7 ("Two workshops. One rule.") gives the rule its own beat.

Weakest: slide 3. A boy, a sister, a computer and dolls become two labelled circles, with the photo slot off to the right. The one human story of the talk gets the most abstract slide.

What would cost it the room: the click load. 28 clicks, each followed by about a second of travel, turn the speaker into the narrator of an animation. One missed click and voice and screen are a step apart. The key sentence at the close is only a transient state.

### Deck D, People in the room

Strongest: slide 2 (returning on 11). "Inside" in amber over people at a table is the idea as a picture, and the room looks at people, then back at him. Slide 7 is the best chart of the set: five years of months, the two windows bracketed, 8 to 42 percent.

Weakest: slide 1 as a speaking slide. "30 proposals written. 4 funded." is on screen from the first frame, and the count-up takes 1.9 s.

What would cost it the room: five photos that do not exist yet (slides 3, 4, 6, 9, 10), with the PDF due on 17 November. The Gulu team photo needs the consent of people the brief keeps unnamed. Without the photos this is five gradients.

### Deck E, Commit history

Strongest: slide 4. Professor, data steward, then five curves to 186 labelled dots. It is the clearest "layer between" of all five decks.

Weakest: slide 10. The yellow headline is "20 hours a week" and "a single point of failure" sits in a small monospace line at the bottom. The punchline is demoted to a caption. Slide 11's "merge: both halves" explains nothing to the room.

What would cost it the room: two text channels on every slide. The commit line and the graph are a second thing to read and decode while he talks, and librarians without Git will not decode them. A listener may repeat "the talk was a commit log".

## 4. Changes for my top two

### Deck A

1. Slides 3 and 4: put them in the order of the notes. "No doctorate. No computer science degree." first (current slide 4, without the band), then the story slide. Make the yellow band "A steward grows inside a group." the last fragment of the story slide, after the swap, so the story ends on its conclusion and the settled state is no longer "ME: DOLLS" alone.
2. Add one black slide before slide 1. The count-up fires on load, which happens during the laptop changeover between talks, so the room never sees the number land. With a black slide the first click starts it. Applies to every deck.
3. Slide 11: replace the dashed square with the mechanic of deck B slide 10. Bring back the 186 blocks of slide 5 under the yellow steward band, and on the click remove the band and let the blocks drop. Alternative: the empty chair photo slot of deck D slide 10. Fix the 5 px overflow.
4. Slide 5: the labels "STAFF" and "DOCTORAL" are stacked under two columns and cannot be assigned. Put the count over each column (63, 48, 42, 26, 7) as deck C slide 4 does. If there is time, take the diagram of deck E slide 4 (professor, steward, five curves) in A's colours.
5. Slide 10: the box "FILES" says nothing and the DOI is for the PDF reader. Use the three stations of deck E slide 9 (30 October files received, 50 questions answered within 3 days, 3 November released with a DOI) and set this one slide in sentence case with more black around it, so the deck has one quiet slide before the trade-off. On slide 8, label the two windows with their months as deck B slide 7 does.

### Deck D

1. Slide 1: take the two fragments of deck A slide 1. Squares and "30 proposals written." on the first click, the four filled squares and "4 funded." on the second. Shorten the count-up from 1.9 s to about 1.1 s. Add the black slide before it.
2. Slide 3: "Nobody is born a data steward." is the conclusion and stands on screen before the story is told. Enter with the photo and the small line only. First click: "And the other way round?" from deck A slide 3. Second click: "Nobody is born a data steward."
3. Photos: decide by 14 November which of the five exist. Take the empty chair this week, it is the best photo idea in the set. Replace the Gulu team slot on slide 9 with a screenshot of the public guluswm page (address in the data file) unless the colleagues agree to a photo. Slide 6 needs a second workshop photo; until then use the treatment of deck C slide 7. Drop the workshop photo from slide 13 so it appears on 2 and 11 only.
4. Slide 4: 186 by year does not show the layer between professor and staff. Use the diagram of deck E slide 4 over the coaching photo, or keep the photo alone with "186" and move the dots out.
5. Remove the 45 s push in on the photos. It is motion with no meaning, it causes the overflow flags on 2, 11 and 13, and it makes slide 11 a different crop from slide 2. On slide 8 (78 words) reveal the agent share on a click as deck A slide 9 does, and on slide 5 fold the nine small types into "other" as deck C slide 5 does.

## 5. The talk itself

- Ten beats in eight minutes is full. Beat 5 (345 repositories) answers a question nobody in the room has. Cutting it to one sentence on the opening number gives the story and Gulu room to breathe.
- The notes say what the room should learn and do. They do not say what it should feel. Decide that.
- "Come and find me" is a weak ask. Name a place and a time.
- "She would be standing here today": has the sister agreed to be in the talk?
- The opening number is a placeholder six days before the PDF is due.
