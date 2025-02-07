<script setup lang="ts">
import { reactive, ref, watch } from 'vue';

/* Interfaces */
import type { Clue } from '../interfaces/Clue';
import type { Column } from '../interfaces/Column';

/* Constants */
import colors from '../constants/colors';

const { colorBlue, colorGold, colorOffWhite, colorOffBlack } = colors;

const dollarValuesFirst: number[] = [200, 400, 600, 800, 1000];
const dollarValuesSecond: number[] = dollarValuesFirst.map(amount => amount * 2);

const currentRound = ref<number>(1);
const currentScore = ref<number>(0);
const isCategoriesFormDisplayed = ref<boolean>(false);

const columns = reactive<Column[]>([
  { id: 0, category: '', dollarValues: dollarValuesFirst },
  { id: 1, category: '', dollarValues: dollarValuesFirst },
  { id: 2, category: '', dollarValues: dollarValuesFirst },
  { id: 3, category: '', dollarValues: dollarValuesFirst },
  { id: 4, category: '', dollarValues: dollarValuesFirst },
  { id: 5, category: '', dollarValues: dollarValuesFirst }
]);

const currentClue = reactive<Clue>({
  column: 0,
  category: '',
  dollarValue: 0
});

watch(currentRound, (newRound) => {
  if (newRound === 2) {
    columns.forEach(column => {
      column.dollarValues = dollarValuesSecond;
      column.category = '';
    });
  }
});

function selectClue(columnId: number, columnCategory: string, dollarValue: number): void {
  if (currentClue.column === columnId && currentClue.dollarValue === dollarValue) {
    clearClue();
  } else {
    currentClue.column = columnId;
    currentClue.category = columnCategory;
    currentClue.dollarValue = dollarValue;
  }
}

function clearClue(): void {
  currentClue.column = 0;
  currentClue.category = '';
  currentClue.dollarValue = 0;
}

function updateScore(increment: number): void {
  currentScore.value += increment;
  clearClue();
}

function toggleCategories(): void {
  isCategoriesFormDisplayed.value = !isCategoriesFormDisplayed.value;
}

function advanceRound(): void {
  if (currentRound.value <= 2) currentRound.value += 1;
}

function startNewGame(): void {
  currentRound.value = 1;
  currentScore.value = 0;
  columns.forEach(column => {
    column.dollarValues = dollarValuesFirst;
    column.category = '';
  });
}
</script>

<template>
  <div class="score">
    <div class="round-container">
      <button @click="startNewGame" class="button-app button-secondary">
        New Game
      </button>
      <div class="round">
        {{ `Round ${currentRound}` }}
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
        <button @click="toggleCategories" class="category-button">
          {{ column.category }}
        </button>
        <button
          v-for="dollarValue in column.dollarValues"
          :key="`${column.id}-${dollarValue}`"
          @click="selectClue(column.id, column.category, dollarValue)"
          class="clue-button"
        >
          {{ `$${dollarValue}` }}
        </button>
      </div>
    </div>

    <div class="score-bar">
      <div class="score-amount">
        {{ `$${currentScore}` }}
      </div>
      <div
        v-if="currentClue.category && !isCategoriesFormDisplayed"
        class="clue-actions"
      >
        <div class="clue-info">
          <div>{{ currentClue.category }}</div>
          <div>{{ `$${currentClue.dollarValue}` }}</div>
        </div>
        <button @click="updateScore(currentClue.dollarValue)">Correct</button>
        <button @click="updateScore(-currentClue.dollarValue)">Incorrect</button>
      </div>
    </div>
  </div>

  <div v-if="isCategoriesFormDisplayed" class="categories-form">
    <input
      v-for="column of columns"
      :key="`input-${column.id}`"
      type="text"
      v-model="column.category"
      :placeholder="`Enter category ${column.id + 1}`"
      class="category-input"
    />
    <button @click="toggleCategories" class="button-app button-primary">
      Done
    </button>
  </div>
</template>

<style>
.button-app {
  font-size: .75rem;
  font-weight: 700;
  border: 2px solid v-bind('colorOffBlack');
  border-radius: 5px;
  padding: .375rem;
}

.button-primary {
  color: v-bind('colorOffWhite');
  background-color: v-bind('colorOffBlack');
}

.button-secondary {
  color: v-bind('colorOffBlack');
  background-color: v-bind('colorOffWhite');
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

.category-button,
.clue-button {
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

  &.category-button {
    min-height: 3rem;
    padding: .125rem;
    font-size: .625rem;
    line-height: .75rem;
    color: v-bind('colorOffWhite');
  }
}

.score-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-top: 1px;
  background-color: v-bind('colorGold');
}

.score-amount {
  font-weight: 700;
}

.clue-actions {
  display: flex;
  gap: .5rem;
}

.clue-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: .75rem;
}

.categories-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: .5rem 2rem;
  gap: .375rem;
}

.category-input {
  width: 100%;
  max-width: 500px;
}
</style>
