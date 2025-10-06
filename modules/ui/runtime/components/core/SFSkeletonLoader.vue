<template>
  <div
    class="animate-pulse bg-gray-300"
    :class="{
      'h-12 rounded-md': isButton,
      'h-8': isHeadline,
      'w-32 md:w-64': !fullWidth && (isHeadline || isButton),
      'w-full': fullWidth,
    }"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SkeletonType } from '#storefront-ui'

const { type = SkeletonType.BUTTON, fullWidth = false } = defineProps<{
  /**
   * The type of skeleton to display. Each type has predefined dimensions and styling.
   */
  type?: SkeletonType
  /**
   * Whether the skeleton should take the full width of its container.
   */
  fullWidth?: boolean
}>()

const isButton = computed(() => type === SkeletonType.BUTTON)
const isHeadline = computed(() => type === SkeletonType.HEADLINE)
</script>
