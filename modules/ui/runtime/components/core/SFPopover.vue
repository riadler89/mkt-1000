<template>
  <div
    data-testid="popoverContainer"
    class="relative h-full"
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
  >
    <div class="inline-flex size-full items-center justify-center">
      <slot name="action" />
    </div>
    <ClientOnly>
      <SFFadeInFromBottomTransition appear>
        <!-- The transparent border is crucial for keeping the hover state while moving the cursor between the action and content, prevent the popover from flickering.  -->
        <div
          v-if="isOpen"
          class="absolute right-0 z-20 hidden min-w-max overflow-hidden border-t-8 border-transparent bg-clip-content supports-hover:block"
        >
          <div
            class="overflow-hidden rounded-lg border border-gray-400 bg-white"
          >
            <slot name="content" />
          </div>
        </div>
      </SFFadeInFromBottomTransition>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { SFFadeInFromBottomTransition } from '#storefront-ui/components'
import { ClientOnly } from '#components'

const { isOpen = false } = defineProps<{
  /**
   * Controls the visibility of the popover content. Use this for programmatic control.
   */
  isOpen?: boolean
}>()

defineEmits<{ mouseenter: []; mouseleave: [] }>()
</script>
