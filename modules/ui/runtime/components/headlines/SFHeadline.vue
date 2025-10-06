<template>
  <component
    :is="tag"
    data-testid="headline"
    class="flex items-center gap-2 leading-tight"
    :class="[
      HeadlineClass[size],
      isBold ? 'font-bold' : 'font-semibold',
      { uppercase: isUppercase },
    ]"
  >
    <slot />
    <slot :badge="badge" name="badge">
      <span
        v-if="badge"
        class="rounded-full bg-secondary p-1 px-3 text-sm text-gray-300"
      >
        {{ badge }}
      </span>
    </slot>
  </component>
</template>

<script setup lang="ts">
import { HeadlineSize, HeadlineTag } from '#storefront-ui'

const {
  isUppercase = false,
  size = HeadlineSize['2XL'],
  tag = HeadlineTag.P,
  isBold = false,
} = defineProps<{
  /**
   * Determines whether the headline text should be displayed in uppercase.
   */
  isUppercase?: boolean
  /**
   * Controls whether the headline text should be bold. Switches between `font-bold` and `font-semibold`. Depending on the used font, the difference might not be noticeable on certain screens.
   */
  isBold?: boolean
  /**
   * The badge text to display alongside the headline.
   * If not provided, no badge will be rendered.
   */
  badge?: string
  /**
   * Specifies the size of the headline.
   */
  size?: HeadlineSize
  /**
   * Specifies the HTML tag to use for the headline.
   */
  tag?: HeadlineTag
}>()

const HeadlineClass = {
  [HeadlineSize['3XL']]: 'text-3xl',
  [HeadlineSize['2XL']]: 'text-2xl',
  [HeadlineSize.XL]: 'text-xl',
  [HeadlineSize.LG]: 'text-lg',
  [HeadlineSize.MD]: 'text-md',
  [HeadlineSize.SM]: 'text-sm',
} as Record<HeadlineSize, string>
</script>
