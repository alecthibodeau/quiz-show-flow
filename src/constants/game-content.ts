import type { ClueResponse } from '../interfaces/ClueResponse';

const clueResponses: { [key: string]: ClueResponse } = {
  correct: { name: 'correct', code: 1 },
  incorrect: { name: 'incorrect', code: -1 },
  pass: { name: 'pass', code: 0 }
};
const digitsAsWords: string[] = ['One', 'Two', 'Three', 'Four', 'Five', 'Six'];
const dollarValuesFirst: number[] = [200, 400, 600, 800, 1000];
const dollarValuesSecond: number[] = dollarValuesFirst.map(amount => amount * 2);

const gameContent = {
  clueResponses,
  digitsAsWords,
  dollarValuesFirst,
  dollarValuesSecond
}

export default gameContent;
