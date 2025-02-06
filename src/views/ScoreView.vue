<script setup lang="ts">
import { reactive, ref } from 'vue';

/* Interfaces */
import type { Column } from '../interfaces/Column';

/* Constants */
import colors from '../constants/colors';

const { blue, dollarAmount, white } = colors;

const dollarAmountsFirst: number[] = [200, 400, 600, 800, 1000];

const currentClue = reactive<{ [key: string]: number | string }>({
  column: 0,
  category: '',
  dollarAmount: 0
});

const columns = ref<Column[]>([
  { id: 0, category: 'Science', dollarAmounts: dollarAmountsFirst },
  { id: 1, category: 'World History', dollarAmounts: dollarAmountsFirst },
  { id: 2, category: 'Books', dollarAmounts: dollarAmountsFirst },
  { id: 3, category: 'Movies', dollarAmounts: dollarAmountsFirst },
  { id: 4, category: 'Global Landmarks', dollarAmounts: dollarAmountsFirst },
  { id: 5, category: 'Classical Music', dollarAmounts: dollarAmountsFirst }
]);

function selectClue(columnId: number, columnCategory: string, dollarAmount: number): void {
  currentClue.column = columnId;
  currentClue.category = columnCategory;
  currentClue.dollarAmount = dollarAmount;
}
</script>

<template>
  <div class="score">

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
    <div v-if="currentClue.category" class="current-clue">
      <h2>{{ currentClue.category }}</h2>
      <h3>{{ `$${currentClue.dollarAmount}` }}</h3>
    </div>
  </div>
</template>

<style>
.game-board {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  align-items: end;
  gap: 1px;
}
.column {
  color: v-bind('white');
  font-weight: 700;
}
.category {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 3rem;
  font-weight: inherit;
  line-height: 1rem;
  background: v-bind('blue');
}
.clue-button {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: .5rem;
  margin-top: 1px;
  border: none;
  font-size: inherit;
  font-weight: inherit;
  background-color: v-bind('blue');
  color: v-bind('dollarAmount');
}
</style>
