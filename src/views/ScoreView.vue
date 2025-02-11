<script setup lang="ts">
import { reactive, ref } from 'vue';

/* Interfaces */
import type { Clue } from '../interfaces/Clue';
import type { ClueResponse } from '../interfaces/ClueResponse';
import type { Column } from '../interfaces/Column';

/* Constants */
import gameContent from '../constants/game-content';

/* Styles */
import '../styles/score-view.css';

const {
  clueResponses,
  digitsAsWords,
  dollarValuesFirst,
  dollarValuesSecond,
  initialColumns,
  initialCurrentClue
} = gameContent;

const formButtons: { label: string, action: () => void }[] = [
  { label: 'clear', action: clearCategories },
  { label: 'continue', action: toggleCategories }
];

const columns = reactive<Column[]>(initialColumns);
const currentClue = reactive<Clue>({...initialCurrentClue});
const currentRound = ref<number>(0);
const currentScore = ref<number>(0);
const isCategoriesFormDisplayed = ref<boolean>(false);
const isNewRoundStart = ref<boolean>(true);
const mostRecentResponse = ref<string>('');
const playedClues = reactive<{ [key: string]: string }>({});

function resetColumns(): void {
  columns.forEach(column => {
    column.dollarValues = currentRound.value === 0 ? dollarValuesFirst : dollarValuesSecond;
    column.category = '';
  });
}

function resetGameBoard(): void {
  clearClue();
  resetColumns();
  if (isCategoriesFormDisplayed.value) isCategoriesFormDisplayed.value = false;
  isNewRoundStart.value = true;
  mostRecentResponse.value = '';
}

function advanceRound(): void {
  if (currentRound.value < 2) {
    currentRound.value += 1;
    resetGameBoard();
  }
}

function startNewGame(): void {
  currentRound.value = 0;
  currentScore.value = 0;
  resetGameBoard();
  Object.keys(playedClues).forEach(key => delete playedClues[key]);
}

function clearClue(): void {
  currentClue.columnId = initialCurrentClue.columnId;
  currentClue.category = initialCurrentClue.category;
  currentClue.dollarValue = initialCurrentClue.dollarValue;
}

function selectClue(column: Column, dollarValue: number): void {
  if (currentClue.columnId === column.id && currentClue.dollarValue === dollarValue) {
    clearClue();
  } else {
    currentClue.columnId = column.id;
    currentClue.category = column.category;
    currentClue.dollarValue = dollarValue;
  }
  if (isNewRoundStart.value) isNewRoundStart.value = false;
  if (isCategoriesFormDisplayed.value) isCategoriesFormDisplayed.value = false;
}

function toggleCategories(): void {
  clearClue();
  isCategoriesFormDisplayed.value = !isCategoriesFormDisplayed.value;
  if (isNewRoundStart.value) isNewRoundStart.value = false;
}

function clearCategories(): void {
  columns.forEach(column => {
    column.category = '';
  });
  currentClue.category = '';
}

function formatClueKey(columnId: number, dollarValue: number): string {
  return `${currentRound.value}-${columnId}-${dollarValue}`;
}

function isCluePlayed(columnId: number, dollarValue: number): boolean {
  return !!playedClues[formatClueKey(columnId, dollarValue)];
}

function updateScore(clueResponse: ClueResponse, increment: number): void {
  if (increment) currentScore.value += increment;
  const clueKey: string = formatClueKey(currentClue.columnId, currentClue.dollarValue);
  playedClues[clueKey] = clueResponse.code.toString();
  mostRecentResponse.value = clueResponse.name;
  clearClue();
}

function formatScore(): string {
  const absoluteScore: string = Math.abs(currentScore.value).toString();
  const isLessThanThousand: boolean = absoluteScore.length < 4;
  const formattedScore: string = absoluteScore.slice(0, -3) + ',' + absoluteScore.slice(-3);
  const displayedScore: string = isLessThanThousand ? absoluteScore : formattedScore;
  return `${currentScore.value < 0 ? '-' : ''}$${displayedScore}`;
}

function formatScoringIncrement(name: string): number {
  let increment: number = 0;
  if (name === clueResponses.correct.name) increment = currentClue.dollarValue;
  if (name === clueResponses.incorrect.name) increment = -currentClue.dollarValue;
  return increment;
}

function setPlaceholderCategory(columnId: number): string {
  return `Category ${digitsAsWords[columnId]}`;
}

function displayCategory(category: string, columnId: number): string {
  return category ? category : setPlaceholderCategory(columnId);
}
</script>

<template>
  <div class="score">
    <div class="rounds-container">
      <button @click="startNewGame" class="button-app button-secondary">
        New Game
      </button>
      <div class="round">
        {{ `&#8226; Round ${currentRound + 1} &#8226;` }}
      </div>
      <button
        @click="advanceRound"
        class="button-app button-secondary"
        :class="{ hidden: currentRound === 2 }"
      >
        Next Round
      </button>
    </div>
    <div v-if="currentRound < 2" class="game-board">
      <div
        v-for="column in columns"
        :key="`column-${column.id}`"
        class="column"
      >
        <button @click="toggleCategories" class="button-category">
          {{ displayCategory(column.category, column.id) }}
        </button>
        <button
          v-for="dollarValue in column.dollarValues"
          :key="`${column.id}-${dollarValue}`"
          @click="selectClue(column, dollarValue)"
          :disabled="isCluePlayed(column.id, dollarValue)"
          :class="['button-clue', {
            selected: column.id === currentClue.columnId && dollarValue === currentClue.dollarValue,
            played: isCluePlayed(column.id, dollarValue)
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
      <div v-if="!isCategoriesFormDisplayed" class="selected-clue-actions">
        <button
          v-for="clueResponse in clueResponses"
          :key="`response-button-${clueResponse.name}`"
          @click="updateScore(clueResponse, formatScoringIncrement(clueResponse.name))"
          :disabled="!currentClue.dollarValue"
          :class="[
            `button-response button-${clueResponse.name}`,
            { active: currentClue.dollarValue }
          ]"
        >
          <div></div>
          <div></div>
        </button>
      </div>
    </div>
  </div>

  <div v-if="!isCategoriesFormDisplayed && !isNewRoundStart" class="info-box">
    <div v-if="currentClue.dollarValue" class="selected-clue-info">
      {{ `
        ${displayCategory(currentClue.category, currentClue.columnId)}: $
        ${currentClue.dollarValue}
      ` }}
    </div>
    <div v-else-if="mostRecentResponse" :class="`most-recent-response ${mostRecentResponse}`">
      {{ mostRecentResponse.toUpperCase() }}
    </div>
  </div>

  <div v-if="isCategoriesFormDisplayed" class="categories-form">
    <input
      v-for="column of columns"
      :key="`input-${column.id}`"
      type="text"
      maxlength="20"
      v-model="column.category"
      :placeholder="`Enter ${setPlaceholderCategory(column.id)}`"
      class="categories-form-input"
    />
    <div class="categories-form-actions">
      <button
        v-for="formButton of formButtons"
        :key="`formButton-${formButton.label}`"
        @click="typeof formButton.action === 'function' && formButton.action()"
        :class="`button-app button-primary button-${formButton.label}`"
      >
        {{ formButton.label.charAt(0).toUpperCase() + formButton.label.slice(1) }}
      </button>
    </div>
  </div>
</template>
