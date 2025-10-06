<template>
  <Transition
    enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-full"
    :enter-active-class="`transition-[display,transform,overlay] transition-discrete starting:-translate-x-full duration-${duration} ease-in-out`"
    :leave-active-class="`transition-[display,transform,overlay] transition-discrete starting:-translate-x-full duration-${duration} ease-in-out`"
  >
    <slot />
  </Transition>
</template>

<script setup lang="ts">
import type { TransitionDuration } from '~~/modules/ui/types'

const { duration = 200 } = defineProps<{
  /**
   * Controls the duration of the slide transition in milliseconds. This component defaults to 500ms for a more dramatic effect.
   */
  duration?: TransitionDuration
}>()
</script>
