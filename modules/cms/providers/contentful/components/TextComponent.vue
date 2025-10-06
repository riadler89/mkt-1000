<template>
  <component
    :is="contentElement?.fields?.textType || 'p'"
    :class="classes"
    :data-contentful-entry-id="contentElement?.sys?.id"
    data-contentful-field-id="content"
    class="text-wrap"
  >
    {{ contentElement.fields?.content }}
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TypeTextComponentWithoutUnresolvableLinksResponse } from '../types'

const { contentElement } = defineProps<{
  contentElement: TypeTextComponentWithoutUnresolvableLinksResponse
}>()

const classes = computed(() => {
  switch (contentElement.fields?.textType) {
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
