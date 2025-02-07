<script setup lang="ts">
import { reactive, ref, watch } from 'vue';

/* Interfaces */
import type { Clue } from '../interfaces/Clue';
import type { Column } from '../interfaces/Column';

/* Constants */
import colors from '../constants/colors';
import gameContent from '../constants/game-content';

const {
  colorBlue,
  colorBluePale,
  colorGold,
  colorGray,
  colorGreenHTML,
  colorRed,
  colorOffWhite,
  colorOffBlack
} = colors;

const { dollarValuesFirst, dollarValuesSecond, digitsAsWords } = gameContent;

const formButtons: { [key: string]: string | (() => void) }[] = [
  { label: 'Clear', action: clearCategories },
  { label: 'Reset', action: resetColumns },
  { label: 'Close', action: toggleCategories }
];

const clueResponses: string[] = ['correct', 'incorrect'];

const currentRound = ref<number>(1);
const currentScore = ref<number>(0);
const isCategoriesFormDisplayed = ref<boolean>(false);
const isNewRoundStart = ref<boolean>(true);
const mostRecentResponse = ref<string>('');

const playedClues = reactive<{ [key: string]: string }>({});

const columns = reactive<Column[]>(Array.from({ length: 6 }, (_, id) => ({
  id,
  category: `Category ${digitsAsWords[id]}`,
  dollarValues: dollarValuesFirst
})));

const currentClue = reactive<Clue>({
  columnId: 0,
  category: '',
  dollarValue: 0
});

watch(currentRound, (newRound) => {
  if (newRound === 2) setGameBoardForRoundTwo();
});

function resetColumnCategory(column: Column): void {
  column.category = `Category ${digitsAsWords[column.id]}`;
}

function resetColumns(dollarValues?: number[]): void {
  columns.forEach(column => {
    if (dollarValues) column.dollarValues = dollarValues;
    resetColumnCategory(column);
  });
}

function setGameBoardForRoundTwo(): void {
  resetColumns(dollarValuesSecond);
  isNewRoundStart.value = true;
  mostRecentResponse.value = '';
}

function selectClue(column: Column, dollarValue: number): void {
  if (currentClue.columnId === column.id && currentClue.dollarValue === dollarValue) {
    clearClue();
  } else {
    currentClue.columnId = column.id;
    currentClue.category = column.category;
    currentClue.dollarValue = dollarValue;
  }
}

function clearClue(): void {
  currentClue.columnId = 0;
  currentClue.category = '';
  currentClue.dollarValue = 0;
}

function focusFirstInput(): void {
  const firstInput = document.querySelector('.category-input');
  if (firstInput) (firstInput as HTMLInputElement).focus();
}

function clearCategories(): void {
  columns.forEach(column => {
    column.category = '';
  });
  currentClue.category = '';
  focusFirstInput();
}

function updateScore(increment: number): void {
  currentScore.value += increment;
  const response: string = increment > 0 ? clueResponses[0] : clueResponses[1];
  const clueKey: string = `${currentRound.value}-${currentClue.columnId}-${currentClue.dollarValue}`;
  playedClues[clueKey] = increment > 0 ? '1' : '-1';
  mostRecentResponse.value = response;
  clearClue();
}

function toggleCategories(): void {
  isCategoriesFormDisplayed.value = !isCategoriesFormDisplayed.value;
  if (isNewRoundStart.value) isNewRoundStart.value = false;
}

function advanceRound(): void {
  if (currentRound.value <= 2) currentRound.value += 1;
}

function startNewGame(): void {
  currentRound.value = 1;
  currentScore.value = 0;
  resetColumns(dollarValuesFirst);
  Object.keys(playedClues).forEach(key => delete playedClues[key]);
  mostRecentResponse.value = '';
}

function formatScore(): string {
  const absoluteScore: string = Math.abs(currentScore.value).toString();
  const isLessThanThousand: boolean = absoluteScore.length < 4;
  const formattedScore: string = absoluteScore.slice(0, -3) + ',' + absoluteScore.slice(-3);
  const displayedScore: string = isLessThanThousand ? absoluteScore : formattedScore;
  return `${currentScore.value < 0 ? '-' : ''}$${displayedScore}`;
}
</script>

