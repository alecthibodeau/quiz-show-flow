<script setup lang="ts">
import { reactive, ref } from 'vue';

/* Interfaces */
import type { Clue } from '../interfaces/Clue';
import type { Column } from '../interfaces/Column';

/* Constants */
import colors from '../constants/colors';

const { colorBlue, colorGold, colorOffWhite, colorOffBlack } = colors;

const dollarAmountsFirst: number[] = [200, 400, 600, 800, 1000];

const currentRound = ref<number>(1);
const currentScore = ref<number>(0);
const isCategoriesFormDisplayed = ref<boolean>(false);

const columns = reactive<Column[]>([
  { id: 0, category: '', dollarAmounts: dollarAmountsFirst },
  { id: 1, category: '', dollarAmounts: dollarAmountsFirst },
  { id: 2, category: '', dollarAmounts: dollarAmountsFirst },
  { id: 3, category: '', dollarAmounts: dollarAmountsFirst },
  { id: 4, category: '', dollarAmounts: dollarAmountsFirst },
  { id: 5, category: '', dollarAmounts: dollarAmountsFirst }
]);

const currentClue = reactive<Clue>({
  column: 0,
  category: '',
  dollarAmount: 0
});

function selectClue(columnId: number, columnCategory: string, dollarAmount: number): void {
  if (currentClue.column === columnId && currentClue.dollarAmount === dollarAmount) {
    clearClue();
  } else {
    currentClue.column = columnId;
    currentClue.category = columnCategory;
    currentClue.dollarAmount = dollarAmount;
  }
}

function clearClue(): void {
  currentClue.column = 0;
  currentClue.category = '';
  currentClue.dollarAmount = 0;
}

function updateScore(increment: number): void {
  currentScore.value += increment;
  clearClue();
}

function toggleCategories(): void {
  isCategoriesFormDisplayed.value = !isCategoriesFormDisplayed.value;
}

function advanceRound(): void {
  currentRound.value += 1;
}
</script>

<template>
  <div class="score">
    <div class="round-container">
      <button class="button-app button-secondary">info</button>
      <div class="round">
        {{ `Round ${currentRound}` }}
      </div>
      <button @click="advanceRound" class="button-app button-secondary">next</button>
    </div>
    <div class="game-board">
      <div
        v-for="column in columns"
        :key="`column-${column.id}`"
        class="column"
      >
        <div class="category">
          {{ column.category }}
        </div>
        <button
          v-for="dollarAmount in column.dollarAmounts"
          :key="`${column.id}-${dollarAmount}`"
          @click="selectClue(column.id, column.category, dollarAmount)"
          class="clue-button"
        >
          {{ `$${dollarAmount}` }}
        </button>
      </div>
    </div>

    <div class="score-bar">
      <button @click="toggleCategories" class="button-app button-primary">
        Categories
      </button>
      <span class="score-amount">
        {{ `$${currentScore}` }}
      </span>
    </div>

    <div v-if="currentClue.category && !isCategoriesFormDisplayed" class="current-clue">
      <div>{{ currentClue.category }}</div>
      <div>{{ `$${currentClue.dollarAmount}` }}</div>
      <div>
        <button @click="updateScore(currentClue.dollarAmount)">Correct</button>
        <button @click="updateScore(-currentClue.dollarAmount)">Incorrect</button>
        <button @click="clearClue">Clear</button>
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

.category {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 3rem;
  padding: .125rem;
  text-align: center;
  font-size: .5rem;
  font-weight: inherit;
  line-height: .75rem;
  background-color: v-bind('colorBlue');
}

.clue-button {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: .5rem 0;
  border: none;
  margin-top: 1px;
  font-size: .75rem;
  font-weight: inherit;
  background-color: v-bind('colorBlue');
  color: v-bind('colorGold');
}

.score-bar {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  margin-top: 1px;
  background-color: v-bind('colorGold');
}

.score-amount {
  font-weight: 700;
}

.categories-form {
  padding: .5rem 2rem;
}

.category-input {
  width: 100%;
}
</style>
