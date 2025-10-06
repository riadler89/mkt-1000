<template>
  <SFFadeInTransition :duration="150">
    <SFButton
      v-if="!arrivedState.top"
      variant="secondary"
      v-bind="$attrs"
      class="z-20 !size-13 rounded-xl !border-secondary !p-0 !text-gray-500 transition-transform duration-150 ease-in-out"
      :aria-label="$t('global.scroll_to_top_label')"
      @click="scrollToTop"
    >
      <template #icon>
        <IconChevronUp class="size-5" />
      </template>
    </SFButton>
  </SFFadeInTransition>
</template>

<script setup lang="ts">
import { useScroll } from '@vueuse/core'
import { SFFadeInTransition, SFButton } from '#storefront-ui/components'

const { arrivedState } = useScroll(window)

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
</script>