<template>
  <div class="score">
    <div class="round-container">
      <button @click="startNewGame" class="button-app button-secondary">
        New Game
      </button>
      <div class="round">
        {{ `&#8226; Round ${currentRound} &#8226;` }}
      </div>
      <button @click="advanceRound" class="button-app button-secondary">
        Next Round
      </button>
    </div>
    <div class="game-board">
      <div
        v-for="column in columns"
        :key="`column-${column.id}`"
        class="column"
      >
        <button @click="toggleCategories" class="button-category">
          {{ column.category }}
        </button>
        <button
          v-for="dollarValue in column.dollarValues"
          :key="`${column.id}-${dollarValue}`"
          @click="selectClue(column, dollarValue)"
          :disabled="!!playedClues[`${column.id}-${dollarValue}`]"
          :class="['button-clue', {
            selected: column.id === currentClue.columnId && dollarValue === currentClue.dollarValue,
            played: playedClues[`${currentRound}-${column.id}-${dollarValue}`]
          }]"
        >
          {{ `$${dollarValue}` }}
        </button>
      </div>
    </div>

    <div class="score-bar">
      <div class="score-info">
        <div class="score-title">
          score
        </div>
        <div :class="['score-amount', { negative: currentScore < 0 }]">
          {{ formatScore() }}
        </div>
      </div>
      <div class="clue-actions">
        <div v-if="currentClue.dollarValue" class="clue-info">
          <div>{{ currentClue.category }}</div>
          <div>{{ `$${currentClue.dollarValue}` }}</div>
        </div>
        <div v-else-if="mostRecentResponse" :class="`most-recent-response ${mostRecentResponse}`">
          {{ mostRecentResponse.toUpperCase() }}
        </div>
        <button
          v-for="response of clueResponses"
          :key="`response-button-${response}`"
          @click="updateScore(response === 'correct' ? currentClue.dollarValue : -currentClue.dollarValue)"
          :disabled="!currentClue.dollarValue"
          :class="[`button-response button-${response}`, { active: currentClue.dollarValue }]"
        >
          <div></div>
          <div></div>
        </button>
      </div>
    </div>
  </div>

  <div v-if="isNewRoundStart" class="message-change-categories">
    <div>
      Click category names to change them.
    </div>
    <button @click="() => isNewRoundStart = false">close</button>
  </div>

  <div v-if="isCategoriesFormDisplayed" class="categories-form">
    <input
      v-for="column of columns"
      :key="`input-${column.id}`"
      type="text"
      maxlength="20"
      v-model="column.category"
      :placeholder="`Enter category #${column.id + 1}`"
      class="category-input"
    />
    <div class="categories-form-actions">
      <button
        v-for="formButton of formButtons"
        :key="`formButton-${formButton.label}`"
        @click="typeof formButton.action === 'function' && formButton.action()"
        class="button-app button-primary"
      >
        {{ formButton.label }}
      </button>
    </div>
  </div>
</template>

<style>
.button-app {
  font-size: .75rem;
  font-weight: 700;
  border: 2px solid transparent;
  border-radius: 5px;
  padding: .375rem;
  background-color: v-bind('colorOffBlack');
  color: v-bind('colorOffWhite');
}

.button-primary {
  border-color: v-bind('colorOffWhite');
}

.button-secondary {
  border-color: v-bind('colorBluePale');
  color: v-bind('colorOffBlack');
  background-color: v-bind('colorBluePale');
}

.round-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: .5rem;
}

.round {
  text-align: center;
  text-transform: uppercase;
  font-weight: 700;
  color: v-bind('colorGold');
}

.game-board {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  align-items: end;
  gap: 1px;
}

.column {
  font-weight: 700;
  color: v-bind('colorOffWhite');
}

.button-category,
.button-clue {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: .5rem 0;
  border: none;
  margin-top: 1px;
  font-size: .75rem;
  font-weight: 700;
  background-color: v-bind('colorBlue');
  color: v-bind('colorGold');

  &.button-category {
    min-height: 3rem;
    padding: .125rem;
    font-size: .625rem;
    line-height: .75rem;
    color: v-bind('colorOffWhite');
  }

  &.selected {
    background-color: v-bind('colorGold');
    color: v-bind('colorOffBlack');
  }

  &.played {
    color: v-bind('colorBlue');
  }
}

.score-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .75rem;
  margin-top: 1px;
  background-color: v-bind('colorGold');
}

.score-info > * {
  font-weight: 700;
  line-height: 1rem;
}

.score-title {
  text-transform: uppercase;
  font-size: .75rem;
  color: v-bind('colorBlue');
}

.score-amount {
  padding: .125rem;
  border-radius: 5px;
  background-color: v-bind('colorOffWhite');

  &.negative {
    color: v-bind('colorRed');
  }
}

.clue-actions {
  display: flex;
}

.clue-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: .75rem;
  line-height: 1rem;

  div {
    font-weight: 700;
  }
}

.most-recent-response {
  display: flex;
  align-items: center;
  font-size: .75rem;
  font-weight: 700;

  &.correct {
    margin-right: .75rem;
    color: v-bind('colorGreenHTML');
  }

  &.incorrect {
    margin-right: .5rem;
    color: v-bind('colorRed');
  }
}

.button-correct {
  background-color: v-bind('colorGreenHTML');

  div {
    width: .375rem;
    height: 1.25rem;
    background-color: v-bind('colorOffWhite');
    transform: rotate(45deg);

    &:first-of-type {
      top: .12rem;
      right: .11rem;
      transform: rotate(-45deg);
      height: .75rem;
    }
  }
}

.button-incorrect {
  background-color: v-bind('colorRed');

  div {
    right: .2rem;
    width: .375rem;
    height: 1.75rem;
    background-color: v-bind('colorOffWhite');
    transform: rotate(45deg);

    &:first-of-type {
      left: .2rem;
      transform: rotate(-45deg);
    }
  }
}

.button-response {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: 50%;
  margin-left: .5rem;

  &:not(.active) {
    background-color: v-bind('colorGray');
  }

  div {
    position: relative;
  }
}

.message-change-categories {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  font-size: .875rem;
  color: v-bind('colorOffWhite');

  button {
    border: none;
    border-radius: 5px;
    text-transform: uppercase;
    font-size: .625rem;
    font-weight: 700;
    background-color: v-bind('colorOffWhite');
  }
}

.categories-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: .5rem 2rem;
  gap: .25rem;
}

.category-input {
  width: 100%;
  max-width: 500px;
}

.categories-form-actions {
  display: flex;
  gap: 1rem;
  margin-top: .25rem;
}
</style>
