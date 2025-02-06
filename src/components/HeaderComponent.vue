<script setup lang="ts">
import { ref } from 'vue';

const categories = ref<string[]>([]);

const isRoutingActive: boolean = false;

function selectCategories() {
  console.log('Categories selected:', categories.value);
}
</script>

<template>
  <header>
    <div class="logo-and-categories">
      <span class="logo">Quiz Show Flow</span>
      <button @click="selectCategories" class="categories">Categories</button>
    </div>
    <nav v-if="isRoutingActive">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/score">Score</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.logo-and-categories {
  display: flex;
  justify-content: space-between;
  padding-bottom: 1rem;
  font-size: 1.5rem;
}
</style>
