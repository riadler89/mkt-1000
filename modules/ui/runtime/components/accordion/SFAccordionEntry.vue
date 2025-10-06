<template>
  <div
    class="flex flex-col py-4"
    :class="
      variant === 'wide' ? 'md:flex-row md:py-10' : 'lg:flex-row lg:py-10'
    "
  >
    <details
      ref="details"
      class="group peer"
      :class="
        variant === 'wide'
          ? 'open:max-md:mb-4 md:w-1/2'
          : 'open:max-lg:mb-0.5 lg:w-1/2'
      "
      :aria-details="id"
    >
      <summary class="list-none marker:hidden">
        <div
          class="flex w-full cursor-pointer gap-4"
          data-testid="mobile-nav-accordion"
          :class="
            variant === 'wide'
              ? 'max-md:justify-between md:h-min md:flex-row-reverse md:justify-end items-center'
              : 'max-lg:justify-between lg:h-min lg:flex-row-reverse lg:justify-end items-center'
          "
        >
          <slot name="title">
            {{ title }}
          </slot>
          <IconPlus class="size-6 text-black group-open:hidden" />
          <IconMinus class="hidden size-6 text-black group-open:block" />
        </div>
      </summary>
    </details>
    <div
      :id="id"
      ref="content"
      class="overflow-hidden text-md transition-all md:w-1/2"
      :class="variant === 'wide' ? 'md:w-1/2' : 'lg:w-1/2'"
      :style="dynamicHeight"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useEventListener } from '@vueuse/core'

const { variant = 'wide' } = defineProps<{
  /** The title text displayed in the accordion header. */
  title?: string
  /** Layout variant that affects spacing and responsive behavior. `narrow` is used for mobile, `wide` is used for desktop. */
  variant?: 'narrow' | 'wide'
  /** Unique identifier for the accordion entry. Used for aria-details to associate the trigger with its content for screen readers. */
  id: string
}>()

const open = ref(false)
const details = ref<HTMLDetailsElement>()
useEventListener(details, 'toggle', (event: ToggleEvent) => {
  open.value = event.newState === 'open'
})

const content = ref<HTMLDivElement>()
const dynamicHeight = computed(() =>
  open.value ? `height: ${content.value?.scrollHeight}px` : `height: 0px`,
)
</script>
