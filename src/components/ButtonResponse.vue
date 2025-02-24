<script setup lang="ts">

/* Interfaces */
import type { ClueResponse } from '@/interfaces/ClueResponse';

/* Styles */
import '../styles/button-response.css';

const props = defineProps<{
  clueResponse: ClueResponse
}>();

const { clueResponse } = props;
const buttonEmit = defineEmits(['onClickButton']);
</script>

<template>
  <button
    :key="`response-button-${clueResponse.name}`"
    @click="buttonEmit('onClickButton', clueResponse)"
    :class="[`button-response button-${clueResponse.name}`]"
  >
    <div></div>
    <div></div>
  </button>
</template>
