/* Constants */
import gameContent from '../constants/game-content';

const { clueResponses } = gameContent;

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
  formatDisplayedScore,
  formatDollarsDifference
};

export default scoreFormatting;
