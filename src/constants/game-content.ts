const digitsAsWords: string[] = ['One', 'Two', 'Three', 'Four', 'Five', 'Six'];
const dollarValuesFirst: number[] = [200, 400, 600, 800, 1000];
const dollarValuesSecond: number[] = dollarValuesFirst.map(amount => amount * 2);

const gameContent = {
  digitsAsWords,
  dollarValuesFirst,
  dollarValuesSecond
}

export default gameContent;
