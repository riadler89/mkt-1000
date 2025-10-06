<template>
  <component
    :is="contentElement?.textType || 'p'"
    v-editable="contentElement"
    :class="classes"
    class="text-wrap"
  >
    {{ contentElement?.content }}
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TextComponent } from '../types'

const { contentElement } = defineProps<{
  contentElement: TextComponent
}>()
const classes = computed(() => {
  switch (contentElement.textType) {
    case 'h1':
      return 'text-3xl font-semibold'
    case 'h2':
      return 'text-2xl font-semibold'
    case 'h3':
      return 'text-xl font-semibold'
    case 'h4':
      return 'text-lg font-semibold'
    default:
      return ''
  }
})
</script>
