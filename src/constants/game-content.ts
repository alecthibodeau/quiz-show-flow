/* Interfaces */
import type { Clue } from '../interfaces/Clue';
import type { ClueResponse } from '../interfaces/ClueResponse';
import type { Column } from '../interfaces/Column';

const clueResponses: { [key: string]: ClueResponse } = {
  correct: { name: 'correct', code: 1 },
  incorrect: { name: 'incorrect', code: -1 },
  pass: { name: 'pass', code: 0 }
};

const digitsAsWords: string[] = ['One', 'Two', 'Three', 'Four', 'Five', 'Six'];
const dollarValuesFirst: number[] = [200, 400, 600, 800, 1000];
const dollarValuesSecond: number[] = dollarValuesFirst.map(amount => amount * 2);

const initialColumns: Column[] = Array.from({ length: 6 }, (_, columnId: number) => ({
  id: columnId,
  category: '',
  dollarValues: dollarValuesFirst
}));

const initialCurrentClue: Clue = {
  columnId: 0,
  category: '',
  dollarValue: 0
};

const gameContent = {
  clueResponses,
  digitsAsWords,
  dollarValuesFirst,
  dollarValuesSecond,
  initialColumns,
  initialCurrentClue
};

export default gameContent;
