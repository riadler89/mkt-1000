<template>
  <div
    :class="spacing"
    class="w-full"
    :data-contentful-entry-id="contentElement?.sys?.id"
    data-contentful-field-id="height"
  >
    <hr v-if="contentElement.fields.showLine" />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { ChainModifiers, LocaleCode } from 'contentful'
import type { TypeDividerComponent } from '../types'

const { contentElement } = defineProps<{
  contentElement: TypeDividerComponent<ChainModifiers, LocaleCode>
}>()

const spacing = computed(() => {
  switch (contentElement.fields.height) {
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
