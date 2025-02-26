<script setup lang="ts">
import { onMounted, ref } from 'vue';

/* Interfaces */
import type { ClueResponse } from '@/interfaces/ClueResponse';

/* Styles */
import '../styles/button-response.css';

const props = defineProps<{
  clueResponse: ClueResponse
}>();

const { clueResponse } = props;
const buttonEmit = defineEmits(['onClickButton']);
const deviceType = ref<string>('');
const mobileDevicesNames: RegExp = /Mobile|Android|iPhone|webOS|iPad/i;
const unicodeWhiteCircle: string = '\u25cb';

onMounted(() => {
  deviceType.value = mobileDevicesNames.test(navigator.userAgent) ?
    'mobile' :
    'desktop';
});
</script>

<template>
  <button
    :key="`${clueResponse.name}ResponseButton`"
    @click="buttonEmit('onClickButton', clueResponse)"
    :class="[`button-response button-${clueResponse.name}`]"
    :aria-label="clueResponse.name"
  >
    <div></div>
    <div>
      <span :class=[deviceType]>
        {{ unicodeWhiteCircle }}
      </span>
    </div>
  </button>
</template>
