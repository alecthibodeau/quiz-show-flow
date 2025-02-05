<script setup lang="ts">
import { ref } from 'vue';

/* Interfaces */
import type { Column } from '../interfaces/Column';

const dollarAmountsFirst = ref<number[]>([200, 400, 600, 800, 1000]);

const columns = ref<Column[]>([
  { id: 0, category: 'Science', dollarAmounts: dollarAmountsFirst.value },
  { id: 1, category: 'World History', dollarAmounts: dollarAmountsFirst.value },
  { id: 2, category: 'Books', dollarAmounts: dollarAmountsFirst.value },
  { id: 3, category: 'Movies', dollarAmounts: dollarAmountsFirst.value },
  { id: 4, category: 'Global Landmarks', dollarAmounts: dollarAmountsFirst.value },
  { id: 5, category: 'Classical Music', dollarAmounts: dollarAmountsFirst.value }
]);
</script>

<template>
  <div class="score">
    <div class="game-board">
      <div v-for="column in columns" :key="column.id">
        <div>{{ column.category }}</div>
        <div v-for="dollarAmount in column.dollarAmounts" :key="dollarAmount">
          <div>{{ dollarAmount }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.game-board {
  display: flex;
}
</style>
