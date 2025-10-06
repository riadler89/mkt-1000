<template>
  <SFLink
    :data-testid="`paginationButton-${page.number}`"
    :to="page.to"
    :class="{
      '!border-accent !text-accent': page.isActive && !disabled,
      'pointer-events-none': page.isActive || disabled,
    }"
    raw
    class="inline-flex h-full w-10 items-center justify-center border-t-2 border-transparent text-center text-sm text-secondary hover:border-gray-100 hover:text-black"
    @click="scrollToTop"
  >
    <slot>
      {{ page.number }}
    </slot>
  </SFLink>
</template>

<script setup lang="ts">
import type { Page } from '#storefront-ui'
import { SFLink } from '#storefront-ui/components'

const { page, disabled = false } = defineProps<{
  /** When true, the button is disabled and cannot be clicked. */
  disabled?: boolean
  /** Page object containing number, to (route), and isActive state. */
  page: Page
}>()

const scrollToTop = () => {
  setTimeout(() => window.scroll({ behavior: 'smooth', top: 0 }), 100)
}
</script>
