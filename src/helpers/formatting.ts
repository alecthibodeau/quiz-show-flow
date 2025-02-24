/* Constants */
import gameContent from '../constants/game-content';

const { clueResponses, digitsAsWords } = gameContent;

function setPlaceholderCategory(columnId: number): string {
  return `Category ${digitsAsWords[columnId]}`;
}

function displayCategory(category: string, columnId: number): string {
  return category ? category : setPlaceholderCategory(columnId);
}

function formatClueKey(columnId: number, dollarValue: number, round: number): string {
  return `${round}-${columnId}-${dollarValue}`;
}

function isCluePlayed(
  columnId: number,
  dollarValue: number,
  round: number,
  playedClues: { [key: string]: string }
): boolean {
  const clueKey: string = formatClueKey(columnId, dollarValue, round);
  return !!playedClues[clueKey];
}

function formatDisplayedScore(currentScore: number): string {
  const absoluteScore: string = Math.abs(currentScore).toString();
  const isLessThanThousand: boolean = absoluteScore.length < 4;
  const formattedScore: string = absoluteScore.slice(0, -3) + ',' + absoluteScore.slice(-3);
  const displayedScore: string = isLessThanThousand ? absoluteScore : formattedScore;
  return `${currentScore < 0 ? '-' : ''}$${displayedScore}`;
}

function formatDollarsDifference(responseName: string, dollarValue: number): number {
  let increment: number = 0;
  if (responseName === clueResponses.correct.name) {
    increment = dollarValue;
  }
  if (responseName === clueResponses.incorrect.name) {
    increment = -dollarValue;
  }
  return increment;
}

const scoreFormatting = {
  setPlaceholderCategory,
  displayCategory,
  formatClueKey,
  isCluePlayed,
  formatDisplayedScore,
  formatDollarsDifference
};

export default scoreFormatting;
