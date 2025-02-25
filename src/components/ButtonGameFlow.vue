<script setup lang="ts">

const props = defineProps<{ buttonName: string }>();
const { buttonName } = props;
const buttonClass: string = buttonName.toLowerCase().replace(/\s/g, '-');
</script>

<template>
  <button :class="`button-app button-secondary ${buttonClass}`">
    {{ buttonName }}
  </button>
</template>
