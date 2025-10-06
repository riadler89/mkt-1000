<template>
  <Transition
    :enter-active-class="`transform transition duration-${duration} ease-in-out`"
    :leave-active-class="`transform transition duration-${duration} ease-in-out`"
    enter-from-class="translate-y-2 opacity-0"
    enter-to-class="opacity-100 translate-y-0"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <slot />
  </Transition>
</template>

<script setup lang="ts">
import type { TransitionDuration } from '~~/modules/ui/types'

const { duration = 200 } = defineProps<{
  /**
   * Controls the duration of the fade and slide transition in milliseconds. The subtle movement works well with shorter durations.
   */
  duration?: TransitionDuration
}>()
</script>
