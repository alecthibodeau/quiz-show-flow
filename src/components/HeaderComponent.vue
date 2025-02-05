<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header>
    <h1>
      Quiz Show Flow
    </h1>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/score">Score</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
</style>
