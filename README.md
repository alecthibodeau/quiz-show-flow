# Quiz Show Flow

## Play along with *Jeopardy!*

Quiz Show Flow is a user interface for scoring your progress when playing along with the televised game show *Jeopardy!* While this project is a work in progress it's fully functional for tracking your responses to every question in the first two rounds of the show. Simply select the current clue from the board and then log your response by clicking one of three buttons: correct, incorrect or pass.

The interface is mobile-first in its approach to responsive web design. The layout is built to work well on mobile device browsers as well as tablets, and desktop/laptop machines.

Currently there's no option to wager money on Daily Doubles or in the final round. These features are in development. Check back for updates.

## Features

### Current features
- Start a new game at any time
- Advance to the next round when ready
- Category names by default are *Category One*, *Category Two*, etc.
- Click category names to edit them: enter your interpretation of the show's actual categories.
- Click any available clue on the board to select it
- Played clues display as empty blue rectangles within the game board &mdash; just like on the show
- Negative scores display as red numbers
- Record your clue responses with one of three buttons in the score bar&hellip;
  - Correct: Checkmark icon button (green) &mdash; score increases
  - Incorrect: "X" icon button (red) &mdash; score decreases
  - Pass: Circle icon button (blue) &mdash; score stays the same
- After each clue response&hellip;
  - Your score automatically updates
  - Your most recent response status (correct, incorrect or pass) appears below the score bar

### Future features
- Betting: Place wagers for Daily Doubles and for the final round
- History: Save your score results for later reference
- Other features TBD

## Technologies

Quiz Show Flow is built with:
- [Vue](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- vanilla CSS

Software and content Copyright (C) Alec Thibodeau. Copyright year is by commit date. This project has no affiliation with the *Jeopardy!* television show or its producers.