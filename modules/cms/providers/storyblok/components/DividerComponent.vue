<template>
  <div v-editable="contentElement" :class="spacing" class="w-full">
    <hr v-if="contentElement.showLine" />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { DividerComponent } from '../types'

const { contentElement } = defineProps<{ contentElement: DividerComponent }>()

const spacing = computed(() => {
  switch (contentElement.height) {
    case 'medium':
      return 'py-5 lg:py-9'
    case 'large':
      return 'py-9 lg:py-12'
    case 'small':
    default:
      return 'py-3 lg:py-5'
  }
})
</script>
