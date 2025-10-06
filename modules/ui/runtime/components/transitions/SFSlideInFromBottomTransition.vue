<template>
  <Transition
    :enter-active-class="`transform transition duration-${duration} ease-in-out`"
    enter-from-class="translate-y-full"
    enter-to-class="translate-y-0"
    leave-from-class="translate-y-0"
    leave-to-class="translate-y-full"
    :leave-active-class="`transform transition duration-${duration} ease-in-out`"
  >
    <slot />
  </Transition>
</template>

<script setup lang="ts">
import type { TransitionDuration } from '~~/modules/ui/types'

const { duration = 500 } = defineProps<{
  /**
   * Controls the duration of the slide transition in milliseconds. This component defaults to 500ms for a more dramatic effect.
   */
  duration?: TransitionDuration
}>()
</script>
