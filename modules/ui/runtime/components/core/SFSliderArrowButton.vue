<template>
  <button
    class="flex items-center justify-center p-2 text-secondary shadow transition-transform duration-300 focus-within:shadow-secondary hover:text-primary focus-visible:shadow-outer-solid disabled:hover:translate-x-0 disabled:hover:text-secondary"
    :class="{
      '-left-2 hover:translate-x-1': isLeft && translateOnHover,
      '-right-2 hover:-translate-x-1': !isLeft && translateOnHover,
      'rounded-r-full': isLeft !== invertedRadius,
      'rounded-l-full': isLeft === invertedRadius,
    }"
    :disabled="disabled"
  >
    <component :is="icon" class="size-4" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconChevronLeft, IconChevronRight } from '#components'

const { direction, invertedRadius = false } = defineProps<{
  /**
   * Disables the button when navigation is not possible (e.g., at the start or end of a slider).
   * @default false
   */
  disabled: boolean
  /**
   * Determines the arrow direction. Use "left" for previous navigation and "right" for next navigation..
   */
  direction: 'left' | 'right'
  /**
   * Applies an inverted border radius style. Useful for buttons that need to align with specific container shapes.
   */
  invertedRadius?: boolean
  /**
   * Enables a translation effect on hover. Adds a subtle movement to improve user interaction feedback.
   */
  translateOnHover?: boolean
}>()

const isLeft = computed(() => direction === 'left')
const icon = computed(() => (isLeft.value ? IconChevronLeft : IconChevronRight))
</script>
