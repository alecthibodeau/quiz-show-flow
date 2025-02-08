<script setup lang="ts">
import { reactive, ref, watch } from 'vue';

/* Interfaces */
import type { Clue } from '../interfaces/Clue';
import type { Column } from '../interfaces/Column';

/* Constants */
import gameContent from '../constants/game-content';

/* Styles */
import '../styles/score-view.css';

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
